package com.mohit.expensetracker.service;

import org.springframework.stereotype.Service;
import com.mohit.expensetracker.dto.RegisterRequest;
import com.mohit.expensetracker.entity.User;

import com.mohit.expensetracker.repository.UserRepository;

@Service

public class AuthService {
  private final UserRepository userRepository;

  public AuthService(UserRepository userRepository){
    this.userRepository = userRepository;
  }

  

  public void register(RegisterRequest request){

    if (!request.getPassword().equals(request.getConfirmPassword())) {
        throw new RuntimeException("Passwords do not match");
    }

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(request.getPassword());
    user.setPhoneNumber(request.getPhoneNumber());
    user.setDateOfBirth(request.getDateOfBirth());
    
    userRepository.save(user);
  }
}
