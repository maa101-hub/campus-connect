package com.campus.postservice.service;

import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PostResponse;

public interface PostService {
	PostResponse createPost(CreatePostRequest request);
}
