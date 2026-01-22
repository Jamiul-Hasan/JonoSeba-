package com.jonoseba.scheduling;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jonoseba.applications.model.Application;
import com.jonoseba.applications.repository.ApplicationRepository;
import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.complaints.repository.ComplaintRepository;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.reports.model.Report;
import com.jonoseba.reports.repository.ReportRepository;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledJobs {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ApplicationRepository applicationRepository;
    private final ReportRepository reportRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Runs every 2 minutes. Assigns NEW complaints without assignee to officers in round-robin
     * based on the least number of open tasks (ASSIGNED + IN_PROGRESS).
     */
    @Transactional
    @Scheduled(fixedDelay = 120_000, initialDelay = 20_000)
    public void autoAssignComplaints() {
        List<Complaint> unassigned = complaintRepository.findByStatusAndAssignedToIsNull(Complaint.ComplaintStatus.NEW);
        if (unassigned.isEmpty()) {
            return;
        }

        List<User> officers = userRepository.findByRole(User.UserRole.OFFICER);
        if (officers.isEmpty()) {
            log.warn("No officers available for auto-assignment");
            return;
        }

        // Precompute open task counts per officer (ASSIGNED + IN_PROGRESS)
        Map<Long, Long> openCounts = new HashMap<>();
        for (User officer : officers) {
            long open = complaintRepository.countByAssignedToAndStatus(officer, Complaint.ComplaintStatus.ASSIGNED)
                    + complaintRepository.countByAssignedToAndStatus(officer, Complaint.ComplaintStatus.IN_PROGRESS);
            openCounts.put(officer.getId(), open);
        }

        // Sort complaints by creation time to process oldest first
        unassigned.sort(Comparator.comparing(Complaint::getCreatedAt));

        for (Complaint complaint : unassigned) {
            // Pick officer with least open tasks; tie-breaker by officer id
            User selected = officers.stream()
                    .min(Comparator.comparing((User o) -> openCounts.getOrDefault(o.getId(), 0L))
                            .thenComparing(User::getId))
                    .orElse(null);

            if (selected == null) {
                break;
            }

            // Assign complaint
            complaint.setAssignedTo(selected);
            complaint.setStatus(Complaint.ComplaintStatus.ASSIGNED);
            complaintRepository.save(complaint);

            // Update count to keep round-robin balanced
            openCounts.put(selected.getId(), openCounts.getOrDefault(selected.getId(), 0L) + 1);

            // Notify citizen
            notificationService.sendComplaintAssignment(complaint);
        }
    }

    /**
     * Daily report at 23:59. Logs totals and stores in Report table.
     */
    @Transactional
    @Scheduled(cron = "0 59 23 * * *")
    public void dailyReport() {
        long applicationsTotal = applicationRepository.count();
        long complaintsTotal = complaintRepository.count();

        Map<String, Long> appByStatus = new HashMap<>();
        for (Application.ApplicationStatus status : Application.ApplicationStatus.values()) {
            appByStatus.put(status.name(), applicationRepository.countByStatus(status));
        }

        Map<String, Long> complaintByStatus = new HashMap<>();
        for (Complaint.ComplaintStatus status : Complaint.ComplaintStatus.values()) {
            complaintByStatus.put(status.name(), complaintRepository.countByStatus(status));
        }

        log.info("Daily report {} => applications: {}, complaints: {}", LocalDate.now(), appByStatus, complaintByStatus);

        try {
            Report report = Report.builder()
                    .applicationsTotal(applicationsTotal)
                    .complaintsTotal(complaintsTotal)
                    .applicationsByStatus(objectMapper.writeValueAsString(appByStatus))
                    .complaintsByStatus(objectMapper.writeValueAsString(complaintByStatus))
                    .build();
            reportRepository.save(report);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize report JSON", e);
        }
    }
}
