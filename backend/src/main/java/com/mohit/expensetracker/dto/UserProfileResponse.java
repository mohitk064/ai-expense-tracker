package com.mohit.expensetracker.dto;

import java.time.LocalDate;

public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;

    public UserProfileResponse(
            Long id,
            String name,
            String email,
            String phoneNumber,
            LocalDate dateOfBirth) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
}