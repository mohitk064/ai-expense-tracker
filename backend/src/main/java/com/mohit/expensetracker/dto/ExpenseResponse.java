package com.mohit.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private String item;
    private BigDecimal amount;
    private LocalDate date;
}