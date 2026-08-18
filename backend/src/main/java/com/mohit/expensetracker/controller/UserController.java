package com.mohit.expensetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mohit.expensetracker.dto.ChangePasswordRequest;
import com.mohit.expensetracker.dto.UserProfileResponse;
import com.mohit.expensetracker.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();

        UserProfileResponse profile =
                userService.getProfile(email);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        String email = authentication.getName();

        userService.changePassword(email, request);

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}