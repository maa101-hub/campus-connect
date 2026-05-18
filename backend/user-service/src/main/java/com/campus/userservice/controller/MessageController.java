package com.campus.userservice.controller;

import com.campus.userservice.dto.MessageResponse;
import com.campus.userservice.dto.SendMessageRequest;
import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.UserService;
import com.campus.userservice.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private UserService userService;

    @PostMapping("/send")
    public ApiResponse<MessageResponse> sendMessage(
            Authentication authentication,
            @RequestBody SendMessageRequest request) {
        String email = authentication.getName();
        MessageResponse response = userService.sendMessage(email, request);
        return ApiResponse.success(response, "Message sent successfully");
    }

    @GetMapping("/conversation/{otherUserId}")
    public ApiResponse<List<MessageResponse>> getConversation(
            Authentication authentication,
            @PathVariable Long otherUserId) {
        String email = authentication.getName();
        List<MessageResponse> conversation = userService.getConversation(email, otherUserId);
        return ApiResponse.success(conversation, "Conversation fetched successfully");
    }

    @GetMapping("/contacts")
    public ApiResponse<List<UserResponse>> getContacts(Authentication authentication) {
        String email = authentication.getName();
        List<UserResponse> contacts = userService.getContacts(email);
        return ApiResponse.success(contacts, "Contacts fetched successfully");
    }

    /**
     * POST /api/messages/read/{senderId}
     * Mark all messages from senderId as read for the authenticated user.
     */
    @PostMapping("/read/{senderId}")
    public ApiResponse<?> markAsRead(
            Authentication authentication,
            @PathVariable Long senderId) {
        String email = authentication.getName();
        ((UserServiceImpl) userService).markMessagesAsRead(email, senderId);
        return ApiResponse.success(null, "Messages marked as read");
    }
}
