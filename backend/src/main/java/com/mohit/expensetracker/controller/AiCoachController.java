package com.mohit.expensetracker.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mohit.expensetracker.dto.ApiResponse;
import com.mohit.expensetracker.dto.FinancialSummaryResponse;
import com.mohit.expensetracker.service.FinancialSummaryService;

import com.mohit.expensetracker.dto.AiCoachResponse;
import com.mohit.expensetracker.service.AiCoachService;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/ai")
public class AiCoachController {

  private final FinancialSummaryService financialSummaryService;
  private final AiCoachService aiCoachService;

  public AiCoachController(
      FinancialSummaryService financialSummaryService,
      AiCoachService aiCoachService) {

    this.financialSummaryService = financialSummaryService;

    this.aiCoachService = aiCoachService;
  }

  @GetMapping("/summary")
  public ApiResponse<FinancialSummaryResponse> getFinancialSummary(Principal principal) {

    FinancialSummaryResponse summary = financialSummaryService
        .getCurrentMonthSummary(
            principal.getName());

    return new ApiResponse<>(
        true,
        "Financial summary generated successfully",
        summary);
  }

  @PostMapping("/coach")
  public ApiResponse<AiCoachResponse> generateAdvice(
      Principal principal) {

    AiCoachResponse response = aiCoachService.generateAdvice(
        principal.getName());

    return new ApiResponse<>(
        true,
        "AI financial advice generated successfully",
        response);
  }

}
