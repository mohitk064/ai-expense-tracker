package com.mohit.expensetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mohit.expensetracker.entity.User;

public interface  UserRepository extends JpaRepository<User, Long> {

  
}

