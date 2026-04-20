package com.campus.userservice.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.campus.userservice.dto.ChangePasswordRequest;
import com.campus.userservice.dto.LoginRequest;
import com.campus.userservice.dto.LoginResponse;
import com.campus.userservice.dto.ResetPasswordRequest;
import com.campus.userservice.dto.SignUpRequest;
import com.campus.userservice.dto.UpdateProfileRequest;
import com.campus.userservice.dto.UserResponse;
import com.campus.userservice.entity.Role;
import com.campus.userservice.entity.User;
import com.campus.userservice.entity.VerificationStatus;
import com.campus.userservice.exception.BadRequestException;
import com.campus.userservice.exception.DuplicateResourceException;
import com.campus.userservice.repository.UserRepository;
import com.campus.userservice.security.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private  BCryptPasswordEncoder passwordEncoder;
    @Autowired private OtpService otpService;
    @Autowired private JwtUtil jwtUtil;
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
    
    @Override
    public LoginResponse loginUser(LoginRequest request) {

        log.info("🔐 Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        log.info("👤 User found for email: {}", request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        	log.error("❌ Invalid password for email: {}", request.getEmail());
            throw new BadRequestException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
        	log.error("❌ Email not verified for email: {}", request.getEmail());
            throw new BadRequestException("Email not verified");
        }

        log.info("🔑 Generating JWT for email: {}", request.getEmail());
        String token = jwtUtil.generateToken(user.getEmail());

        log.info("✅ JWT generated for email: {}", user.getEmail());
        log.info("🎉 Login successful for email: {}", user.getEmail());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        log.info("🔐 Login process completed for email: {}", request.getEmail());
        return response;
    }

	@Override
	public UserResponse getCurrentUser(String email) {
		log.info("Fetching current user details for email: {}", email);
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));

		log.info("👤 User found for email: {}", email);
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());
		response.setUsername(user.getUsername());
		response.setCollegeName(user.getCollegeName());
		response.setEmailVerified(user.isEmailVerified());

		log.info("✅ User details fetched successfully for email: {}", email);
		return response;
	}
	@Override
	public UserResponse updateProfile(String email, UpdateProfileRequest request) {
		log.info("Updating profile for email: {}", email);
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));

		log.info("👤 User found for email: {}", email);
		user.setName(request.getName());
		user.setUsername(request.getUsername());
		user.setUpdatedAt(LocalDateTime.now());

		log.info("💾 Saving updated user to database for email: {}", email);
		User updatedUser = userRepository.save(user);

		log.info("✅ Profile updated successfully for email: {}", email);
		UserResponse response = new UserResponse();
		response.setId(updatedUser.getId());
		response.setName(updatedUser.getName());
		response.setEmail(updatedUser.getEmail());
		response.setUsername(updatedUser.getUsername());
		response.setCollegeName(updatedUser.getCollegeName());
		response.setEmailVerified(updatedUser.isEmailVerified());

		log.info("🎉 Profile update process completed for email: {}", email);
		return response;
	}

	@Override
	public void changePassword(String email,
	                           ChangePasswordRequest request) {

	    log.info("🔐 Password change request for email: {}", email);

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> {
	                log.warn("⚠️ User not found for email: {}", email);
	                return new BadRequestException("User not found");
	            });

	    if (!passwordEncoder.matches(
	            request.getOldPassword(),
	            user.getPassword())) {

	        log.warn("❌ Incorrect old password attempt for email: {}", email);

	        throw new BadRequestException(
	                "Old password is incorrect");
	    }

	    if (passwordEncoder.matches(
	            request.getNewPassword(),
	            user.getPassword())) {

	        log.warn("⚠️ New password same as old password for email: {}", email);

	        throw new BadRequestException(
	                "New password cannot be same as old password");
	    }

	    user.setPassword(
	            passwordEncoder.encode(
	                    request.getNewPassword()));

	    userRepository.save(user);

	    log.info("✅ Password changed successfully for email: {}", email);
	}
	@Override
	public void forgotPassword(String email) {

	    log.info("Forgot password request for {}", email);

	    User user = userRepository.findByEmail(email)
	        .orElseThrow(() ->
	            new BadRequestException("User not found"));

	    otpService.sendOtp(email);

	    log.info("OTP sent for forgot password {}", email);
	}
	@Override
	public void resetPassword(ResetPasswordRequest request) {

	    log.info("Reset password request for {}", request.getEmail());

	    User user = userRepository.findByEmail(request.getEmail())
	        .orElseThrow(() ->
	            new BadRequestException("User not found"));

	    otpService.verifyOtp(
	        request.getEmail(),
	        request.getOtp());

	    user.setPassword(
	        passwordEncoder.encode(
	            request.getNewPassword()));

	    userRepository.save(user);

	    log.info("Password reset successful for {}", request.getEmail());
	}
}