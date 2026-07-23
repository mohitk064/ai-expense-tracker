package com.mohit.expensetracker.dto;


import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class LoginRequest {

  @NotBlank(message = "Email is required")
  @Email(message = "Enter a valid email address")
  private String email;

  @NotBlank(message = "Password is required")
  private String password;

}
