package com.campus.userservice.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long recipientId;
    private String content;
}
