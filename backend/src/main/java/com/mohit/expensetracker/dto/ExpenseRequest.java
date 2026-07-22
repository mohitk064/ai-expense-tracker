package com.mohit.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseRequest {

    private String item;

    private BigDecimal amount;

    private LocalDate date;
}