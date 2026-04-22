package com.campus.postservice.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.postservice.entity.Post;

public interface PostRepository  extends JpaRepository<Post, Long> {
	 List<Post> findByActiveTrueOrderByCreatedAtDesc();
}
