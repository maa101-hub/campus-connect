package com.campus.userservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.campus.userservice.exception.BadRequestException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${MAIL_USERNAME:}")
    private String fromAddress;

    /**
     * Sends the OTP code to the given email address.
     *
     * @param toEmail recipient email address
     * @param otp     the one-time password to deliver
     */
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setTo(toEmail);
            message.setSubject("Your CampusConnect verification code");
            message.setText(
                    "Hi,\n\n" +
                    "Your CampusConnect verification code is: " + otp + "\n\n" +
                    "This code will expire in 5 minutes. " +
                    "If you didn't request this, you can safely ignore this email.\n\n" +
                    "— The CampusConnect Team");

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new BadRequestException("Failed to send OTP email. Please try again later.");
        }
    }
}
