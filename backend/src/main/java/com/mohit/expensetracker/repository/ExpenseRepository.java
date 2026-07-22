package com.mohit.expensetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mohit.expensetracker.entity.Expense;
import java.util.List;
import com.mohit.expensetracker.entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  List<Expense> findByUser(User user);
}