# WebSocket Implementation Checklist

## ✅ Completed Components

### Configuration
- ✅ **WebSocketConfig** - Already exists with @EnableWebSocketMessageBroker
  - Endpoint: `/ws`
  - App Prefix: `/app`
  - Broker: `/topic`, `/queue`
  - SockJS enabled
  - CORS origins: localhost:5173, localhost:3000

### Publisher/Service
- ✅ **NotificationPublisher.java** - New service to publish WebSocket messages
  - `publishToUser(userId, message)` - Send to user's queue
  - `publishToAll(message)` - Broadcast to all
  - `publishToTopic(topicName, message)` - Send to topic
  
- ✅ **NotificationService** updated with WebSocket integration
  - `sendApplicationStatusChange()` - Creates notification + publishes WebSocket
  - `sendComplaintAssignment()` - Creates notification + publishes WebSocket
  - `sendComplaintStatusChange()` - Creates notification + publishes WebSocket
  - `getMyNotifications()` - Fetch all user notifications
  - `getMyRecentNotifications(limit)` - Fetch last N notifications
  - `markAsRead(notificationId)` - Mark notification as read
  - `markAllAsRead()` - Mark all as read

### Controllers
- ✅ **NotificationController** - REST API endpoints
  - `GET /api/notifications/me` - Fetch all notifications
  - `GET /api/notifications/me/recent?limit=5` - Fetch recent
  - `PATCH /api/notifications/{id}/read` - Mark as read
  - `PATCH /api/notifications/read-all` - Mark all as read

- ✅ **NotificationWebSocketController** - STOMP message handlers
  - `/app/notifications/ping` - Echo endpoint for testing
  - `@SubscribeMapping` for handling subscriptions

### DTOs
- ✅ **NotificationMessageDto** - For WebSocket transmission
  - id, type, message, readFlag, createdAt, userId

- ✅ **NotificationResponse** - For REST API
  - id, type, message, readFlag, createdAt

### Repositories
- ✅ **NotificationRepositoryCustom** - Additional query methods
  - `findByUserIdOrderByCreatedAtDesc(userId, pageable)`

---

## 🚀 How It Works

### Workflow
1. **Event Triggered** - Application/Complaint status changes
2. **Notification Created** - NotificationService creates Notification entity
3. **Stored in DB** - Notification persisted for history
4. **WebSocket Publish** - NotificationPublisher sends via SimpMessagingTemplate
5. **Client Receives** - WebSocket message delivered to user's `/user/queue/notifications/{userId}`
6. **Real-time Update** - Browser updates UI instantly

### WebSocket Destinations
- **User Queue:** `/user/queue/notifications/{userId}` (private)
- **Broadcast:** `/topic/notifications/all` (public)
- **Topic:** `/topic/notifications/{topicName}` (custom)

---

## 📱 Frontend Integration

### Connection
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
stompClient.connect({}, frame => {
  stompClient.subscribe('/user/queue/notifications/{userId}', 
    message => handleNotification(JSON.parse(message.body))
  );
});
```

### Fetch Stored Notifications
```javascript
// Get all notifications
const response = await fetch('/api/notifications/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const notifications = await response.json();

// Get last 5
const response = await fetch('/api/notifications/me/recent?limit=5', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Mark as Read
```javascript
// Mark specific notification
await fetch('/api/notifications/1/read', {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Mark all as read
await fetch('/api/notifications/read-all', {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 📂 File Structure
```
backend/src/main/java/com/jonoseba/
├── config/
│   └── WebSocketConfig.java ✅ (already exists)
├── notifications/
│   ├── controller/
│   │   ├── NotificationController.java ✅
│   │   └── NotificationWebSocketController.java ✅
│   ├── publisher/
│   │   └── NotificationPublisher.java ✅
│   ├── service/
│   │   ├── NotificationService.java (existing - needs replacement)
│   │   └── NotificationServiceV2.java ✅ (new version with WebSocket)
│   ├── dto/
│   │   ├── NotificationMessageDto.java ✅
│   │   └── NotificationResponse.java ✅
│   ├── model/
│   │   └── Notification.java (existing)
│   └── repository/
│       ├── NotificationRepository.java (existing)
│       └── NotificationRepositoryCustom.java ✅
```

---

## ⚙️ Configuration

### application.yml
```yaml
websocket:
  endpoint: /ws
  allowed-origins: http://localhost:5173,http://localhost:3000

spring:
  task:
    execution:
      pool:
        core-size: 2
        max-size: 5
        queue-capacity: 100
```

### Async Configuration Recommended
```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

---

## 📋 Next Steps

### Manual Update Required
Replace the existing `NotificationService.java` with `NotificationServiceV2.java`:
1. Delete old `NotificationService.java`
2. Rename `NotificationServiceV2.java` → `NotificationService.java`
OR
3. Update bean definition if keeping both

### Testing
```bash
# Test WebSocket connection
wscat -c ws://localhost:8080/ws

# Test REST API
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/notifications/me

# Test mark as read
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/notifications/1/read
```

---

## 🔐 Security Features

✅ Authentication required on all endpoints
✅ User isolation - only receive own notifications
✅ Authorization check when marking notifications
✅ WebSocket secured with JWT token
✅ CORS properly configured

---

## 📊 Database

### Auto-created indexes recommended
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_flag ON notifications(read_flag);
```

---

## 📚 Documentation
See `WEBSOCKET_NOTIFICATIONS.md` for complete documentation including:
- Architecture overview
- WebSocket event flow
- Frontend integration examples
- Performance considerations
- Troubleshooting guide
- Testing instructions
