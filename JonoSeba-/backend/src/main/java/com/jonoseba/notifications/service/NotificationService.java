package com.jonoseba.notifications.service;

import com.jonoseba.applications.model.Application;
import com.jonoseba.notifications.model.Notification;
import com.jonoseba.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Async
    public void sendApplicationStatusChange(Application application) {
        try {
            String message = String.format(
                    "Your application '%s' status changed to %s. Remarks: %s",
                    application.getTitle(),
                    application.getStatus().name(),
                    application.getRemarks() == null ? "N/A" : application.getRemarks()
            );

            Notification notification = Notification.builder()
                    .user(application.getCitizen())
                    .type("APPLICATION_STATUS")
                    .message(message)
                    .build();

            notificationRepository.save(notification);
            log.info("Notification created for user {} on application {}", application.getCitizen().getId(), application.getId());
        } catch (Exception ex) {
            log.error("Failed to create notification for application {}", application.getId(), ex);
        }
    }
}
