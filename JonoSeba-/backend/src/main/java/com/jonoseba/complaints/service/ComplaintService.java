package com.jonoseba.complaints.service;

import com.jonoseba.common.exception.ResourceNotFoundException;
import com.jonoseba.complaints.dto.ComplaintAssignRequest;
import com.jonoseba.complaints.dto.ComplaintCreateRequest;
import com.jonoseba.complaints.dto.ComplaintResponse;
import com.jonoseba.complaints.dto.ComplaintStatusUpdateRequest;
import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.complaints.repository.ComplaintRepository;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintCreateRequest request, String userEmail) {
        User citizen = getUserByEmail(userEmail);
        Complaint complaint = Complaint.builder()
                .citizen(citizen)
                .category(request.getCategory())
                .description(request.getDescription())
                .locationText(request.getLocationText())
                .photoUrl(request.getPhotoUrl())
                .status(Complaint.ComplaintStatus.NEW)
                .build();
        Complaint saved = complaintRepository.save(complaint);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(String userEmail) {
        User citizen = getUserByEmail(userEmail);
        return complaintRepository.findByCitizen(citizen)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints(String status, Authentication authentication) {
        ensureAdmin(authentication);
        List<Complaint> complaints;
        if (status != null && !status.isBlank()) {
            complaints = complaintRepository.findByStatus(parseStatus(status));
        } else {
            complaints = complaintRepository.findAll();
        }
        return complaints.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse assignComplaint(Long id, ComplaintAssignRequest request, Authentication authentication) {
        ensureAdmin(authentication);
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        User officer = userRepository.findById(request.getAssignToOfficerId())
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + request.getAssignToOfficerId()));

        complaint.setAssignedTo(officer);
        complaint.setStatus(Complaint.ComplaintStatus.ASSIGNED);

        Complaint saved = complaintRepository.save(complaint);
        notificationService.sendComplaintAssignment(saved);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAssignedComplaints(String userEmail, Authentication authentication) {
        ensureOfficer(authentication);
        User officer = getUserByEmail(userEmail);
        return complaintRepository.findByAssignedTo(officer)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, ComplaintStatusUpdateRequest request, Authentication authentication) {
        if (!isOfficerOrAdmin(authentication)) {
            throw new AccessDeniedException("You are not authorized to update complaint status");
        }

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        // If officer, ensure assigned to current officer
        if (isOfficerOnly(authentication) && !isAssignedTo(authentication, complaint)) {
            throw new AccessDeniedException("You are not authorized to update this complaint");
        }

        complaint.setStatus(request.getStatus());
        complaint.setProgressNote(request.getProgressNote());

        Complaint saved = complaintRepository.save(complaint);
        notificationService.sendComplaintStatusChange(saved);
        return toResponse(saved);
    }

    private Complaint.ComplaintStatus parseStatus(String status) {
        try {
            return Complaint.ComplaintStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    private void ensureAdmin(Authentication authentication) {
        if (!hasRole(authentication, "ROLE_ADMIN")) {
            throw new AccessDeniedException("You are not authorized to perform this action");
        }
    }

    private void ensureOfficer(Authentication authentication) {
        if (!hasRole(authentication, "ROLE_OFFICER") && !hasRole(authentication, "ROLE_ADMIN")) {
            throw new AccessDeniedException("You are not authorized to perform this action");
        }
    }

    private boolean isOfficerOrAdmin(Authentication authentication) {
        return hasRole(authentication, "ROLE_OFFICER") || hasRole(authentication, "ROLE_ADMIN");
    }

    private boolean isOfficerOnly(Authentication authentication) {
        return hasRole(authentication, "ROLE_OFFICER") && !hasRole(authentication, "ROLE_ADMIN");
    }

    private boolean isAssignedTo(Authentication authentication, Complaint complaint) {
        if (complaint.getAssignedTo() == null || authentication == null) return false;
        return complaint.getAssignedTo().getEmail().equalsIgnoreCase(authentication.getName());
    }

    private boolean hasRole(Authentication authentication, String role) {
        if (authentication == null || authentication.getAuthorities() == null) return false;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (role.equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .category(complaint.getCategory())
                .description(complaint.getDescription())
                .photoUrl(complaint.getPhotoUrl())
                .locationText(complaint.getLocationText())
                .status(complaint.getStatus())
                .citizenId(complaint.getCitizen() != null ? complaint.getCitizen().getId() : null)
                .citizenName(complaint.getCitizen() != null ? complaint.getCitizen().getFullName() : null)
                .assignedToId(complaint.getAssignedTo() != null ? complaint.getAssignedTo().getId() : null)
                .assignedToName(complaint.getAssignedTo() != null ? complaint.getAssignedTo().getFullName() : null)
                .progressNote(complaint.getProgressNote())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
