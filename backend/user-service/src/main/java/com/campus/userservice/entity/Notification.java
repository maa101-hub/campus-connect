package com.campus.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who receives the notification
    @Column(nullable = false)
    private Long recipientId;

    // The user who triggered the notification (nullable for system notifications)
    private Long actorId;

    // Actor display name (denormalized for quick display)
    private String actorName;

    // Notification type: LIKE, COMMENT, CONNECTION_REQUEST, CONNECTION_ACCEPTED, SYSTEM, MENTION
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    // Human-readable message
    @Column(nullable = false, length = 500)
    private String message;

    // Optional reference to related entity (e.g., postId)
    private Long referenceId;

    // Read status
    @Column(nullable = false)
    private boolean isRead = false;

    // Timestamp
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
