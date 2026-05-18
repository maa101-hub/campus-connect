package com.campus.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_rsvps", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"eventId", "userId"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    private LocalDateTime rsvpDate;

    @PrePersist
    protected void onCreate() {
        this.rsvpDate = LocalDateTime.now();
    }
}
