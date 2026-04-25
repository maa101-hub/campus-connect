package com.campus.postservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "post_likes",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {
               "postId", "userId"
           })
       })
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long postId;

    private Long userId;

    public PostLike() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}