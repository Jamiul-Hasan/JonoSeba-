package com.jonoseba.applications.service;

import com.jonoseba.applications.dto.ApplicationResponse;
import com.jonoseba.applications.dto.ApplicationStatusUpdateRequest;
import com.jonoseba.applications.model.Application;
import com.jonoseba.applications.repository.ApplicationRepository;
import com.jonoseba.common.exception.ResourceNotFoundException;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ApplicationService with authorization checks
 * Tests status update authorization for admin/officer vs citizen
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("ApplicationService Authorization Tests")
@Transactional
class ApplicationServiceTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private NotificationService notificationService;

    private User adminUser;
    private User officerUser;
    private User citizenUser;
    private Application testApplication;

    @BeforeEach
    void setUp() {
        // Create test users
        adminUser = userRepository.save(User.builder()
                .fullName("Admin User")
                .email("admin@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567890")
                .role(User.UserRole.ADMIN)
                .enabled(true)
                .build());

        officerUser = userRepository.save(User.builder()
                .fullName("Officer User")
                .email("officer@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567891")
                .role(User.UserRole.OFFICER)
                .enabled(true)
                .build());

        citizenUser = userRepository.save(User.builder()
                .fullName("Citizen User")
                .email("citizen@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567892")
                .role(User.UserRole.CITIZEN)
                .enabled(true)
                .build());

        // Create test application
        testApplication = applicationRepository.save(Application.builder()
                .citizen(citizenUser)
                .service("Birth Certificate")
                .status(Application.ApplicationStatus.PENDING)
                .remarks("Initial submission")
                .build());
    }

    @Test
    @DisplayName("Admin should update application status successfully")
    void testAdminCanUpdateStatus() {
        // Arrange
        Authentication adminAuth = createAuthentication("admin@example.com", "ROLE_ADMIN");
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.APPROVED)
                .remarks("Approved by admin")
                .build();

        // Act
        ApplicationResponse response = applicationService.updateStatus(testApplication.getId(), request, adminAuth);

        // Assert
        assertNotNull(response);
        assertEquals(Application.ApplicationStatus.APPROVED, response.getStatus());
        assertEquals("Approved by admin", response.getRemarks());
        verify(notificationService, times(1)).sendApplicationStatusChange(any(Application.class));
    }

    @Test
    @DisplayName("Officer should update application status successfully")
    void testOfficerCanUpdateStatus() {
        // Arrange
        Authentication officerAuth = createAuthentication("officer@example.com", "ROLE_OFFICER");
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.IN_PROGRESS)
                .remarks("Processing application")
                .build();

        // Act
        ApplicationResponse response = applicationService.updateStatus(testApplication.getId(), request, officerAuth);

        // Assert
        assertNotNull(response);
        assertEquals(Application.ApplicationStatus.IN_PROGRESS, response.getStatus());
        assertEquals("Processing application", response.getRemarks());
        verify(notificationService, times(1)).sendApplicationStatusChange(any(Application.class));
    }

    @Test
    @DisplayName("Citizen should NOT be able to update application status")
    void testCitizenCannotUpdateStatus() {
        // Arrange
        Authentication citizenAuth = createAuthentication("citizen@example.com", "ROLE_CITIZEN");
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.APPROVED)
                .remarks("Trying to approve own application")
                .build();

        // Act & Assert
        assertThrows(AccessDeniedException.class, () ->
                applicationService.updateStatus(testApplication.getId(), request, citizenAuth)
        );
        verify(notificationService, never()).sendApplicationStatusChange(any(Application.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent application")
    void testUpdateNonExistentApplication() {
        // Arrange
        Authentication adminAuth = createAuthentication("admin@example.com", "ROLE_ADMIN");
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.REJECTED)
                .remarks("Not found")
                .build();

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () ->
                applicationService.updateStatus(999L, request, adminAuth)
        );
    }

    @Test
    @DisplayName("Should update application with null remarks")
    void testUpdateStatusWithNullRemarks() {
        // Arrange
        Authentication adminAuth = createAuthentication("admin@example.com", "ROLE_ADMIN");
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.REJECTED)
                .remarks(null)
                .build();

        // Act
        ApplicationResponse response = applicationService.updateStatus(testApplication.getId(), request, adminAuth);

        // Assert
        assertNotNull(response);
        assertEquals(Application.ApplicationStatus.REJECTED, response.getStatus());
        verify(notificationService, times(1)).sendApplicationStatusChange(any(Application.class));
    }

    @Test
    @DisplayName("Should throw exception with null authentication")
    void testUpdateStatusWithNullAuthentication() {
        // Arrange
        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.APPROVED)
                .remarks("Update")
                .build();

        // Act & Assert
        assertThrows(AccessDeniedException.class, () ->
                applicationService.updateStatus(testApplication.getId(), request, null)
        );
    }

    @Test
    @DisplayName("Multiple status transitions should work correctly")
    void testMultipleStatusTransitions() {
        // Arrange
        Authentication adminAuth = createAuthentication("admin@example.com", "ROLE_ADMIN");

        // Act & Assert - PENDING -> IN_PROGRESS
        ApplicationStatusUpdateRequest inProgressRequest = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.IN_PROGRESS)
                .remarks("Started processing")
                .build();
        ApplicationResponse response1 = applicationService.updateStatus(testApplication.getId(), inProgressRequest, adminAuth);
        assertEquals(Application.ApplicationStatus.IN_PROGRESS, response1.getStatus());

        // PENDING -> IN_PROGRESS -> APPROVED
        ApplicationStatusUpdateRequest approvedRequest = ApplicationStatusUpdateRequest.builder()
                .status(Application.ApplicationStatus.APPROVED)
                .remarks("Approved")
                .build();
        ApplicationResponse response2 = applicationService.updateStatus(testApplication.getId(), approvedRequest, adminAuth);
        assertEquals(Application.ApplicationStatus.APPROVED, response2.getStatus());

        verify(notificationService, times(2)).sendApplicationStatusChange(any(Application.class));
    }

    /**
     * Helper method to create Authentication with specified role
     */
    private Authentication createAuthentication(String username, String... roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }
}
