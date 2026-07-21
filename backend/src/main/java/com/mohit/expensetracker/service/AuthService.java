package com.mohit.expensetracker.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mohit.expensetracker.dto.LoginRequest;
import com.mohit.expensetracker.dto.RegisterRequest;
import com.mohit.expensetracker.entity.User;
import com.mohit.expensetracker.exception.InvalidCredentialsException;
import com.mohit.expensetracker.repository.UserRepository;

@Service

public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

  public void register(RegisterRequest request) {

    if (!request.getPassword().equals(request.getConfirmPassword())) {
      throw new RuntimeException("Passwords do not match");
    }

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setPhoneNumber(request.getPhoneNumber());
    user.setDateOfBirth(request.getDateOfBirth());

    userRepository.save(user);
  }

  public String login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

    boolean passwordMatches = passwordEncoder.matches(
        request.getPassword(),
        user.getPassword());

    if (!passwordMatches) {
      throw new InvalidCredentialsException("Invalid email or password");
    }
    
    return jwtService.generateToken(user.getEmail());
  }
}
