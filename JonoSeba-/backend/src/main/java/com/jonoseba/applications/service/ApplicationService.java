package com.jonoseba.applications.service;

import com.jonoseba.applications.dto.ApplicationCreateRequest;
import com.jonoseba.applications.dto.ApplicationResponse;
import com.jonoseba.applications.dto.ApplicationStatusUpdateRequest;
import com.jonoseba.applications.model.Application;
import com.jonoseba.applications.repository.ApplicationRepository;
import com.jonoseba.common.exception.ResourceNotFoundException;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.services.model.Service;
import com.jonoseba.services.repository.ServiceRepository;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationResponse createApplication(ApplicationCreateRequest request, String userEmail) {
        User citizen = getUserByEmail(userEmail);

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));
        if (Boolean.FALSE.equals(service.getActive())) {
            throw new ResourceNotFoundException("Service not found with id: " + request.getServiceId());
        }

        Application application = Application.builder()
                .citizen(citizen)
                .service(service)
                .title(request.getTitle())
                .description(request.getDescription())
                .documentUrls(request.getDocumentUrls())
                .status(Application.ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(String userEmail) {
        User citizen = getUserByEmail(userEmail);
        return applicationRepository.findByCitizen(citizen)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplication(Long id, String userEmail, Authentication authentication) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!canView(application, userEmail, authentication)) {
            throw new AccessDeniedException("You are not authorized to view this application");
        }

        return toResponse(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications(String status, Authentication authentication) {
        if (!isAdminOrOfficer(authentication)) {
            throw new AccessDeniedException("You are not authorized to view applications");
        }

        List<Application> apps;
        if (status != null && !status.isBlank()) {
            Application.ApplicationStatus parsedStatus = parseStatus(status);
            apps = applicationRepository.findByStatus(parsedStatus);
        } else {
            apps = applicationRepository.findAll();
        }

        return apps.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, ApplicationStatusUpdateRequest request, Authentication authentication) {
        if (!isAdminOrOfficer(authentication)) {
            throw new AccessDeniedException("You are not authorized to update application status");
        }

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setStatus(request.getStatus());
        application.setRemarks(request.getRemarks());

        Application updated = applicationRepository.save(application);

        // Send notification asynchronously
        notificationService.sendApplicationStatusChange(updated);

        return toResponse(updated);
    }

    private boolean canView(Application application, String userEmail, Authentication authentication) {
        if (isAdminOrOfficer(authentication)) {
            return true;
        }
        return application.getCitizen() != null && userEmail.equalsIgnoreCase(application.getCitizen().getEmail());
    }

    private boolean isAdminOrOfficer(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String role = authority.getAuthority();
            if ("ROLE_ADMIN".equals(role) || "ROLE_OFFICER".equals(role)) {
                return true;
            }
        }
        return false;
    }

    private Application.ApplicationStatus parseStatus(String status) {
        try {
            return Application.ApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private ApplicationResponse toResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .serviceId(application.getService() != null ? application.getService().getId() : null)
                .serviceName(application.getService() != null ? application.getService().getName() : null)
                .citizenId(application.getCitizen() != null ? application.getCitizen().getId() : null)
                .citizenName(application.getCitizen() != null ? application.getCitizen().getFullName() : null)
                .title(application.getTitle())
                .description(application.getDescription())
                .status(application.getStatus())
                .remarks(application.getRemarks())
                .documentUrls(application.getDocumentUrls())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
