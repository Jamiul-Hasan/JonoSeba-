package com.jonoseba.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jonoseba.auth.dto.AuthResponse;
import com.jonoseba.auth.dto.LoginRequest;
import com.jonoseba.auth.dto.RegisterRequest;
import com.jonoseba.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController
 * Tests register and login endpoints with MockMvc
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Should register user successfully")
    void testRegisterSuccess() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("SecurePass123")
                .fullName("John Doe")
                .phone("+8801234567890")
                .role("CITIZEN")
                .build();

        AuthResponse response = AuthResponse.builder()
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                .userId(1L)
                .name("John Doe")
                .role("CITIZEN")
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful"))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.name").value("John Doe"))
                .andExpect(jsonPath("$.data.role").value("CITIZEN"))
                // Password should never be in response
                .andExpect(jsonPath("$.data.password").doesNotExist());
    }

    @Test
    @DisplayName("Should fail registration with invalid email")
    void testRegisterInvalidEmail() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .email("invalid-email")
                .password("SecurePass123")
                .fullName("John Doe")
                .phone("+8801234567890")
                .role("CITIZEN")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details").isNotEmpty());
    }

    @Test
    @DisplayName("Should fail registration with weak password")
    void testRegisterWeakPassword() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("weak")  // Less than 6 characters
                .fullName("John Doe")
                .phone("+8801234567890")
                .role("CITIZEN")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.details.password").isNotEmpty());
    }

    @Test
    @DisplayName("Should fail registration with missing required fields")
    void testRegisterMissingFields() throws Exception {
        // Arrange
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@example.com")
                // password omitted
                .fullName("John Doe")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.details.password").isNotEmpty());
    }

    @Test
    @DisplayName("Should login user successfully")
    void testLoginSuccess() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("user@example.com")
                .password("Password123")
                .build();

        AuthResponse response = AuthResponse.builder()
                .token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
                .userId(1L)
                .name("John Doe")
                .role("CITIZEN")
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.role").value("CITIZEN"))
                // Password should never be in response
                .andExpect(jsonPath("$.data.password").doesNotExist());
    }

    @Test
    @DisplayName("Should fail login with invalid email")
    void testLoginInvalidEmail() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("invalid-email")
                .password("Password123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Should fail login with missing password")
    void testLoginMissingPassword() throws Exception {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("user@example.com")
                // password omitted
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.details.password").isNotEmpty());
    }

    @Test
    @DisplayName("Should logout successfully")
    void testLogoutSuccess() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }
}
