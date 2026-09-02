package com.mohit.expensetracker.controller;

import com.mohit.expensetracker.dto.RegisterRequest;
import com.mohit.expensetracker.dto.LoginRequest;
import com.mohit.expensetracker.service.AuthService;
import com.mohit.expensetracker.service.EmailService;
import com.mohit.expensetracker.service.OtpService;
import com.mohit.expensetracker.dto.VerifyEmailRequest;
import com.mohit.expensetracker.dto.ResendOtpRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final OtpService otpService;
  private final EmailService emailService;

  public AuthController(
      AuthService authService,
      OtpService otpService, EmailService emailService) {

    this.authService = authService;
    this.otpService = otpService;
    this.emailService = emailService;
  }

  @PostMapping("/register")
  public String register(
      @Valid @RequestBody RegisterRequest request) {

    authService.register(request);

    String otp = otpService.generateAndSaveOtp(
        request.getEmail());

    emailService.sendVerificationOtp(
        request.getEmail(),
        otp);

    return "User registered successfully. OTP sent to email.";
  }

  @PostMapping("/login")
  public String login(@Valid @RequestBody LoginRequest request) {

    System.out.println("Login API called");

    return authService.login(request);
  }

  @PostMapping("/verify-email")
  public ResponseEntity<String> verifyEmail(
      @Valid @RequestBody VerifyEmailRequest request) {

    otpService.verifyOtp(
        request.getEmail(),
        request.getOtp());

    return ResponseEntity.ok(
        "Email verified successfully");
  }

  @PostMapping("/resend-otp")
  public ResponseEntity<String> resendOtp(
      @Valid @RequestBody ResendOtpRequest request) {

    String otp = otpService.resendOtp(
        request.getEmail());

    emailService.sendVerificationOtp(
        request.getEmail(),
        otp);

    return ResponseEntity.ok(
        "New OTP sent successfully");
  }

}
