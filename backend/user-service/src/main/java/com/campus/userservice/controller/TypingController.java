package com.campus.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.campus.userservice.dto.TypingEvent;

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
     *
     * Using a typed DTO instead of Map ensures Jackson can correctly
     * deserialize the STOMP payload regardless of content-type header.
     */
    @MessageMapping("/typing")
    public void handleTyping(@Payload TypingEvent payload) {
        Long recipientId = payload.getRecipientId();
        if (recipientId != null) {
            messagingTemplate.convertAndSend(
                "/topic/typing/" + recipientId,
                payload
            );
        }
    }
}
