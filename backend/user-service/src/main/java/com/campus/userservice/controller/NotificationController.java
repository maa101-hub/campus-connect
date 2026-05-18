package com.campus.userservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.userservice.entity.Notification;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * GET /api/notifications?userId={userId}
     * Get all notifications for the authenticated user.
     */
    @GetMapping
    public ApiResponse<List<Notification>> getNotifications(@RequestParam Long userId) {
        List<Notification> notifications = notificationService.getNotifications(userId);
        return ApiResponse.success(notifications, "Notifications fetched successfully");
    }

    /**
     * GET /api/notifications/unread-count?userId={userId}
     * Get the count of unread notifications.
     */
    @GetMapping("/unread-count")
    public ApiResponse<Map<String, Long>> getUnreadCount(@RequestParam Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ApiResponse.success(Map.of("count", count), "Unread count fetched");
    }

    /**
     * POST /api/notifications/mark-all-read?userId={userId}
     * Mark all notifications as read.
     */
    @PostMapping("/mark-all-read")
    public ApiResponse<?> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ApiResponse.success(null, "All notifications marked as read");
    }

    /**
     * POST /api/notifications/{id}/read
     * Mark a single notification as read.
     */
    @PostMapping("/{id}/read")
    public ApiResponse<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null, "Notification marked as read");
    }
}
