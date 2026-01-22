package com.jonoseba.complaints.dto;

import com.jonoseba.complaints.model.Complaint;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private Complaint.ComplaintStatus status;

    private String progressNote;
}
