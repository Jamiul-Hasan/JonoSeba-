package com.jonoseba.dashboard.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.dashboard.dto.AdminDashboardResponse;
import com.jonoseba.dashboard.dto.CitizenDashboardResponse;
import com.jonoseba.dashboard.dto.OfficerDashboardResponse;
import com.jonoseba.dashboard.service.DashboardService;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/citizen")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ApiResponse<CitizenDashboardResponse>> getCitizenDashboard(
            Authentication authentication) {
        User citizen = getUserFromAuthentication(authentication);
        CitizenDashboardResponse response = dashboardService.getCitizenDashboard(citizen);
        return ResponseEntity.ok(ApiResponse.success("Citizen dashboard data", response));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard data", response));
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<ApiResponse<OfficerDashboardResponse>> getOfficerDashboard(
            Authentication authentication) {
        User officer = getUserFromAuthentication(authentication);
        OfficerDashboardResponse response = dashboardService.getOfficerDashboard(officer);
        return ResponseEntity.ok(ApiResponse.success("Officer dashboard data", response));
    }

    private User getUserFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
