package com.jonoseba.users.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.users.dto.UserProfileDTO;
import com.jonoseba.users.dto.UpdateProfileRequest;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Get current user profile
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserProfileDTO profile = UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    /**
     * Update current user profile
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateCurrentUser(
            @Valid @RequestBody UpdateProfileRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update fields if provided
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setFullName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        User updatedUser = userRepository.save(user);
        
        UserProfileDTO profile = UserProfileDTO.builder()
                .id(updatedUser.getId())
                .name(updatedUser.getFullName())
                .email(updatedUser.getEmail())
                .phone(updatedUser.getPhone())
                .address(updatedUser.getAddress())
                .role(updatedUser.getRole().name())
                .createdAt(updatedUser.getCreatedAt())
                .build();
        
        log.info("Profile updated for user: {}", email);
        
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }
}
