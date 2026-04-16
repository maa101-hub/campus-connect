package com.campus.userservice.service;

import com.campus.userservice.dto.LoginRequest;
import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.entity.User;

public interface UserService {
    User registerUser(SignUpRequest request);
    User loginUser(LoginRequest request);
}
