package com.mohit.expensetracker.controller;

import com.mohit.expensetracker.dto.RegisterRequest;
import com.mohit.expensetracker.dto.LoginRequest;
import com.mohit.expensetracker.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public String register(@Valid @RequestBody RegisterRequest request) {

    authService.register(request);

    return "User registered successfully";
  }

  @PostMapping("/login")
  public String login(@Valid @RequestBody LoginRequest request) {

    System.out.println("Login API called");

    return authService.login(request);
  }

}
