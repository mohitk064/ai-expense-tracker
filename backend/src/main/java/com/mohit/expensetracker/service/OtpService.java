package com.mohit.expensetracker.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mohit.expensetracker.entity.EmailVerificationOtp;
import com.mohit.expensetracker.repository.EmailVerificationOtpRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OtpService {

        private final EmailVerificationOtpRepository otpRepository;
        private final SecureRandom secureRandom = new SecureRandom();

        public OtpService(
                        EmailVerificationOtpRepository otpRepository) {

                this.otpRepository = otpRepository;
        }

        @Transactional
        public String generateAndSaveOtp(String email) {

                otpRepository.deleteByEmail(email);

                String otp = String.format(
                                "%06d",
                                secureRandom.nextInt(1_000_000));

                EmailVerificationOtp verificationOtp = new EmailVerificationOtp();

                verificationOtp.setEmail(email);
                verificationOtp.setOtp(otp);
                verificationOtp.setExpiresAt(
                                LocalDateTime.now().plusMinutes(10));

                otpRepository.save(verificationOtp);

                return otp;
        }
}