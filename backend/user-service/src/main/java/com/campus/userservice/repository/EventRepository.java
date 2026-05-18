package com.campus.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.campus.userservice.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Get events for a specific college, newest first
    List<Event> findByCollegeNameAndActiveTrueOrderByEventDateAsc(String collegeName);

    // Get all active upcoming events
    @Query("SELECT e FROM Event e WHERE e.active = true AND e.eventDate >= CURRENT_TIMESTAMP ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents();

    // Get events by organizer
    List<Event> findByOrganizerId(Long organizerId);

    // Get events by category
    List<Event> findByCollegeNameAndCategoryAndActiveTrue(String collegeName, String category);
}
