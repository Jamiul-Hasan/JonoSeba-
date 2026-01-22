package com.jonoseba.dashboard.dto;

import com.jonoseba.complaints.model.Complaint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedComplaintDto {
    private Long id;
    private String category;
    private String description;
    private String citizenName;
    private Complaint.ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AssignedComplaintDto fromEntity(Complaint complaint) {
        return AssignedComplaintDto.builder()
                .id(complaint.getId())
                .category(complaint.getCategory())
                .description(complaint.getDescription())
                .citizenName(complaint.getCitizen() != null ? complaint.getCitizen().getFullName() : "Unknown")
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
