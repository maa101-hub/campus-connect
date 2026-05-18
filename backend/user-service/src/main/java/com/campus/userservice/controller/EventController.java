package com.campus.userservice.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.userservice.entity.Event;
import com.campus.userservice.entity.EventRsvp;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * POST /api/events — Create a new event.
     */
    @PostMapping
    public ApiResponse<Event> createEvent(@RequestBody Map<String, Object> body) {
        Event event = Event.builder()
                .organizerId(Long.valueOf(body.get("organizerId").toString()))
                .organizerName((String) body.get("organizerName"))
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .collegeName((String) body.get("collegeName"))
                .eventDate(LocalDateTime.parse((String) body.get("eventDate")))
                .location((String) body.get("location"))
                .category((String) body.getOrDefault("category", "OTHER"))
                .maxAttendees(Integer.valueOf(body.getOrDefault("maxAttendees", 50).toString()))
                .rsvpCount(0)
                .active(true)
                .build();

        Event saved = eventService.createEvent(event);
        return ApiResponse.success(saved, "Event created successfully");
    }

    /**
     * GET /api/events?collegeName={collegeName} — Get events for a college.
     */
    @GetMapping
    public ApiResponse<List<Event>> getEvents(
            @RequestParam(required = false) String collegeName) {
        List<Event> events;
        if (collegeName != null && !collegeName.isEmpty()) {
            events = eventService.getCollegeEvents(collegeName);
        } else {
            events = eventService.getUpcomingEvents();
        }
        return ApiResponse.success(events, "Events fetched successfully");
    }

    /**
     * GET /api/events/{id} — Get event details.
     */
    @GetMapping("/{id}")
    public ApiResponse<Event> getEvent(@PathVariable Long id) {
        Event event = eventService.getEvent(id);
        return ApiResponse.success(event, "Event fetched");
    }

    /**
     * POST /api/events/{id}/rsvp — RSVP to an event.
     */
    @PostMapping("/{id}/rsvp")
    public ApiResponse<?> rsvpEvent(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String userName) {
        try {
            boolean isNew = eventService.rsvpEvent(id, userId, userName);
            if (isNew) {
                return ApiResponse.success(null, "RSVP successful!");
            } else {
                return ApiResponse.success(null, "You have already RSVP'd");
            }
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage(), null);
        }
    }

    /**
     * DELETE /api/events/{id}/rsvp — Cancel RSVP.
     */
    @DeleteMapping("/{id}/rsvp")
    public ApiResponse<?> cancelRsvp(
            @PathVariable Long id,
            @RequestParam Long userId) {
        eventService.cancelRsvp(id, userId);
        return ApiResponse.success(null, "RSVP cancelled");
    }

    /**
     * GET /api/events/{id}/attendees — Get event attendees.
     */
    @GetMapping("/{id}/attendees")
    public ApiResponse<List<EventRsvp>> getAttendees(@PathVariable Long id) {
        return ApiResponse.success(eventService.getAttendees(id), "Attendees fetched");
    }

    /**
     * GET /api/events/user-rsvps?userId={userId} — Get event IDs user RSVP'd to.
     */
    @GetMapping("/user-rsvps")
    public ApiResponse<List<Long>> getUserRsvps(@RequestParam Long userId) {
        return ApiResponse.success(eventService.getUserRsvpEventIds(userId), "User RSVPs fetched");
    }
}
