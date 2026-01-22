package com.jonoseba.complaints.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "citizen_id", nullable = false)
    private Long citizenId;

    @Column(name = "assigned_worker_id")
    private Long assignedWorkerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintType complaintType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = ComplaintStatus.REPORTED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ComplaintType {
        ROAD_DAMAGE, WATER_SUPPLY, GARBAGE, STREET_LIGHT, DRAINAGE, OTHER
    }

    public enum ComplaintStatus {
        REPORTED, ASSIGNED, IN_PROGRESS, RESOLVED
    }
}
