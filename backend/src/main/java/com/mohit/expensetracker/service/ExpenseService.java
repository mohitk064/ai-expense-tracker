package com.mohit.expensetracker.service;

import org.springframework.stereotype.Service;

import com.mohit.expensetracker.dto.ExpenseRequest;
import com.mohit.expensetracker.entity.Expense;
import com.mohit.expensetracker.entity.User;
import com.mohit.expensetracker.exception.ExpenseNotFoundException;
import com.mohit.expensetracker.exception.UnauthorizedExpenseAccessException;
import com.mohit.expensetracker.repository.ExpenseRepository;
import com.mohit.expensetracker.repository.UserRepository;
import java.util.List;
import com.mohit.expensetracker.dto.ExpenseResponse;

@Service
public class ExpenseService {

  private final ExpenseRepository expenseRepository;
  private final UserRepository userRepository;

  public ExpenseService(
      ExpenseRepository expenseRepository,
      UserRepository userRepository) {

    this.expenseRepository = expenseRepository;
    this.userRepository = userRepository;
  }

  public void addExpense(ExpenseRequest request, String email) {

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    Expense expense = new Expense();

    expense.setItem(request.getItem());
    expense.setAmount(request.getAmount());
    expense.setDate(request.getDate());
    expense.setUser(user);

    expenseRepository.save(expense);
  }

  public List<ExpenseResponse> getExpenses(String email) {

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    return expenseRepository.findByUser(user)
        .stream()
        .map(expense -> new ExpenseResponse(
            expense.getId(),
            expense.getItem(),
            expense.getAmount(),
            expense.getDate()))
        .toList();
  }

  public ExpenseResponse updateExpense(
      Long expenseId,
      ExpenseRequest request,
      String email) {

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

    Expense expense = expenseRepository.findById(expenseId)
        .orElseThrow(() -> new ExpenseNotFoundException("Expense not found"));

    if (!expense.getUser().getId().equals(user.getId())) {
      throw new UnauthorizedExpenseAccessException(
          "You are not allowed to update this expense");
    }

    expense.setItem(request.getItem());
    expense.setAmount(request.getAmount());
    expense.setDate(request.getDate());

    Expense updatedExpense = expenseRepository.save(expense);

    return new ExpenseResponse(
        updatedExpense.getId(),
        updatedExpense.getItem(),
        updatedExpense.getAmount(),
        updatedExpense.getDate());
  }

  public void deleteExpense(Long expenseId, String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    Expense expense = expenseRepository.findById(expenseId)
        .orElseThrow(() -> new ExpenseNotFoundException("Expense not found"));

    if (!expense.getUser().getId().equals(user.getId())) {
      throw new UnauthorizedExpenseAccessException(
          "You are not allowed to update this expense");
    }

    expenseRepository.delete(expense);
  }
}