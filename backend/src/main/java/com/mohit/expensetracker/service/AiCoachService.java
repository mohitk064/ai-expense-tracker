package com.mohit.expensetracker.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohit.expensetracker.dto.AiCoachResponse;
import com.mohit.expensetracker.dto.FinancialSummaryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.HttpStatusCodeException;
import com.mohit.expensetracker.exception.AiServiceUnavailableException;

@Service
public class AiCoachService {

  private final FinancialSummaryService financialSummaryService;
  private final RestTemplate restTemplate;
  private final ObjectMapper objectMapper;
  private static final Logger logger = LoggerFactory.getLogger(AiCoachService.class);

  private static final int MAX_ATTEMPTS = 3;

  @Value("${gemini.api.key}")
  private String geminiApiKey;

  @Value("${gemini.model}")
  private String geminiModel;

  public AiCoachService(
      FinancialSummaryService financialSummaryService,
      ObjectMapper objectMapper) {

    this.financialSummaryService = financialSummaryService;

    this.objectMapper = objectMapper;

    this.restTemplate = new RestTemplate();
  }

  public AiCoachResponse generateAdvice(String email) {

    FinancialSummaryResponse financialSummary = financialSummaryService
        .getCurrentMonthSummary(email);

    /*
     * There is no reason to call Gemini when
     * the user has no spending data.
     */
    if (financialSummary.getTransactionCount() == 0) {

      return new AiCoachResponse(
          "There are no expenses recorded for this month yet.",
          List.of(
              "ExpenseAI needs some spending data before it can identify patterns."),
          List.of(
              "Add your expenses or scan receipts to receive personalized insights."));
    }

    String prompt = buildPrompt(financialSummary);

    return callGemini(prompt);
  }

  private String buildPrompt(
      FinancialSummaryResponse summary) {

    return """
        You are ExpenseAI, a personal budgeting assistant.

        Analyze the user's spending data provided below.

        Rules:
        - Use only the financial data provided.
        - Do not invent income, debt, savings, or other financial information.
        - Do not make investment recommendations.
        - Focus on spending habits and practical budgeting suggestions.
        - Be concise and useful.
        - Do not repeat the same point in multiple sections.
        - Monetary amounts are in Indian Rupees (INR).

        Financial data:

        Period: %s to %s
        Total spending: %s
        Number of transactions: %s
        Average expense: %s
        Spending by category: %s
        Highest spending category: %s
        Highest category amount: %s

        Generate:
        1. A short summary of the user's spending.
        2. Three useful spending insights.
        3. Three practical recommendations.
        """
        .formatted(
            summary.getStartDate(),
            summary.getEndDate(),
            summary.getTotalSpent(),
            summary.getTransactionCount(),
            summary.getAverageExpense(),
            summary.getSpendingByCategory(),
            summary.getTopCategory(),
            summary.getTopCategoryAmount());
  }

  private AiCoachResponse callGemini(String prompt) {

    String url = "https://generativelanguage.googleapis.com/v1beta/models/"
        + geminiModel
        + ":generateContent";

    HttpHeaders headers = new HttpHeaders();

    headers.setContentType(MediaType.APPLICATION_JSON);

    headers.set(
        "x-goog-api-key",
        geminiApiKey);

    Map<String, Object> responseSchema = Map.of(
        "type", "OBJECT",

        "properties", Map.of(

            "summary",
            Map.of(
                "type", "STRING"),

            "insights",
            Map.of(
                "type", "ARRAY",
                "items",
                Map.of(
                    "type", "STRING")),

            "recommendations",
            Map.of(
                "type", "ARRAY",
                "items",
                Map.of(
                    "type", "STRING"))),

        "required",
        List.of(
            "summary",
            "insights",
            "recommendations"));

    Map<String, Object> generationConfig = Map.of(
        "responseMimeType",
        "application/json",

        "responseSchema",
        responseSchema);

    Map<String, Object> requestBody = Map.of(
        "contents",
        List.of(
            Map.of(
                "parts",
                List.of(
                    Map.of(
                        "text",
                        prompt)))),

        "generationConfig",
        generationConfig);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(
        requestBody,
        headers);

    for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

      try {

        ResponseEntity<String> response = restTemplate.postForEntity(
            url,
            request,
            String.class);

        return parseGeminiResponse(
            response.getBody());

      } catch (HttpStatusCodeException exception) {

        int status = exception.getStatusCode().value();

        boolean retryable = status == 408 ||
            status == 429 ||
            status == 500 ||
            status == 502 ||
            status == 503 ||
            status == 504;

        logger.warn(
            "Gemini request failed. Attempt {}/{}. Status: {}",
            attempt,
            MAX_ATTEMPTS,
            status);

        if (!retryable) {

          logger.error(
              "Non-retryable Gemini error. Status: {}, Body: {}",
              status,
              exception.getResponseBodyAsString());

          throw new RuntimeException(
              "Unable to generate AI financial advice");
        }

        if (attempt == MAX_ATTEMPTS) {

          logger.error(
              "Gemini unavailable after {} attempts. Last status: {}",
              MAX_ATTEMPTS,
              status);

          throw new AiServiceUnavailableException(
              "AI service is temporarily busy. Please try again shortly.");
        }

        sleepBeforeRetry(attempt);

      } catch (Exception exception) {

        if (exception instanceof AiServiceUnavailableException) {
          throw exception;
        }

        logger.error(
            "Unexpected Gemini error",
            exception);

        throw new RuntimeException(
            "Unable to generate AI financial advice",
            exception);
      }
    }

    throw new AiServiceUnavailableException(
        "AI service is temporarily unavailable.");
  }

  private void sleepBeforeRetry(int attempt) {

    long delayMilliseconds = 1000L * (1L << (attempt - 1));

    try {

      logger.info(
          "Retrying Gemini request in {} ms",
          delayMilliseconds);

      Thread.sleep(delayMilliseconds);

    } catch (InterruptedException exception) {

      Thread.currentThread().interrupt();

      throw new RuntimeException(
          "AI request retry interrupted",
          exception);
    }
  }

  private AiCoachResponse parseGeminiResponse(
      String responseBody) {

    try {

      JsonNode root = objectMapper.readTree(responseBody);

      String generatedText = root.path("candidates")
          .get(0)
          .path("content")
          .path("parts")
          .get(0)
          .path("text")
          .asText();

      return objectMapper.readValue(
          generatedText,
          AiCoachResponse.class);

    } catch (Exception exception) {

      throw new RuntimeException(
          "Unable to parse AI response",
          exception);
    }
  }
}