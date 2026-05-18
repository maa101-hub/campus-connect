package com.campus.userservice.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.userservice.entity.Otp;
import com.campus.userservice.entity.User;
import com.campus.userservice.exception.BadRequestException;
import com.campus.userservice.repository.OtpRepository;
import com.campus.userservice.repository.UserRepository;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void sendOtp(String email) {
        log.info("Generating OTP for email: {}", email);

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);

        otpRepository.save(otpEntity);

        log.info("OTP generated for email: {}", email);
        System.out.println("OTP: " + otp);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);

        Otp otpEntity = otpRepository
                .findTopByEmailOrderByExpiryTimeDesc(email)
                .orElseThrow(() -> new BadRequestException("OTP not found"));

        if (otpEntity.isUsed()) {
            throw new BadRequestException("OTP already used");
        }
        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP expired");
        }
        if (!otpEntity.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setEmailVerified(true);
        userRepository.save(user);

        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        log.info("OTP verified successfully for email: {}", email);
    }
}
