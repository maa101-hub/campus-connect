package com.campus.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizerId;

    @Column(nullable = false)
    private String organizerName;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String collegeName;

    // Event details
    @Column(nullable = false)
    private LocalDateTime eventDate;

    private String location;

    private String category; // HACKATHON, WORKSHOP, CULTURAL, SPORTS, SEMINAR, OTHER

    private String imageUrl;

    // Counters
    @Column(columnDefinition = "integer default 0")
    private Integer rsvpCount = 0;

    @Column(columnDefinition = "integer default 50")
    private Integer maxAttendees = 50;

    private Boolean active = true;

    // Timestamps
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
