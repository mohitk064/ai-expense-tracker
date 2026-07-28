package com.mohit.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import com.mohit.expensetracker.entity.Category;

@Getter
@Setter
public class ExpenseRequest {

    @NotBlank(message = "Item cannot be empty")
    private String item;

    @Positive(message = "Amount must be greater than zero")
    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private Category category;
}