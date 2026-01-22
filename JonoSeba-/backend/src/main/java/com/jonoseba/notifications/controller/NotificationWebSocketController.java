package com.jonoseba.notifications.controller;

import com.jonoseba.notifications.dto.NotificationMessageDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class NotificationWebSocketController {

    /**
     * Handle subscription to user's notification queue
     * Client subscribes to: /user/queue/notifications/{userId}
     */
    @SubscribeMapping("/queue/notifications/{userId}")
    public void onSubscribe(String userId) {
        log.info("User {} subscribed to notifications", userId);
    }

    /**
     * Echo endpoint for testing WebSocket connection
     * Client sends to: /app/notifications/ping
     * Receives from: /user/queue/notifications/ping
     */
    @MessageMapping("/notifications/ping")
    @SendTo("/queue/notifications/ping")
    public NotificationMessageDto ping(NotificationMessageDto message) {
        log.debug("WebSocket ping received from client");
        message.setMessage("Pong from server");
        return message;
    }
}
