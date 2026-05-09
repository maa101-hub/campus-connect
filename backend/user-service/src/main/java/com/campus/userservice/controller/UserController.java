package com.campus.userservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.campus.userservice.dto.ChangePasswordRequest;
import com.campus.userservice.dto.ForgotPasswordRequest;
import com.campus.userservice.dto.ResetPasswordRequest;
import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    private Logger log = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<?> getCurrentUser(Authentication authentication) {
        log.info("Fetching current user profile for email: {}", authentication.getName());
        String email = authentication.getName();
        log.info("Authenticated email: {}", email);
        UserResponse response = userService.getCurrentUser(email);
        log.info("User profile fetched successfully for email: {}", email);
        return ApiResponse.success(response, "User profile fetched successfully");
    }

    @PutMapping("/change-password")
    public ApiResponse<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        userService.changePassword(email, request);

        return ApiResponse.success(
                null,
                "Password changed successfully");
    }

    @PutMapping("/profile")
    public ApiResponse<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody com.campus.userservice.dto.UpdateProfileRequest request) {
        
        log.info("Updating profile for user: {}", authentication.getName());
        UserResponse response = userService.updateProfile(authentication.getName(), request);
        return ApiResponse.success(response, "Profile updated successfully");
    }

    @GetMapping("/college")
    public ApiResponse<List<UserResponse>> getCollegeUsers(
            @RequestParam String collegeName) {
        log.info("Fetching users for college: {}", collegeName);
        List<UserResponse> users = userService.getCollegeUsers(collegeName);
        return ApiResponse.success(users, "College users fetched successfully");
    }
}