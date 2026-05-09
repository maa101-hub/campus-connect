package com.campus.postservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campus.postservice.dto.AddCommentRequest;
import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.UpdatePostRequest;
import com.campus.postservice.response.ApiResponse;
import com.campus.postservice.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private  PostService postService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createPost(@Valid @RequestBody CreatePostRequest request) {
        ApiResponse<?> response = ApiResponse.success(postService.createPost(request), "Post created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<?>> getFeed(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(postService.getFeed(userId, page, size), "Feed fetched successfully"));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<?>> addComment(@PathVariable Long postId, @RequestBody AddCommentRequest request) {
        postService.addComment(postId, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Comment added successfully"));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<?>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.success(postService.getComments(postId), "Comments fetched successfully"));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<?>> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted successfully"));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<ApiResponse<?>> updatePost(@PathVariable Long postId, @RequestBody UpdatePostRequest request) {
		postService.updatePost(postId, request);
		return ResponseEntity.ok(ApiResponse.success(null, "Post updated successfully"));
	}

    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<?>> toggleLike(@PathVariable Long postId, @RequestParam Long userId) {
        String message = postService.toggleLike(postId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, message));
    }

    @GetMapping("/feed/college")
    public ResponseEntity<ApiResponse<?>> getCollegeFeed(
            @RequestParam(required = false) Long userId,
            @RequestParam String collegeName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(postService.getCollegeFeed(userId, collegeName, page, size), "College feed fetched successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getUserPosts(
            @PathVariable("userId") Long targetUserId,
            @RequestParam(required = false, name="currentUserId") Long currentUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(postService.getUserPosts(currentUserId, targetUserId, page, size), "User posts fetched successfully"));
    }
}
