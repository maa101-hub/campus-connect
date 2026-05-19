package com.campus.postservice.controller;

import com.campus.postservice.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/webm"
    );

    @PostMapping
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "File is empty", null));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "File exceeds 10MB limit", null));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "File type not allowed. Accepted: JPEG, PNG, GIF, WebP, MP4, WebM", null));
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate safe filename — strip original name to prevent path traversal
            String extension = getExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(fileName).normalize();

            // Ensure the resolved path is still within upload directory
            if (!filePath.startsWith(uploadPath.toAbsolutePath().normalize())) {
                return ResponseEntity.badRequest().body(ApiResponse.error(400, "Invalid file path", null));
            }

            Files.write(filePath, file.getBytes());

            String fileUrl = "/api/posts/upload/files/" + fileName;
            return ResponseEntity.ok(ApiResponse.success(fileUrl, "File uploaded successfully"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(500, "Upload failed", null));
        }
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws IOException {
        // Sanitize filename — prevent path traversal
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            return ResponseEntity.badRequest().build();
        }

        Path path = Paths.get(UPLOAD_DIR + fileName).normalize();
        if (!path.startsWith(Paths.get(UPLOAD_DIR).toAbsolutePath().normalize())) {
            return ResponseEntity.badRequest().build();
        }

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = Files.readAllBytes(path);
        String contentType = Files.probeContentType(path);
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Cache-Control", "public, max-age=86400")
                .body(fileBytes);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        String ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        // Only allow safe extensions
        Set<String> safeExtensions = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm");
        return safeExtensions.contains(ext) ? ext : "";
    }
}
