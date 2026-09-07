package com.mohit.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.mohit.expensetracker.entity.Category;

public class ReceiptAnalysisResponse {

    private String merchant;
    private BigDecimal amount;
    private LocalDate date;
    private Category category;
    private String rawText;

    public String getMerchant() {
        return merchant;
    }

    public void setMerchant(String merchant) {
        this.merchant = merchant;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
}