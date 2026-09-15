package com.mohit.expensetracker.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.mohit.expensetracker.dto.FinancialSummaryResponse;
import com.mohit.expensetracker.entity.Category;
import com.mohit.expensetracker.entity.Expense;
import com.mohit.expensetracker.entity.User;
import com.mohit.expensetracker.repository.ExpenseRepository;
import com.mohit.expensetracker.repository.UserRepository;

@Service
public class FinancialSummaryService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public FinancialSummaryService(
            ExpenseRepository expenseRepository,
            UserRepository userRepository) {

        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public FinancialSummaryResponse getCurrentMonthSummary(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        ));

        LocalDate startDate =
                YearMonth.now().atDay(1);

        LocalDate endDate =
                LocalDate.now();

        List<Expense> expenses =
                expenseRepository.findByUserAndDateBetween(
                        user,
                        startDate,
                        endDate
                );

        BigDecimal totalSpent = BigDecimal.ZERO;

        Map<Category, BigDecimal> spendingByCategory =
                new EnumMap<>(Category.class);

        for (Category category : Category.values()) {
            spendingByCategory.put(
                    category,
                    BigDecimal.ZERO
            );
        }

        for (Expense expense : expenses) {

            BigDecimal amount = expense.getAmount();

            totalSpent = totalSpent.add(amount);

            Category category =
                    expense.getCategory() != null
                            ? expense.getCategory()
                            : Category.OTHER;

            spendingByCategory.put(
                    category,
                    spendingByCategory
                            .get(category)
                            .add(amount)
            );
        }

        int transactionCount = expenses.size();

        BigDecimal averageExpense =
                transactionCount == 0
                        ? BigDecimal.ZERO
                        : totalSpent.divide(
                                BigDecimal.valueOf(transactionCount),
                                2,
                                RoundingMode.HALF_UP
                        );

        Category topCategory = null;
        BigDecimal topCategoryAmount =
                BigDecimal.ZERO;

        for (
                Map.Entry<Category, BigDecimal> entry
                        : spendingByCategory.entrySet()
        ) {

            if (entry.getValue()
                    .compareTo(topCategoryAmount) > 0) {

                topCategory = entry.getKey();
                topCategoryAmount = entry.getValue();
            }
        }

        return new FinancialSummaryResponse(
                startDate,
                endDate,
                totalSpent,
                transactionCount,
                averageExpense,
                spendingByCategory,
                topCategory,
                topCategoryAmount
        );
    }
}