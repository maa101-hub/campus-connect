package com.campus.postservice.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.postservice.entity.PostLike;

public interface PostLikeRepository
        extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByPostIdAndUserId(
            Long postId,
            Long userId);
}