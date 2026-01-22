package com.jonoseba.reports.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "applications_total", nullable = false)
    private Long applicationsTotal;

    @Column(name = "complaints_total", nullable = false)
    private Long complaintsTotal;

    @Column(name = "applications_by_status", columnDefinition = "TEXT")
    private String applicationsByStatus;

    @Column(name = "complaints_by_status", columnDefinition = "TEXT")
    private String complaintsByStatus;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (reportDate == null) {
            reportDate = LocalDate.now();
        }
    }
}
