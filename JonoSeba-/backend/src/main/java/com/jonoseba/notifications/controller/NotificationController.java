package com.jonoseba.notifications.controller;

import com.jonoseba.common.dto.ApiResponse;
import com.jonoseba.notifications.dto.NotificationResponse;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<NotificationResponse> notifications = notificationService.getMyNotifications(user);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", notifications));
    }

    @GetMapping("/me/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getRecentNotifications(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<NotificationResponse> notifications = notificationService.getMyRecentNotifications(user, limit);
        return ResponseEntity.ok(ApiResponse.success("Recent notifications fetched", notifications));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PatchMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    private User getUserFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
