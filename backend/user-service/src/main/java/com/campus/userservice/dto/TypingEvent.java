package com.campus.userservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * STOMP payload for typing indicator events.
 * { "senderId": 1, "recipientId": 2, "typing": true }
 */
public class TypingEvent {

    private Long senderId;
    private Long recipientId;

    @JsonProperty("typing")
    private boolean typing;

    public TypingEvent() {}

    public TypingEvent(Long senderId, Long recipientId, boolean typing) {
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.typing = typing;
    }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public boolean isTyping() { return typing; }
    public void setTyping(boolean typing) { this.typing = typing; }
}
