package com.mohit.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import com.mohit.expensetracker.entity.Category;

public class FinancialSummaryResponse {

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal totalSpent;
    private Integer transactionCount;
    private BigDecimal averageExpense;

    private Map<Category, BigDecimal> spendingByCategory;

    private Category topCategory;
    private BigDecimal topCategoryAmount;

    public FinancialSummaryResponse(
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal totalSpent,
            Integer transactionCount,
            BigDecimal averageExpense,
            Map<Category, BigDecimal> spendingByCategory,
            Category topCategory,
            BigDecimal topCategoryAmount) {

        this.startDate = startDate;
        this.endDate = endDate;
        this.totalSpent = totalSpent;
        this.transactionCount = transactionCount;
        this.averageExpense = averageExpense;
        this.spendingByCategory = spendingByCategory;
        this.topCategory = topCategory;
        this.topCategoryAmount = topCategoryAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public BigDecimal getAverageExpense() {
        return averageExpense;
    }

    public Map<Category, BigDecimal> getSpendingByCategory() {
        return spendingByCategory;
    }

    public Category getTopCategory() {
        return topCategory;
    }

    public BigDecimal getTopCategoryAmount() {
        return topCategoryAmount;
    }
}