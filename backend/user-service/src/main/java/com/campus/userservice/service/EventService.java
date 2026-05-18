package com.campus.userservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.userservice.entity.Event;
import com.campus.userservice.entity.EventRsvp;
import com.campus.userservice.repository.EventRepository;
import com.campus.userservice.repository.EventRsvpRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRsvpRepository rsvpRepository;

    /**
     * Create a new event.
     */
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    /**
     * Get all upcoming events for a college.
     */
    public List<Event> getCollegeEvents(String collegeName) {
        return eventRepository.findByCollegeNameAndActiveTrueOrderByEventDateAsc(collegeName);
    }

    /**
     * Get all upcoming events across all colleges.
     */
    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents();
    }

    /**
     * Get event by ID.
     */
    public Event getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    /**
     * RSVP to an event. Returns true if newly RSVP'd, false if already RSVP'd.
     */
    @Transactional
    public boolean rsvpEvent(Long eventId, Long userId, String userName) {
        // Check if already RSVP'd
        if (rsvpRepository.existsByEventIdAndUserId(eventId, userId)) {
            return false;
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check capacity
        if (event.getRsvpCount() >= event.getMaxAttendees()) {
            throw new RuntimeException("Event is at full capacity");
        }

        // Create RSVP
        EventRsvp rsvp = EventRsvp.builder()
                .eventId(eventId)
                .userId(userId)
                .userName(userName)
                .build();
        rsvpRepository.save(rsvp);

        // Increment count
        event.setRsvpCount(event.getRsvpCount() + 1);
        eventRepository.save(event);

        return true;
    }

    /**
     * Cancel RSVP.
     */
    @Transactional
    public void cancelRsvp(Long eventId, Long userId) {
        rsvpRepository.findByEventIdAndUserId(eventId, userId).ifPresent(rsvp -> {
            rsvpRepository.delete(rsvp);
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event != null && event.getRsvpCount() > 0) {
                event.setRsvpCount(event.getRsvpCount() - 1);
                eventRepository.save(event);
            }
        });
    }

    /**
     * Check if user has RSVP'd to an event.
     */
    public boolean hasRsvp(Long eventId, Long userId) {
        return rsvpRepository.existsByEventIdAndUserId(eventId, userId);
    }

    /**
     * Get attendees for an event.
     */
    public List<EventRsvp> getAttendees(Long eventId) {
        return rsvpRepository.findByEventId(eventId);
    }

    /**
     * Get events user has RSVP'd to.
     */
    public List<Long> getUserRsvpEventIds(Long userId) {
        return rsvpRepository.findByUserId(userId).stream()
                .map(EventRsvp::getEventId)
                .toList();
    }
}
