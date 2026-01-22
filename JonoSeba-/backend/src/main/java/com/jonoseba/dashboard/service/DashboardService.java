package com.jonoseba.dashboard.service;

import com.jonoseba.applications.model.Application;
import com.jonoseba.applications.repository.ApplicationRepository;
import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.complaints.repository.ComplaintRepository;
import com.jonoseba.dashboard.dto.*;
import com.jonoseba.notifications.repository.NotificationRepository;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final ComplaintRepository complaintRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CitizenDashboardResponse getCitizenDashboard(User citizen) {
        // Get application counts
        long applicationsTotal = applicationRepository.countByCitizen(citizen);
        long applicationsPending = applicationRepository.countByCitizenAndStatus(
                citizen, Application.ApplicationStatus.PENDING
        );

        // Get complaint counts
        long complaintsTotal = complaintRepository.countByCitizen(citizen);
        long complaintsOpen = complaintRepository.countByCitizenAndStatus(
                citizen, Complaint.ComplaintStatus.NEW
        ) + complaintRepository.countByCitizenAndStatus(
                citizen, Complaint.ComplaintStatus.ASSIGNED
        ) + complaintRepository.countByCitizenAndStatus(
                citizen, Complaint.ComplaintStatus.IN_PROGRESS
        );

        // Get recent notifications (last 5)
        List<RecentNotificationDto> recentNotifications = notificationRepository
                .findByUserId(citizen.getId())
                .stream()
                .sorted(Comparator.comparing(n -> n.getCreatedAt(), Comparator.reverseOrder()))
                .limit(5)
                .map(RecentNotificationDto::fromEntity)
                .collect(Collectors.toList());

        return CitizenDashboardResponse.builder()
                .applicationsTotal(applicationsTotal)
                .applicationsPending(applicationsPending)
                .complaintsTotal(complaintsTotal)
                .complaintsOpen(complaintsOpen)
                .recentNotifications(recentNotifications)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        // Get application totals and breakdowns
        long applicationsTotal = applicationRepository.count();
        Map<String, Long> applicationsByStatus = new HashMap<>();
        for (Application.ApplicationStatus status : Application.ApplicationStatus.values()) {
            long count = applicationRepository.countByStatus(status);
            applicationsByStatus.put(status.name(), count);
        }

        // Get complaint totals and breakdowns
        long complaintsTotal = complaintRepository.count();
        Map<String, Long> complaintsByStatus = new HashMap<>();
        for (Complaint.ComplaintStatus status : Complaint.ComplaintStatus.values()) {
            long count = complaintRepository.countByStatus(status);
            complaintsByStatus.put(status.name(), count);
        }

        // Get user counts by role
        long totalUsers = userRepository.count();
        long totalOfficers = userRepository.countByRole(User.UserRole.OFFICER);
        long totalCitizens = userRepository.countByRole(User.UserRole.CITIZEN);

        return AdminDashboardResponse.builder()
                .applicationsTotal(applicationsTotal)
                .applicationsByStatus(applicationsByStatus)
                .complaintsTotal(complaintsTotal)
                .complaintsByStatus(complaintsByStatus)
                .totalUsers(totalUsers)
                .totalOfficers(totalOfficers)
                .totalCitizens(totalCitizens)
                .build();
    }

    @Transactional(readOnly = true)
    public OfficerDashboardResponse getOfficerDashboard(User officer) {
        // Get complaint counts by status for assigned complaints
        long totalAssigned = complaintRepository.countByAssignedTo(officer);
        long inProgress = complaintRepository.countByAssignedToAndStatus(
                officer, Complaint.ComplaintStatus.IN_PROGRESS
        );
        long resolved = complaintRepository.countByAssignedToAndStatus(
                officer, Complaint.ComplaintStatus.RESOLVED
        );
        long rejected = complaintRepository.countByAssignedToAndStatus(
                officer, Complaint.ComplaintStatus.REJECTED
        );

        // Get breakdown by status
        Map<String, Long> complaintsByStatus = new HashMap<>();
        for (Complaint.ComplaintStatus status : Complaint.ComplaintStatus.values()) {
            long count = complaintRepository.countByAssignedToAndStatus(officer, status);
            if (count > 0) {
                complaintsByStatus.put(status.name(), count);
            }
        }

        // Get recent assigned complaints (last 5)
        Pageable pageable = PageRequest.of(0, 5);
        List<AssignedComplaintDto> recentComplaints = complaintRepository
                .findByAssignedToOrderByCreatedAtDesc(officer, pageable)
                .stream()
                .map(AssignedComplaintDto::fromEntity)
                .collect(Collectors.toList());

        return OfficerDashboardResponse.builder()
                .complaintsAssignedByStatus(complaintsByStatus)
                .totalAssigned(totalAssigned)
                .inProgress(inProgress)
                .resolved(resolved)
                .rejected(rejected)
                .recentAssignedComplaints(recentComplaints)
                .build();
    }
}
