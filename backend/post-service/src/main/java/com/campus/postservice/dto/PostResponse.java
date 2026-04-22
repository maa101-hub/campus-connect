package com.campus.postservice.dto;

import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String username;
    private String content;
    private String collegeName;
    private String imageUrl;
    private Integer likeCount;
    private Integer commentCount;
    private LocalDateTime createdAt;

    public PostResponse() {
    }

    public PostResponse(Long id, String username, String content, String collegeName,
                        String imageUrl, Integer likeCount,
                        Integer commentCount, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.content = content;
        this.collegeName = collegeName;
        this.imageUrl = imageUrl;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getLikeCount() { return likeCount; }
    public void setLikeCount(Integer likeCount) { this.likeCount = likeCount; }

    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}