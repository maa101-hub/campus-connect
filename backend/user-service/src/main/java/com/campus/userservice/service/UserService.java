package com.campus.userservice.service;

import com.campus.userservice.dto.ChangePasswordRequest;
import com.campus.userservice.dto.LoginRequest;
import com.campus.userservice.dto.LoginResponse;
import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.dto.UpdateProfileRequest;
import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.entity.User;

public interface UserService {
    User registerUser(SignUpRequest request);
    LoginResponse loginUser(LoginRequest request);
    UserResponse getCurrentUser(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
