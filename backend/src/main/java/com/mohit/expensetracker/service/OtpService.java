package com.mohit.expensetracker.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mohit.expensetracker.entity.EmailVerificationOtp;
import com.mohit.expensetracker.entity.User;
import com.mohit.expensetracker.exception.OtpCooldownException;
import com.mohit.expensetracker.repository.EmailVerificationOtpRepository;
import com.mohit.expensetracker.repository.UserRepository;

@Service
public class OtpService {

        private final EmailVerificationOtpRepository otpRepository;
        private final UserRepository userRepository;
        private final SecureRandom secureRandom = new SecureRandom();

        public OtpService(
                        EmailVerificationOtpRepository otpRepository,
                        UserRepository userRepository) {

                this.otpRepository = otpRepository;
                this.userRepository = userRepository;
        }

        @Transactional
        public String generateAndSaveOtp(String email) {

                otpRepository.deleteByEmail(email);

                String otp = String.format(
                                "%06d",
                                secureRandom.nextInt(1_000_000));

                LocalDateTime now = LocalDateTime.now();

                EmailVerificationOtp verificationOtp = new EmailVerificationOtp();

                verificationOtp.setEmail(email);
                verificationOtp.setOtp(otp);

                verificationOtp.setCreatedAt(now);
                verificationOtp.setExpiresAt(
                                now.plusMinutes(10));

                otpRepository.save(verificationOtp);

                return otp;
        }

        @Transactional
        public void verifyOtp(String email, String otp) {

                EmailVerificationOtp verificationOtp = otpRepository.findByEmail(email)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "OTP not found"));

                if (verificationOtp.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        otpRepository.deleteByEmail(email);

                        throw new RuntimeException(
                                        "OTP has expired");
                }

                if (!verificationOtp.getOtp().equals(otp)) {
                        throw new RuntimeException(
                                        "Invalid OTP");
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                user.setEmailVerified(true);

                userRepository.save(user);

                otpRepository.deleteByEmail(email);
        }

        @Transactional
        public String resendOtp(String email) {

                otpRepository.findByEmail(email)
                                .ifPresent(existingOtp -> {

                                        if (existingOtp.getCreatedAt() != null &&
                                                        existingOtp.getCreatedAt()
                                                                        .plusMinutes(1)
                                                                        .isAfter(LocalDateTime.now())) {

                                                throw new OtpCooldownException(
                                                                "Please wait 1 minute before requesting another OTP");
                                        }
                                });

                otpRepository.deleteByEmail(email);

                String otp = String.format(
                                "%06d",
                                secureRandom.nextInt(1_000_000));

                LocalDateTime now = LocalDateTime.now();

                EmailVerificationOtp verificationOtp = new EmailVerificationOtp();

                verificationOtp.setEmail(email);
                verificationOtp.setOtp(otp);
                verificationOtp.setCreatedAt(now);
                verificationOtp.setExpiresAt(
                                now.plusMinutes(10));

                otpRepository.save(verificationOtp);

                return otp;
        }
}