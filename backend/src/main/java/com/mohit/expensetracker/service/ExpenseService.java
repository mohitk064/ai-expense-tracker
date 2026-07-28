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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ExpenseService {

        private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

        private final ExpenseRepository expenseRepository;
        private final UserRepository userRepository;

        public ExpenseService(
                        ExpenseRepository expenseRepository,
                        UserRepository userRepository) {

                this.expenseRepository = expenseRepository;
                this.userRepository = userRepository;
        }

        private User getAuthenticatedUser(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        }

        public ExpenseResponse addExpense(ExpenseRequest request, String email) {

                User user = getAuthenticatedUser(email);

                Expense expense = new Expense();

                expense.setItem(request.getItem());
                expense.setAmount(request.getAmount());
                expense.setDate(request.getDate());
                expense.setCategory(request.getCategory());
                expense.setUser(user);

                Expense savedExpense = expenseRepository.save(expense);

                logger.info(
                                "Expense added successfully for user: {}",
                                email);

                return new ExpenseResponse(
                                savedExpense.getId(),
                                savedExpense.getItem(),
                                savedExpense.getAmount(),
                                savedExpense.getDate(),
                                savedExpense.getCategory());
        }

        public List<ExpenseResponse> getExpenses(String email) {

                User user = getAuthenticatedUser(email);

                return expenseRepository.findByUser(user)
                                .stream()
                                .map(expense -> new ExpenseResponse(
                                                expense.getId(),
                                                expense.getItem(),
                                                expense.getAmount(),
                                                expense.getDate(),
                                                expense.getCategory()))
                                .toList();
        }

        public ExpenseResponse updateExpense(
                        Long expenseId,
                        ExpenseRequest request,
                        String email) {

                User user = getAuthenticatedUser(email);

                Expense expense = expenseRepository.findById(expenseId)
                                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found"));

                if (!expense.getUser().getId().equals(user.getId())) {

                        logger.warn(
                                        "Unauthorized update attempt by user {} on expense {}",
                                        email,
                                        expenseId);
                        throw new UnauthorizedExpenseAccessException(
                                        "You are not allowed to update this expense");
                }

                expense.setItem(request.getItem());
                expense.setAmount(request.getAmount());
                expense.setDate(request.getDate());
                expense.setCategory(request.getCategory());

                Expense updatedExpense = expenseRepository.save(expense);

                logger.info(
                                "Expense {} updated successfully for user {}",
                                updatedExpense.getId(),
                                email);

                return new ExpenseResponse(
                                updatedExpense.getId(),
                                updatedExpense.getItem(),
                                updatedExpense.getAmount(),
                                updatedExpense.getDate(),
                                updatedExpense.getCategory());
        }

        public void deleteExpense(Long expenseId, String email) {
                User user = getAuthenticatedUser(email);

                Expense expense = expenseRepository.findById(expenseId)
                                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found"));

                if (!expense.getUser().getId().equals(user.getId())) {

                        logger.warn(
                                        "Unauthorized update attempt by user {} on expense {}",
                                        email,
                                        expenseId);
                        throw new UnauthorizedExpenseAccessException(
                                        "You are not allowed to delete this expense");
                }

                expenseRepository.delete(expense);

                logger.info(
                                "Expense {} deleted successfully for user {}",
                                expenseId,
                                email);
        }

}