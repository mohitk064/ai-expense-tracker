package com.mohit.expensetracker.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendVerificationOtp(
            String recipientEmail,
            String otp) {

        String url =
                "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.set(
                "api-key",
                brevoApiKey
        );

        Map<String, Object> sender =
                Map.of(
                        "name", "ExpenseAI",
                        "email", fromEmail
                );

        Map<String, Object> recipient =
                Map.of(
                        "email", recipientEmail
                );

        Map<String, Object> body =
                Map.of(
                        "sender", sender,
                        "to", List.of(recipient),
                        "subject",
                        "ExpenseAI Email Verification",
                        "textContent",
                        "Your ExpenseAI verification OTP is: "
                                + otp
                                + "\n\nThis OTP will expire in 10 minutes."
                );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        body,
                        headers
                );

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        String.class
                );

        if (!response.getStatusCode()
                .is2xxSuccessful()) {

            throw new RuntimeException(
                    "Failed to send verification email"
            );
        }
    }
}