package com.jonoseba.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitizenDashboardResponse {
    private Long applicationsTotal;
    private Long applicationsPending;
    private Long complaintsTotal;
    private Long complaintsOpen;
    private List<RecentNotificationDto> recentNotifications;
}
