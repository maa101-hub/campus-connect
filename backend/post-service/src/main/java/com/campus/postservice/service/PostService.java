package com.campus.postservice.service;

import java.util.List;

import com.campus.postservice.dto.AddCommentRequest;
import com.campus.postservice.dto.CommentResponse;
import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PagedResponse;
import com.campus.postservice.dto.PostResponse;
import com.campus.postservice.dto.UpdatePostRequest;

public interface PostService {
	PostResponse createPost(CreatePostRequest request);
	PagedResponse<PostResponse> getFeed(int page, int size);
	void addComment(Long postId, AddCommentRequest request);
	List<CommentResponse> getComments(Long postId);
	void deletePost(Long postId);
	void updatePost(Long postId, UpdatePostRequest request);
	String toggleLike(Long postId, Long userId);
	PagedResponse<PostResponse> getCollegeFeed(
	        String collegeName,
	        int page,
	        int size);
}
