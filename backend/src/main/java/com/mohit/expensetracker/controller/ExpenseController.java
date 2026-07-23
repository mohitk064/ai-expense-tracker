package com.mohit.expensetracker.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.*;

import com.mohit.expensetracker.dto.ApiResponse;
import com.mohit.expensetracker.dto.ExpenseRequest;
import com.mohit.expensetracker.service.ExpenseService;

import jakarta.validation.Valid;

import java.util.List;
import com.mohit.expensetracker.dto.ExpenseResponse;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

  private final ExpenseService expenseService;

  public ExpenseController(ExpenseService expenseService) {
    this.expenseService = expenseService;
  }

  @PostMapping
  public ApiResponse<ExpenseResponse> addExpense(@Valid @RequestBody ExpenseRequest request,
      Principal principal) {

    ExpenseResponse response = expenseService.addExpense(
        request,
        principal.getName());

    return new ApiResponse<>(
        true,
        "Expense added successfully",
        response);
  }

  @GetMapping
  public ApiResponse<List<ExpenseResponse>> getExpenses(
      Principal principal) {

    List<ExpenseResponse> expenses = expenseService.getExpenses(principal.getName());

    return new ApiResponse<>(
        true,
        "Expenses fetched successfully",
        expenses);
  }

  @PutMapping("/{id}")
  public ApiResponse<ExpenseResponse> updateExpense(
      @PathVariable Long id,
      @Valid @RequestBody ExpenseRequest request,
      Principal principal) {

    ExpenseResponse expenseResponse = expenseService.updateExpense(
        id,
        request,
        principal.getName());

    return new ApiResponse<>(
        true,
        "Expense updated successfully",
        expenseResponse);
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteExpense(
      @PathVariable Long id,
      Principal principal) {

    expenseService.deleteExpense(
        id,
        principal.getName());

    return new ApiResponse<>(
        true,
        "Expense deleted successfully",
        null);
  }
}