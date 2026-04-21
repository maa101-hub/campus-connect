package com.campus.postservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PostResponse;
import com.campus.postservice.entity.Post;
import com.campus.postservice.repo.PostRepository;
import org.slf4j.*;
@Service
public class PostServiceImpl implements PostService {

    @Autowired private  PostRepository postRepository;
    private static final Logger log = LoggerFactory.getLogger(PostServiceImpl.class);
    @Override
    public PostResponse createPost(CreatePostRequest request) {

        log.info("Creating post for user: {}", request.getUsername());

        Post post = new Post();
        post.setUserId(request.getUserId());
        post.setUsername(request.getUsername());
        post.setCollegeName(request.getCollegeName());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());

        Post saved = postRepository.save(post);

        log.info("Post created successfully id={}", saved.getId());

        PostResponse response = new PostResponse();
        response.setId(saved.getId());
        response.setUsername(saved.getUsername());
        response.setContent(saved.getContent());
        response.setCollegeName(saved.getCollegeName());
        log.info("PostResponse created successfully for post id={}", saved.getId());
        return response;
    }
}