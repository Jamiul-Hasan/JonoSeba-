package com.jonoseba.notifications.service;

import com.jonoseba.applications.model.Application;
import com.jonoseba.complaints.model.Complaint;
import com.jonoseba.notifications.dto.NotificationMessageDto;
import com.jonoseba.notifications.model.Notification;
import com.jonoseba.notifications.publisher.NotificationPublisher;
import com.jonoseba.notifications.repository.NotificationRepository;
import com.jonoseba.users.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
class NotificationServiceV2Disabled {

    private final NotificationRepository notificationRepository;
    private final NotificationPublisher notificationPublisher;
    private final UserRepository userRepository;

    @Async
    @Transactional
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

            Notification saved = notificationRepository.save(notification);
            
            // Publish to WebSocket
            NotificationMessageDto messageDto = NotificationMessageDto.fromEntity(saved);
            notificationPublisher.publishToUser(application.getCitizen().getId(), messageDto);
            
            log.info("Notification created for user {} on application {}", application.getCitizen().getId(), application.getId());
        } catch (Exception ex) {
            log.error("Failed to create notification for application {}", application.getId(), ex);
        }
    }

    @Async
    @Transactional
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

            Notification saved = notificationRepository.save(notification);
            
            // Publish to WebSocket
            NotificationMessageDto messageDto = NotificationMessageDto.fromEntity(saved);
            notificationPublisher.publishToUser(complaint.getCitizen().getId(), messageDto);
            
            log.info("Notification created for complaint assignment {}", complaint.getId());
        } catch (Exception ex) {
            log.error("Failed to create assignment notification for complaint {}", complaint.getId(), ex);
        }
    }

    @Async
    @Transactional
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

            Notification saved = notificationRepository.save(notification);
            
            // Publish to WebSocket
            NotificationMessageDto messageDto = NotificationMessageDto.fromEntity(saved);
            notificationPublisher.publishToUser(complaint.getCitizen().getId(), messageDto);
            
            log.info("Notification created for complaint status {}", complaint.getId());
        } catch (Exception ex) {
            log.error("Failed to create status notification for complaint {}", complaint.getId(), ex);
        }
    }

    @Transactional(readOnly = true)
    public List<com.jonoseba.notifications.dto.NotificationResponse> getMyNotifications(User user) {
        return notificationRepository.findByUserId(user.getId())
                .stream()
                .sorted((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()))
                .map(com.jonoseba.notifications.dto.NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.jonoseba.notifications.dto.NotificationResponse> getMyRecentNotifications(User user, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .stream()
                .map(com.jonoseba.notifications.dto.NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Cannot mark notification as read");
        }
        
        notification.setReadFlag(true);
        notificationRepository.save(notification);
        log.info("Notification {} marked as read by user {}", notificationId, user.getId());
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndReadFlagFalse(user);
        unreadNotifications.forEach(n -> n.setReadFlag(true));
        notificationRepository.saveAll(unreadNotifications);
        log.info("All notifications marked as read for user {}", user.getId());
    }
}
