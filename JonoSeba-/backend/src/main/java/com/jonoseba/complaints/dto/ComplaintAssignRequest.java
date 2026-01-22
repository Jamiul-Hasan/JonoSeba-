package com.jonoseba.complaints.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintAssignRequest {

    @NotNull(message = "Officer ID is required")
    private Long assignToOfficerId;
}
