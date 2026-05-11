package com.campus.postservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollabRequest {
    private String title;
    private String description;
    private String role;
    private String category;
    private String tags;
    private String difficultyLevel;
    private Long authorId;
    private String authorName;
}
