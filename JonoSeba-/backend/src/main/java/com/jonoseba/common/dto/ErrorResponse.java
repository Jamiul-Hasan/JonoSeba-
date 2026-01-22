package com.jonoseba.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Standard error response format for all API errors
 * Includes timestamp, path, message, and optional details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;

    /**
     * The API path that caused the error
     */
    private String path;

    /**
     * Human-readable error message
     */
    private String message;

    /**
     * Additional error details (e.g., field-level validation errors)
     */
    private Object details;

    /**
     * HTTP status code
     */
    private int status;

    /**
     * Create an ErrorResponse with all required fields
     */
    public static ErrorResponse of(String message, String path, int status) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .message(message)
                .path(path)
                .status(status)
                .build();
    }

    /**
     * Create an ErrorResponse with details
     */
    public static ErrorResponse of(String message, String path, int status, Object details) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .message(message)
                .path(path)
                .status(status)
                .details(details)
                .build();
    }
}
