package com.jonoseba.dashboard.dto;

import com.jonoseba.complaints.model.Complaint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficerDashboardResponse {
    private Map<String, Long> complaintsAssignedByStatus;
    private Long totalAssigned;
    private Long inProgress;
    private Long resolved;
    private Long rejected;
    private java.util.List<AssignedComplaintDto> recentAssignedComplaints;
}
