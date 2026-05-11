package com.campus.postservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collaboration_opportunities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationOpportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private String authorName;

    private String category; // e.g., tech, design, marketing

    private String tags; // Comma separated

    private String difficultyLevel; // Beginner Friendly, Intermediate, Advanced

    private int applicantsCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.applicantsCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
