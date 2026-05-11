package com.campus.userservice.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/typing")
    public void handleTyping(@Payload TypingEvent event) {
        // Broadcast to the recipient
        messagingTemplate.convertAndSend("/topic/typing/" + event.getRecipientId(), event);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypingEvent {
        private Long senderId;
        private Long recipientId;
        private boolean typing;
    }
}
