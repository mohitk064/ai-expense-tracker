package com.mohit.expensetracker.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@AllArgsConstructor

public class Expense {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String item;
  private BigDecimal amount;
  private LocalDate date;
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
