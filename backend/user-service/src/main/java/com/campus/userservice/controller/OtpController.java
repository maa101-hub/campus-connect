package com.campus.userservice.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campus.userservice.response.ApiResponse;
import com.campus.userservice.service.OtpService;

@RestController
@RequestMapping("/api/auth")
public class OtpController {

    @Autowired private  OtpService otpService;

    @PostMapping("/send-otp")
    public ApiResponse<?> sendOtp(@RequestParam String email) {
        otpService.sendOtp(email);
        return ApiResponse.success(null, "OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ApiResponse<?> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        otpService.verifyOtp(email, otp);
        return ApiResponse.success(null, "OTP verified successfully");
    }
}