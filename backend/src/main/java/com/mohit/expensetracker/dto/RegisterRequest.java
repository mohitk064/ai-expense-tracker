package com.mohit.expensetracker.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


@Data
public class RegisterRequest {

  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Enter a valid email address")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 6, message = "Password must contain at least 6 characters")
  private String password;

  @NotBlank(message = "Confirm password is required")
  private String confirmPassword;

  private String phoneNumber;

  private LocalDate dateOfBirth;

}
