package com.jonoseba.complaints.dto;

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
public class ComplaintResponse {
    private Long id;
    private String category;
    private String description;
    private String photoUrl;
    private String locationText;
    private Complaint.ComplaintStatus status;
    private Long citizenId;
    private String citizenName;
    private Long assignedToId;
    private String assignedToName;
    private String progressNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
