package com.jonoseba.notifications.dto;

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
public class NotificationMessageDto {
    private Long id;
    private String type;
    private String message;
    private Boolean readFlag;
    private LocalDateTime createdAt;
    private Long userId;

    public static NotificationMessageDto fromEntity(Notification notification) {
        return NotificationMessageDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .readFlag(notification.getReadFlag())
                .createdAt(notification.getCreatedAt())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .build();
    }
}
