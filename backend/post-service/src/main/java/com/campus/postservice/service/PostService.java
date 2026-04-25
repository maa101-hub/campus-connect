package com.campus.postservice.service;

import java.util.List;

import com.campus.postservice.dto.AddCommentRequest;
import com.campus.postservice.dto.CommentResponse;
import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PostResponse;

public interface PostService {
	PostResponse createPost(CreatePostRequest request);
	List<PostResponse> getFeed();
	void likePost(Long postId);
	void addComment(Long postId, AddCommentRequest request);

	List<CommentResponse> getComments(Long postId);
	void deletePost(Long postId);
}
