package com.campus.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket controller for handling typing indicator events.
 * Clients send typing status via STOMP to /app/typing
 * and recipients receive it on /topic/typing/{recipientId}
 */
@Controller
public class TypingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Receives typing events from clients.
     * Payload: { "senderId": 1, "recipientId": 2, "typing": true }
     */
    @MessageMapping("/typing")
    public void handleTyping(@Payload Map<String, Object> payload) {
        Object recipientId = payload.get("recipientId");
        if (recipientId != null) {
            // Broadcast typing status to the recipient
            // Cast payload to Object to avoid ambiguous overload resolution
            messagingTemplate.convertAndSend(
                "/topic/typing/" + recipientId,
                (Object) payload
            );
        }
    }
}
