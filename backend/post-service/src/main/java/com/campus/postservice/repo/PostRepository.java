package com.campus.postservice.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.postservice.entity.Post;

public interface PostRepository  extends JpaRepository<Post, Long> {
	Page<Post> findByActiveTrue(Pageable pageable);
	Page<Post> findByActiveTrueAndCollegeNameOrderByCreatedAtDesc(
	        String collegeName,
	        Pageable pageable);
	Page<Post> findByActiveTrueAndUserIdOrderByCreatedAtDesc(
	        Long userId,
	        Pageable pageable);
}
