package com.jonoseba.auth.controller;

import com.jonoseba.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login() {
        return ResponseEntity.ok(ApiResponse.success("Login successful"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register() {
        return ResponseEntity.ok(ApiResponse.success("Registration successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }
}
