package com.jonoseba.files.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(
            Arrays.asList("jpg", "jpeg", "png", "pdf")
    );
    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(
            Arrays.asList("image/jpeg", "image/png", "application/pdf")
    );

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        // Generate unique filename with UUID
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID() + "." + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        file.transferTo(filePath.toFile());

        // Return file URL (relative path for frontend use)
        return "/uploads/" + uniqueFilename;
    }

    public void validateFile(MultipartFile file) throws IOException {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        // Get file extension
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Invalid file format");
        }

        String fileExtension = getFileExtension(filename).toLowerCase();

        // Check file extension
        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException(
                    "File type not allowed. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS)
            );
        }

        // Check MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file MIME type");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        // Remove leading slash if present
        String relativePath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
        Path fullPath = Paths.get(System.getProperty("user.dir"), relativePath);

        if (Files.exists(fullPath)) {
            Files.delete(fullPath);
        }
    }
}
