package com.mohit.expensetracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Mohit! Backend is running.";
    }

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "You accessed a protected endpoint";
    }
}
