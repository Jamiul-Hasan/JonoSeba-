package com.jonoseba.dashboard.dto;

import com.jonoseba.notifications.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentNotificationDto {
    private Long id;
    private String type;
    private String message;
    private Boolean readFlag;
    private LocalDateTime createdAt;

    public static RecentNotificationDto fromEntity(Notification notification) {
        return RecentNotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .readFlag(notification.getReadFlag())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
