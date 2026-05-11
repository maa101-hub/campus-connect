package com.campus.userservice.service;

import com.campus.userservice.dto.ChangePasswordRequest;
import com.campus.userservice.dto.LoginRequest;
import com.campus.userservice.dto.LoginResponse;
import com.campus.userservice.dto.ResetPasswordRequest;
import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.dto.UpdateProfileRequest;
import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.dto.SendMessageRequest;
import com.campus.userservice.dto.MessageResponse;
import com.campus.userservice.entity.User;

import java.util.List;

public interface UserService {
    User registerUser(SignUpRequest request);
    LoginResponse loginUser(LoginRequest request);
    UserResponse getCurrentUser(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
    void forgotPassword(String email);
    void resetPassword(ResetPasswordRequest request);
    List<UserResponse> getCollegeUsers(String collegeName);
    MessageResponse sendMessage(String senderEmail, SendMessageRequest request);
    List<MessageResponse> getConversation(String email, Long otherUserId);
    List<UserResponse> getContacts(String email);
    void markConversationAsRead(String email, Long senderId);

    // Follow system
    void followUser(String followerEmail, Long targetUserId);
    void unfollowUser(String followerEmail, Long targetUserId);
    List<UserResponse> getFollowers(Long userId);
    List<UserResponse> getFollowing(Long userId);
}
