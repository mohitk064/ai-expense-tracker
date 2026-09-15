package com.mohit.expensetracker.exception;

public class AiServiceUnavailableException
        extends RuntimeException {

    public AiServiceUnavailableException(
            String message) {

        super(message);
    }
}