package com.campus.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campus.userservice.entity.EventRsvp;

@Repository
public interface EventRsvpRepository extends JpaRepository<EventRsvp, Long> {

    // Check if user already RSVP'd
    Optional<EventRsvp> findByEventIdAndUserId(Long eventId, Long userId);

    // Get all RSVPs for an event
    List<EventRsvp> findByEventId(Long eventId);

    // Get all events a user has RSVP'd to
    List<EventRsvp> findByUserId(Long userId);

    // Count RSVPs for an event
    long countByEventId(Long eventId);

    // Check existence
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
}
