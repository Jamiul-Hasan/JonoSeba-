package com.jonoseba.complaints.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.complaints.dto.ComplaintAssignRequest;
import com.jonoseba.complaints.dto.ComplaintCreateRequest;
import com.jonoseba.complaints.dto.ComplaintResponse;
import com.jonoseba.complaints.dto.ComplaintStatusUpdateRequest;
import com.jonoseba.complaints.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @Valid @RequestBody ComplaintCreateRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.createComplaint(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint created", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getMyComplaints(Authentication authentication) {
        List<ComplaintResponse> responses = complaintService.getMyComplaints(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", responses));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints(
            @RequestParam(value = "status", required = false) String status,
            Authentication authentication) {
        List<ComplaintResponse> responses = complaintService.getAllComplaints(status, authentication);
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", responses));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintResponse>> assignComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintAssignRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.assignComplaint(id, request, authentication);
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned", response));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAssignedComplaints(Authentication authentication) {
        List<ComplaintResponse> responses = complaintService.getAssignedComplaints(authentication.getName(), authentication);
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", responses));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateRequest request,
            Authentication authentication) {
        ComplaintResponse response = complaintService.updateStatus(id, request, authentication);
        return ResponseEntity.ok(ApiResponse.success("Status updated", response));
    }
}
