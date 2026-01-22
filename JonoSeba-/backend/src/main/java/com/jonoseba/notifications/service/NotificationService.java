package com.jonoseba.notifications.service;

import com.jonoseba.applications.model.Application;
import com.jonoseba.complaints.model.Complaint;
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

    @Async
    public void sendComplaintAssignment(Complaint complaint) {
        try {
            String message = String.format(
                    "Your complaint '%s' has been assigned to an officer.",
                    complaint.getCategory()
            );

            Notification notification = Notification.builder()
                    .user(complaint.getCitizen())
                    .type("COMPLAINT_ASSIGNMENT")
                    .message(message)
                    .build();

            notificationRepository.save(notification);
            log.info("Notification created for complaint assignment {}", complaint.getId());
        } catch (Exception ex) {
            log.error("Failed to create assignment notification for complaint {}", complaint.getId(), ex);
        }
    }

    @Async
    public void sendComplaintStatusChange(Complaint complaint) {
        try {
            String message = String.format(
                    "Your complaint status changed to %s. Note: %s",
                    complaint.getStatus().name(),
                    complaint.getProgressNote() == null ? "N/A" : complaint.getProgressNote()
            );

            Notification notification = Notification.builder()
                    .user(complaint.getCitizen())
                    .type("COMPLAINT_STATUS")
                    .message(message)
                    .build();

            notificationRepository.save(notification);
            log.info("Notification created for complaint status {}", complaint.getId());
        } catch (Exception ex) {
            log.error("Failed to create status notification for complaint {}", complaint.getId(), ex);
        }
    }
}
