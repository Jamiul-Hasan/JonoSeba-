package com.jonoseba.services.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.services.dto.ServiceRequest;
import com.jonoseba.services.dto.ServiceResponse;
import com.jonoseba.services.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    /**
     * Public endpoint - returns all active services
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getActiveServices() {
        List<ServiceResponse> services = serviceService.getActiveServices();
        return ResponseEntity.ok(ApiResponse.success("Services fetched", services));
    }

    /**
     * Create a new service (ADMIN only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(
            @Valid @RequestBody ServiceRequest request) {
        ServiceResponse created = serviceService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service created", created));
    }

    /**
     * Update existing service (ADMIN only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {
        ServiceResponse updated = serviceService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.success("Service updated", updated));
    }

    /**
     * Soft delete (set active=false) (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteService(@PathVariable Long id) {
        serviceService.softDeleteService(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted"));
    }
}
