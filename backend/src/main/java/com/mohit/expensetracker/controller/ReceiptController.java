package com.mohit.expensetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.mohit.expensetracker.dto.ReceiptAnalysisResponse;
import com.mohit.expensetracker.service.ReceiptOcrService;
import com.mohit.expensetracker.service.ReceiptParserService;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

  private final ReceiptOcrService receiptOcrService;
  private final ReceiptParserService receiptParserService;

  public ReceiptController(
      ReceiptOcrService receiptOcrService,
      ReceiptParserService receiptParserService) {

    this.receiptOcrService = receiptOcrService;
    this.receiptParserService = receiptParserService;
  }

  @PostMapping("/upload")
  public ResponseEntity<?> uploadReceipt(
      @RequestParam("file") MultipartFile file) {

    if (file.isEmpty()) {
      return ResponseEntity
          .badRequest()
          .body("Receipt file is required");
    }

    String contentType = file.getContentType();

    if (contentType == null ||
        !contentType.startsWith("image/")) {

      return ResponseEntity
          .badRequest()
          .body("Only image files are allowed");
    }

    String extractedText = receiptOcrService.extractText(file);

    ReceiptAnalysisResponse analysis = receiptParserService.parse(extractedText);

    return ResponseEntity.ok(analysis);
  }
}