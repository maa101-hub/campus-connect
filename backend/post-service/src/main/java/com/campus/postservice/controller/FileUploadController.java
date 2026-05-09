package com.campus.postservice.controller;

import com.campus.postservice.response.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts/upload")
public class FileUploadController {

    private final String uploadDir = "uploads/";

    @PostMapping
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "File is empty", null));
        }

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);
            Files.write(path, file.getBytes());

            // In a real app, this would be a URL to the file
            String fileUrl = "/api/posts/upload/files/" + fileName;
            
            return ResponseEntity.ok(ApiResponse.success(fileUrl, "File uploaded successfully"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(500, "Upload failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/files/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws IOException {
        Path path = Paths.get(uploadDir + fileName);
        byte[] image = Files.readAllBytes(path);
        return ResponseEntity.ok(image);
    }
}
