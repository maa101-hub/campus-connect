package com.campus.userservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campus.userservice.entity.Notification;
import com.campus.userservice.entity.NotificationType;
import com.campus.userservice.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Create a new notification for a user.
     */
    public Notification createNotification(Long recipientId, Long actorId, String actorName,
                                           NotificationType type, String message, Long referenceId) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .actorId(actorId)
                .actorName(actorName)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user (newest first).
     */
    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get unread notifications count.
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    /**
     * Mark all notifications as read for a user.
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    /**
     * Mark a single notification as read.
     */
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
