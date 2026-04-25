package com.campus.postservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.postservice.dto.AddCommentRequest;
import com.campus.postservice.dto.CommentResponse;
import com.campus.postservice.dto.CreatePostRequest;
import com.campus.postservice.dto.PostResponse;
import com.campus.postservice.dto.UpdatePostRequest;
import com.campus.postservice.entity.Comment;
import com.campus.postservice.entity.Post;
import com.campus.postservice.entity.PostLike;
import com.campus.postservice.repo.CommentRepository;
import com.campus.postservice.repo.PostLikeRepository;
import com.campus.postservice.repo.PostRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.*;
@Service
public class PostServiceImpl implements PostService {

    @Autowired private  PostRepository postRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private PostLikeRepository postLikeRepository;
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
    @Override
    public void addComment(Long postId,
                           AddCommentRequest request) {

        log.info("Adding comment on postId: {}", postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                    new RuntimeException("Post not found"));

        Comment comment = new Comment();

        comment.setPostId(postId);
        comment.setUserId(request.getUserId());
        comment.setUsername(request.getUsername());
        comment.setContent(request.getContent());

        commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        log.info("Comment added successfully on postId: {}",
                postId);
    }
    @Override
    public List<CommentResponse> getComments(Long postId) {

        log.info("Fetching comments for postId: {}", postId);

        List<Comment> comments =
            commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        List<CommentResponse> response = new ArrayList<>();

        for (Comment comment : comments) {

            CommentResponse dto = new CommentResponse();

            dto.setId(comment.getId());
            dto.setUsername(comment.getUsername());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());

            response.add(dto);
        }

        return response;
    }
    @Override
    public void deletePost(Long postId) {

        log.info("Delete request received for postId: {}", postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                    new RuntimeException("Post not found"));

        if (!post.getActive()) {
            throw new RuntimeException("Post already deleted");
        }

        post.setActive(false);

        postRepository.save(post);

        log.info("Post deleted successfully. postId: {}", postId);
    }
    @Override 
    public void updatePost(Long postId, UpdatePostRequest request) {

		log.info("Update request received for postId: {}", postId);

		Post post = postRepository.findById(postId)
				.orElseThrow(() ->
					new RuntimeException("Post not found"));

		if (!post.getActive()) {
			throw new RuntimeException("Cannot update deleted post");
		}

		post.setContent(request.getContent());

		postRepository.save(post);

		log.info("Post updated successfully. postId: {}", postId);
    }
    @Override
    public String toggleLike(Long postId,
                             Long userId) {

        log.info("Like toggle request postId={}, userId={}",
                postId, userId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                    new RuntimeException("Post not found"));

        Optional<PostLike> existingLike =
            postLikeRepository
            .findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {

            postLikeRepository.delete(existingLike.get());

            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);

            log.info("Post unliked");

            return "Post unliked successfully";

        } else {

            PostLike like = new PostLike();
            like.setPostId(postId);
            like.setUserId(userId);

            postLikeRepository.save(like);

            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);

            log.info("Post liked");

            return "Post liked successfully";
        }
    }
}