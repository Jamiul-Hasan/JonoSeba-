package com.jonoseba.applications.dto;

import com.jonoseba.applications.model.Application;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private Long citizenId;
    private String citizenName;
    private String title;
    private String description;
    private Application.ApplicationStatus status;
    private String remarks;
    private String documentUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
