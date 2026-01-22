package com.jonoseba.scheduling;

import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.complaints.repository.ComplaintRepository;
import com.jonoseba.notifications.service.NotificationService;
import com.jonoseba.reports.model.Report;
import com.jonoseba.reports.repository.ReportRepository;
import com.jonoseba.users.model.User;
import com.jonoseba.users.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Integration tests for ScheduledJobs using @SpringBootTest with H2 database
 * Tests auto-assignment of complaints to officers based on load balancing
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("ScheduledJobs Auto-Assignment Tests")
@Transactional
class ScheduledJobsTest {

    @Autowired
    private ScheduledJobs scheduledJobs;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportRepository reportRepository;

    @MockBean
    private NotificationService notificationService;

    private User officer1;
    private User officer2;
    private User officer3;
    private User citizen;

    @BeforeEach
    void setUp() {
        // Create test officers
        officer1 = userRepository.save(User.builder()
                .fullName("Officer One")
                .email("officer1@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567890")
                .role(User.UserRole.OFFICER)
                .enabled(true)
                .build());

        officer2 = userRepository.save(User.builder()
                .fullName("Officer Two")
                .email("officer2@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567891")
                .role(User.UserRole.OFFICER)
                .enabled(true)
                .build());

        officer3 = userRepository.save(User.builder()
                .fullName("Officer Three")
                .email("officer3@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567892")
                .role(User.UserRole.OFFICER)
                .enabled(true)
                .build());

        // Create test citizen
        citizen = userRepository.save(User.builder()
                .fullName("Test Citizen")
                .email("citizen@example.com")
                .passwordHash("$2a$10$hashedPassword")
                .phone("+8801234567893")
                .role(User.UserRole.CITIZEN)
                .enabled(true)
                .build());
    }

    @Test
    @DisplayName("Should auto-assign single unassigned complaint to any officer")
    void testAutoAssignSingleComplaint() {
        // Arrange
        Complaint unassigned = complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Test Complaint")
                .description("Test Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        Complaint assigned = complaintRepository.findById(unassigned.getId()).orElseThrow();
        assertNotNull(assigned.getAssignedTo());
        assertEquals(Complaint.ComplaintStatus.ASSIGNED, assigned.getStatus());
        verify(notificationService, times(1)).sendComplaintAssignment(any(Complaint.class));
    }

    @Test
    @DisplayName("Should distribute complaints evenly across officers (load balancing)")
    void testLoadBalancingDistribution() {
        // Arrange - Create 6 complaints
        for (int i = 0; i < 6; i++) {
            complaintRepository.save(Complaint.builder()
                    .citizen(citizen)
                    .subject("Complaint " + i)
                    .description("Description " + i)
                    .status(Complaint.ComplaintStatus.NEW)
                    .createdAt(LocalDateTime.now().minusMinutes(i))
                    .build());
        }

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        long officer1Count = complaintRepository.findByAssignedTo(officer1).stream()
                .filter(c -> c.getStatus() == Complaint.ComplaintStatus.ASSIGNED)
                .count();
        long officer2Count = complaintRepository.findByAssignedTo(officer2).stream()
                .filter(c -> c.getStatus() == Complaint.ComplaintStatus.ASSIGNED)
                .count();
        long officer3Count = complaintRepository.findByAssignedTo(officer3).stream()
                .filter(c -> c.getStatus() == Complaint.ComplaintStatus.ASSIGNED)
                .count();

        // Each officer should get 2 complaints (6 / 3)
        assertEquals(2, officer1Count);
        assertEquals(2, officer2Count);
        assertEquals(2, officer3Count);

        verify(notificationService, times(6)).sendComplaintAssignment(any(Complaint.class));
    }

    @Test
    @DisplayName("Should not auto-assign when no unassigned complaints exist")
    void testNoComplaintsToAssign() {
        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        verifyNoInteractions(notificationService);
    }

    @Test
    @DisplayName("Should not auto-assign when no officers are available")
    void testNoOfficersAvailable() {
        // Arrange - Create complaint but delete all officers
        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Complaint")
                .description("Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.deleteAll();

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert - Complaint should remain unassigned
        List<Complaint> unassigned = complaintRepository.findByStatusAndAssignedToIsNull(Complaint.ComplaintStatus.NEW);
        assertEquals(1, unassigned.size());
        verifyNoInteractions(notificationService);
    }

    @Test
    @DisplayName("Should auto-assign only NEW status complaints")
    void testAutoAssignOnlyNewComplaints() {
        // Arrange
        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("New Complaint")
                .description("Should be assigned")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Assigned Complaint")
                .description("Should not be reassigned")
                .status(Complaint.ComplaintStatus.ASSIGNED)
                .assignedTo(officer1)
                .createdAt(LocalDateTime.now())
                .build());

        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("In Progress Complaint")
                .description("Should not be reassigned")
                .status(Complaint.ComplaintStatus.IN_PROGRESS)
                .assignedTo(officer2)
                .createdAt(LocalDateTime.now())
                .build());

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        List<Complaint> newComplaints = complaintRepository.findByStatusAndAssignedToIsNull(Complaint.ComplaintStatus.NEW);
        assertEquals(0, newComplaints.size()); // Should all be assigned

        assertEquals(1, complaintRepository.findByAssignedTo(officer1).size());
        assertEquals(1, complaintRepository.findByAssignedTo(officer2).size());
        assertEquals(1, complaintRepository.findByAssignedTo(officer3).size()); // The only new one

        verify(notificationService, times(1)).sendComplaintAssignment(any(Complaint.class));
    }

    @Test
    @DisplayName("Should assign to officer with least open tasks")
    void testAssignToOfficerWithLeastLoad() {
        // Arrange - Pre-assign some tasks to officer1
        for (int i = 0; i < 3; i++) {
            complaintRepository.save(Complaint.builder()
                    .citizen(citizen)
                    .subject("Assigned to Officer 1 - " + i)
                    .description("Description")
                    .status(Complaint.ComplaintStatus.ASSIGNED)
                    .assignedTo(officer1)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // officer2 has 1 task
        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Assigned to Officer 2")
                .description("Description")
                .status(Complaint.ComplaintStatus.IN_PROGRESS)
                .assignedTo(officer2)
                .createdAt(LocalDateTime.now())
                .build());

        // officer3 has 0 tasks

        // Create new complaint to assign
        Complaint newComplaint = complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("New Complaint")
                .description("Should go to officer3 (least load)")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        Complaint assigned = complaintRepository.findById(newComplaint.getId()).orElseThrow();
        assertEquals(officer3, assigned.getAssignedTo()); // officer3 has 0 tasks
    }

    @Test
    @DisplayName("Should process complaints in order of creation (FIFO)")
    void testComplaintsProcessedInCreationOrder() {
        // Arrange - Create 3 complaints with different timestamps
        Complaint oldComplaint = complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Old Complaint")
                .description("Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now().minusMinutes(10))
                .build());

        Complaint middleComplaint = complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Middle Complaint")
                .description("Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now().minusMinutes(5))
                .build());

        Complaint newComplaint = complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("New Complaint")
                .description("Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert - Each should go to different officers in round-robin
        Complaint assignedOld = complaintRepository.findById(oldComplaint.getId()).orElseThrow();
        Complaint assignedMiddle = complaintRepository.findById(middleComplaint.getId()).orElseThrow();
        Complaint assignedNew = complaintRepository.findById(newComplaint.getId()).orElseThrow();

        assertEquals(officer1, assignedOld.getAssignedTo());
        assertEquals(officer2, assignedMiddle.getAssignedTo());
        assertEquals(officer3, assignedNew.getAssignedTo());
    }

    @Test
    @DisplayName("Should be idempotent - running twice should not reassign")
    void testIdempotentAutoAssignment() {
        // Arrange
        complaintRepository.save(Complaint.builder()
                .citizen(citizen)
                .subject("Complaint")
                .description("Description")
                .status(Complaint.ComplaintStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build());

        // Act - First run
        scheduledJobs.autoAssignComplaints();
        Complaint afterFirstRun = complaintRepository.findAll().get(0);
        User firstAssignee = afterFirstRun.getAssignedTo();

        // Act - Second run
        scheduledJobs.autoAssignComplaints();
        Complaint afterSecondRun = complaintRepository.findById(afterFirstRun.getId()).orElseThrow();

        // Assert - Should still be assigned to same officer
        assertEquals(firstAssignee, afterSecondRun.getAssignedTo());
        assertEquals(Complaint.ComplaintStatus.ASSIGNED, afterSecondRun.getStatus());
        verify(notificationService, times(1)).sendComplaintAssignment(any(Complaint.class)); // Only once
    }

    @Test
    @DisplayName("Should handle concurrent complaints correctly")
    void testHandleMultipleConcurrentComplaints() {
        // Arrange - Create 9 complaints (3x per officer)
        for (int i = 0; i < 9; i++) {
            complaintRepository.save(Complaint.builder()
                    .citizen(citizen)
                    .subject("Concurrent Complaint " + i)
                    .description("Description " + i)
                    .status(Complaint.ComplaintStatus.NEW)
                    .createdAt(LocalDateTime.now().minusSeconds(i))
                    .build());
        }

        // Act
        scheduledJobs.autoAssignComplaints();

        // Assert
        long officer1Assigned = complaintRepository.findByAssignedTo(officer1).size();
        long officer2Assigned = complaintRepository.findByAssignedTo(officer2).size();
        long officer3Assigned = complaintRepository.findByAssignedTo(officer3).size();

        assertEquals(3, officer1Assigned);
        assertEquals(3, officer2Assigned);
        assertEquals(3, officer3Assigned);
        assertEquals(0, complaintRepository.findByStatusAndAssignedToIsNull(Complaint.ComplaintStatus.NEW).size());
    }
}
