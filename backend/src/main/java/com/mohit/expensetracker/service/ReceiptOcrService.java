package com.mohit.expensetracker.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReceiptOcrService {

    public String extractText(MultipartFile file) {

        File tempFile = null;

        try {
            String originalFilename = file.getOriginalFilename();

            String extension = ".jpg";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                );
            }

            tempFile = Files.createTempFile(
                    "receipt-",
                    extension
            ).toFile();

            file.transferTo(tempFile);

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            "tesseract",
                            tempFile.getAbsolutePath(),
                            "stdout"
                    );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()
                            )
                    );

            StringBuilder output =
                    new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line)
                        .append(System.lineSeparator());
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException(
                        "Tesseract OCR failed"
                );
            }

            return output.toString().trim();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process receipt image",
                    e
            );

        } finally {

            if (tempFile != null &&
                    tempFile.exists()) {

                tempFile.delete();
            }
        }
    }
}