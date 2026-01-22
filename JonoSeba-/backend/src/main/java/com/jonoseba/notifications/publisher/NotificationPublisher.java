package com.jonoseba.notifications.publisher;

import com.jonoseba.notifications.dto.NotificationMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Publish notification to a specific user's queue
     */
    public void publishToUser(Long userId, NotificationMessageDto notification) {
        try {
            String destination = "/queue/notifications/" + userId;
            messagingTemplate.convertAndSend(destination, notification);
            log.debug("Notification published to user {} at destination {}", userId, destination);
        } catch (Exception e) {
            log.error("Failed to publish notification to user {}", userId, e);
        }
    }

    /**
     * Publish notification to all subscribed users (broadcast)
     */
    public void publishToAll(NotificationMessageDto notification) {
        try {
            String destination = "/topic/notifications/all";
            messagingTemplate.convertAndSend(destination, notification);
            log.debug("Notification broadcasted to all users at destination {}", destination);
        } catch (Exception e) {
            log.error("Failed to broadcast notification", e);
        }
    }

    /**
     * Publish notification to a topic (e.g., /topic/notifications/alerts)
     */
    public void publishToTopic(String topicName, NotificationMessageDto notification) {
        try {
            String destination = "/topic/notifications/" + topicName;
            messagingTemplate.convertAndSend(destination, notification);
            log.debug("Notification published to topic {} at destination {}", topicName, destination);
        } catch (Exception e) {
            log.error("Failed to publish notification to topic {}", topicName, e);
        }
    }
}
