package com.mohit.expensetracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.mohit.expensetracker.dto.ReceiptAnalysisResponse;
import com.mohit.expensetracker.entity.Category;

@Service
public class ReceiptParserService {

  public ReceiptAnalysisResponse parse(String rawText) {

    ReceiptAnalysisResponse response = new ReceiptAnalysisResponse();

    response.setRawText(rawText);
    response.setMerchant(extractMerchant(rawText));
    response.setAmount(extractAmount(rawText));
    response.setDate(extractDate(rawText));
    response.setCategory(extractCategory(rawText));

    return response;
  }

  private String extractMerchant(String rawText) {

    String[] lines = rawText.split("\\R");

    String firstLine = null;
    String secondLine = null;

    for (String line : lines) {

      String cleaned = line.trim();

      if (cleaned.isBlank()) {
        continue;
      }

      if (firstLine == null) {
        firstLine = cleaned;
        continue;
      }

      if (secondLine == null) {
        secondLine = cleaned;
        break;
      }
    }

    if (firstLine == null) {
      return "Unknown";
    }

    if (secondLine != null &&
        !secondLine.matches(".*\\d.*")) {

      return firstLine + " " + secondLine;
    }

    return firstLine;
  }

  private BigDecimal extractAmount(String rawText) {

    Pattern pattern = Pattern.compile(
        "(?i)(total|grand total|amount).*?(\\d+[\\.,]\\d{2})");

    Matcher matcher = pattern.matcher(rawText);

    if (matcher.find()) {

      String value = matcher.group(2)
          .replace(",", ".");

      return new BigDecimal(value);
    }

    return null;
  }

  private LocalDate extractDate(String rawText) {

    Pattern pattern = Pattern.compile(
        "\\b(\\d{1,2})[.,/-]\\s*(\\d{1,2})[.,/-]\\s*(\\d{4})\\b");

    Matcher matcher = pattern.matcher(rawText);

    if (!matcher.find()) {
      return null;
    }

    int day = Integer.parseInt(matcher.group(1));
    int month = Integer.parseInt(matcher.group(2));
    int year = Integer.parseInt(matcher.group(3));

    try {
      return LocalDate.of(
          year,
          month,
          day);

    } catch (Exception e) {
      return null;
    }
  }

  private Category extractCategory(String rawText) {

    String text = rawText.toLowerCase();

    if (text.contains("restaurant") ||
        text.contains("cafe") ||
        text.contains("coffee") ||
        text.contains("latte") ||
        text.contains("pizza") ||
        text.contains("food") ||
        text.contains("hotel")) {

      return Category.FOOD;
    }

    if (text.contains("petrol") ||
        text.contains("diesel") ||
        text.contains("fuel") ||
        text.contains("uber") ||
        text.contains("taxi")) {

      return Category.TRAVEL;
    }

    if (text.contains("pharmacy") ||
        text.contains("medical") ||
        text.contains("hospital")) {

      return Category.HEALTH;
    }

    if (text.contains("mall") ||
        text.contains("store") ||
        text.contains("shopping")) {

      return Category.SHOPPING;
    }

    return Category.OTHER;
  }
}