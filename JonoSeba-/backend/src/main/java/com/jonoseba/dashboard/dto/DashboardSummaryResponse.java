package com.jonoseba.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {
    
    // User Info
    private UserProfileResponse userInfo;
    
    // Applications Summary
    private Long totalApplications;
    private ApplicationStatusCount applicationsByStatus;
    
    // Complaints Summary
    private Long totalComplaints;
    private ComplaintStatusCount complaintsByStatus;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationStatusCount {
        private Long pending;
        private Long inReview;
        private Long inProgress;
        private Long approved;
        private Long rejected;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintStatusCount {
        private Long newCount;
        private Long assigned;
        private Long inProgress;
        private Long resolved;
        private Long rejected;
    }
}
