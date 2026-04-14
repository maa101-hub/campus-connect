package com.campus.userservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.entity.Role;
import com.campus.userservice.entity.User;
import com.campus.userservice.entity.VerificationStatus;
import com.campus.userservice.exception.DuplicateResourceException;
import com.campus.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private  BCryptPasswordEncoder passwordEncoder;
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Override
    public User registerUser(SignUpRequest request) {

        // 🔹 Validation
    	log.info("Registering user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
        	log.error("❌ Email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
        	log.error("❌ Username already exists: {}", request.getUsername());
            throw new DuplicateResourceException("Username already exists");
        }

        // 🔹 Create User Object (manual mapping - controlled)
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setCollegeId(request.getCollegeId());
        user.setCollegeName(request.getCollegeName());

        user.setVerificationStatus(VerificationStatus.PENDING);
        user.setEmailVerified(false);
        user.setRole(Role.USER);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        log.info("💾 Saving user to database for email: {}", request.getEmail());
        User savedUser = userRepository.save(user);
        log.info("🎉 User registration completed for email: {}", request.getEmail());
        return savedUser;
    }
}