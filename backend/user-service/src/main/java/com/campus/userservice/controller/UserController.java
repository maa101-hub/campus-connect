package com.campus.userservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired private  UserService userService;
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
}