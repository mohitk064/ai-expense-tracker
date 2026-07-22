package com.mohit.expensetracker.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.*;

import com.mohit.expensetracker.dto.ExpenseRequest;
import com.mohit.expensetracker.service.ExpenseService;
import java.util.List;
import com.mohit.expensetracker.dto.ExpenseResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

  private final ExpenseService expenseService;

  public ExpenseController(ExpenseService expenseService) {
    this.expenseService = expenseService;
  }

  @PostMapping
  public String addExpense(
      @RequestBody ExpenseRequest request,
      Principal principal) {

    expenseService.addExpense(request, principal.getName());

    return "Expense added successfully";
  }

  @GetMapping
  public List<ExpenseResponse> getExpenses(Principal principal) {
    return expenseService.getExpenses(principal.getName());
  }

  @PutMapping("/{id}")
  public ExpenseResponse updateExpense(
      @PathVariable Long id,
      @RequestBody ExpenseRequest request,
      Principal principal) {

    return expenseService.updateExpense(
        id,
        request,
        principal.getName());
  }

  @DeleteMapping("/{id}")
  public String deleteExpense(
      @PathVariable Long id,
      Principal principal) {

    expenseService.deleteExpense(
        id,
        principal.getName());

    return "Expense deleted successfully";
  }
}