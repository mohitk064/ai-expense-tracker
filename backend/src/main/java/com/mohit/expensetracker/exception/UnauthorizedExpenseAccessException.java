package com.mohit.expensetracker.exception;

public class UnauthorizedExpenseAccessException extends RuntimeException {

    public UnauthorizedExpenseAccessException(String message) {
        super(message);
    }
}