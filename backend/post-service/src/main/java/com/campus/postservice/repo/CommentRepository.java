package com.campus.postservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.postservice.entity.Comment;

public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}