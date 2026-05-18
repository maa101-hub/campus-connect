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

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getCollegeEvents(String collegeName) {
        return eventRepository.findByCollegeNameAndActiveTrueOrderByEventDateAsc(collegeName);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents();
    }

    public Event getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Transactional
    public boolean rsvpEvent(Long eventId, Long userId, String userName) {
        if (rsvpRepository.existsByEventIdAndUserId(eventId, userId)) {
            return false;
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getRsvpCount() >= event.getMaxAttendees()) {
            throw new RuntimeException("Event is at full capacity");
        }

        EventRsvp rsvp = new EventRsvp();
        rsvp.setEventId(eventId);
        rsvp.setUserId(userId);
        rsvp.setUserName(userName);
        rsvpRepository.save(rsvp);

        event.setRsvpCount(event.getRsvpCount() + 1);
        eventRepository.save(event);

        return true;
    }

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

    public boolean hasRsvp(Long eventId, Long userId) {
        return rsvpRepository.existsByEventIdAndUserId(eventId, userId);
    }

    public List<EventRsvp> getAttendees(Long eventId) {
        return rsvpRepository.findByEventId(eventId);
    }

    public List<Long> getUserRsvpEventIds(Long userId) {
        return rsvpRepository.findByUserId(userId).stream()
                .map(EventRsvp::getEventId)
                .toList();
    }
}
