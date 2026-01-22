package com.jonoseba.files.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.files.dto.FileUploadResponse;
import com.jonoseba.files.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.uploadFile(file);
            String originalFilename = file.getOriginalFilename();

            FileUploadResponse response = FileUploadResponse.builder()
                    .url(fileUrl)
                    .filename(originalFilename)
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("File uploaded successfully", response));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }
}
