package com.jonoseba.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private Long applicationsTotal;
    private Map<String, Long> applicationsByStatus;
    private Long complaintsTotal;
    private Map<String, Long> complaintsByStatus;
    private Long totalUsers;
    private Long totalOfficers;
    private Long totalCitizens;
}
