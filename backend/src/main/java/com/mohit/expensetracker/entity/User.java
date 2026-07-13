package com.mohit.expensetracker.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
   @Column(nullable = false, unique = true)
   private String email;

   private String password;

   private String phoneNumber;

   private LocalDate dateOfBirth;
}
