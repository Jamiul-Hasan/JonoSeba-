package com.jonoseba.applications.controller;

import com.jonoseba.applications.dto.ApplicationCreateRequest;
import com.jonoseba.applications.dto.ApplicationResponse;
import com.jonoseba.applications.dto.ApplicationStatusUpdateRequest;
import com.jonoseba.applications.service.ApplicationService;
import com.jonoseba.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @Valid @RequestBody ApplicationCreateRequest request,
            Authentication authentication) {
        ApplicationResponse response = applicationService.createApplication(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application created", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(Authentication authentication) {
        List<ApplicationResponse> applications = applicationService.getMyApplications(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Applications fetched", applications));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CITIZEN','ADMIN','OFFICER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getApplication(
            @PathVariable Long id,
            Authentication authentication) {
        ApplicationResponse response = applicationService.getApplication(id, authentication.getName(), authentication);
        return ResponseEntity.ok(ApiResponse.success("Application fetched", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications(
            @RequestParam(value = "status", required = false) String status,
            Authentication authentication) {
        List<ApplicationResponse> applications = applicationService.getAllApplications(status, authentication);
        return ResponseEntity.ok(ApiResponse.success("Applications fetched", applications));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','OFFICER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            Authentication authentication) {
        ApplicationResponse response = applicationService.updateStatus(id, request, authentication);
        return ResponseEntity.ok(ApiResponse.success("Status updated", response));
    }
}
