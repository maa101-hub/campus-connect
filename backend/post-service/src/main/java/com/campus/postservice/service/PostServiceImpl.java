package com.campus.postservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PostResponse;
import com.campus.postservice.entity.Post;
import com.campus.postservice.repo.PostRepository;

import java.util.ArrayList;
import java.util.List;

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
    @Override
    public List<PostResponse> getFeed() {

        log.info("Fetching feed posts");

        List<Post> posts =
                postRepository.findByActiveTrueOrderByCreatedAtDesc();
        log.info("Total active posts fetched: {}", posts.size());
        List<PostResponse> responseList = new ArrayList<>();

        for (Post post : posts) {

            PostResponse response = new PostResponse();

            response.setId(post.getId());
            response.setUsername(post.getUsername());
            response.setContent(post.getContent());
            response.setCollegeName(post.getCollegeName());
            response.setImageUrl(post.getImageUrl());
            response.setLikeCount(post.getLikeCount());
            response.setCommentCount(post.getCommentCount());
            response.setCreatedAt(post.getCreatedAt());

            responseList.add(response);
        }

        log.info("Feed fetched successfully. Total posts: {}",
                responseList.size());

        return responseList;
    }
}