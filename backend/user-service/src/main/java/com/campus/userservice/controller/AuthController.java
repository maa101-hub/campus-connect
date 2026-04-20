package com.campus.userservice.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.campus.userservice.dto.ForgotPasswordRequest;
import com.campus.userservice.dto.LoginRequest;
import com.campus.userservice.dto.LoginResponse;
import com.campus.userservice.dto.ResetPasswordRequest;
import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.entity.User;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.UserService;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private  UserService userService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    @PostMapping("/signup")
    public ApiResponse<User> signup(@Valid @RequestBody SignUpRequest request) {

        log.info("➡️ Signup request received for email: {}", request.getEmail());

        User user = userService.registerUser(request);

        log.info("✅ User registered successfully for email: {}", request.getEmail());

        return ApiResponse.success(user, "User registered successfully");
    }
    @PostMapping("/login")
    public ApiResponse<?> login(@Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.loginUser(request);

        return ApiResponse.success(response, "Login successful");
    }
    @PostMapping("/forgot-password")
    public ApiResponse<?> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request.getEmail());

        return ApiResponse.success(
            null,
            "OTP sent successfully");
    }
    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(
        @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return ApiResponse.success(
            null,
            "Password reset successfully");
    }
}
