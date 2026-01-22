package com.jonoseba.applications.dto;

import com.jonoseba.applications.model.Application;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private Application.ApplicationStatus status;

    private String remarks;
}
