package com.campus.userservice.dto;

public class SendMessageRequest {

    private Long recipientId;
    private String content;

    public SendMessageRequest() {}

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
