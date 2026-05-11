package com.campus.userservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // College info
    @Column(nullable = false)
    private Long collegeId;

    @Column(nullable = false)
    private String collegeName;

    // Verification
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    @Column(name = "is_email_verified")
    private Boolean emailVerified = false;

    // Role
    @Enumerated(EnumType.STRING)
    private Role role;

    // Advanced Profile Info
    private String bio;
    private String major;
    private String yearOfStudy;
    private String skills;
    private String interests;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
