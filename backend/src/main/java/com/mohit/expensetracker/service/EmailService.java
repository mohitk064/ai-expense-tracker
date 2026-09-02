package com.mohit.expensetracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationOtp(
            String recipientEmail,
            String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject("ExpenseAI Email Verification");

        message.setText(
                "Your ExpenseAI verification OTP is: "
                        + otp
                        + "\n\nThis OTP will expire in 10 minutes."
        );

        mailSender.send(message);
    }
}