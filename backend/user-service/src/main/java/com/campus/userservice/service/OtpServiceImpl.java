package com.campus.userservice.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.userservice.entity.Otp;
import com.campus.userservice.exception.BadRequestException;
import com.campus.userservice.repository.OtpRepository;

@Service
public class OtpServiceImpl implements OtpService {

    @Autowired private  OtpRepository otpRepository;

    public void sendOtp(String email) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        Otp otpEntity = new Otp();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setUsed(false);

        otpRepository.save(otpEntity);

        System.out.println("OTP for " + email + " is: " + otp); // temp
    }

    public void verifyOtp(String email, String otp) {

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

        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);
    }
}