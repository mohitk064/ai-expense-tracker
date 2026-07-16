package com.mohit.expensetracker.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class RegisterRequest {

  private String name;
  private String email;
  private String password;
  private String confirmPassword;
  private String phoneNumber;
  private LocalDate dateOfBirth;
  
}

