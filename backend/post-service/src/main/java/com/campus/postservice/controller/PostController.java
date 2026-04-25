package com.campus.postservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.postservice.dto.AddCommentRequest;
import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.entity.Post;
import com.campus.postservice.response.ApiResponse;
import com.campus.postservice.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private  PostService postService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createPost(
            @Valid @RequestBody CreatePostRequest request) {

        ApiResponse<?> response = ApiResponse.success(
                postService.createPost(request),
                "Post created successfully"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<?>> getFeed() {
       
        ApiResponse<?> response =
                ApiResponse.success(
                        postService.getFeed(),
                        "Feed fetched successfully");

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<?>> likePost(
            @PathVariable Long postId) {

        postService.likePost(postId);

        ApiResponse<?> response =
                ApiResponse.success(
                        null,
                        "Post liked successfully");

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<?>> addComment(
            @PathVariable Long postId,
            @RequestBody AddCommentRequest request) {

        postService.addComment(postId, request);

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Comment added successfully"));
    }
    @GetMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<?>> getComments(
            @PathVariable Long postId) {

        return ResponseEntity.ok(
            ApiResponse.success(
                postService.getComments(postId),
                "Comments fetched successfully"));
    }
    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<?>> deletePost(
            @PathVariable Long postId) {

        postService.deletePost(postId);

        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Post deleted successfully"));
    }
   
}
