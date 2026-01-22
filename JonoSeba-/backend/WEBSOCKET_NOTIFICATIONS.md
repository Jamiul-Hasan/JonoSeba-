# WebSocket + STOMP Real-Time Notifications Documentation

## Overview
The application uses Spring WebSocket with STOMP protocol to deliver real-time notifications to users. Notifications are persisted in the database and also broadcast via WebSocket for instant delivery.

## Architecture

### Configuration
- **Endpoint:** `/ws` (WebSocket STOMP endpoint)
- **Protocol:** STOMP with SockJS fallback
- **App Prefix:** `/app` (for client-to-server messages)
- **Broker Prefixes:** `/topic` and `/queue` (for server-to-client messages)
- **Allowed Origins:** `http://localhost:5173`, `http://localhost:3000` (configurable)

### Components
1. **WebSocketConfig** - Spring WebSocket configuration with message broker
2. **NotificationPublisher** - Sends WebSocket messages via SimpMessagingTemplate
3. **NotificationService** - Creates notifications and publishes WebSocket events
4. **NotificationController** - REST endpoints for fetching and managing notifications
5. **NotificationWebSocketController** - STOMP message handlers

---

## WebSocket Communication

### Connection
```javascript
// Client-side connection (using stomp.js)
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, frame => {
  console.log('Connected to WebSocket');
  
  // Subscribe to user's notification queue
  stompClient.subscribe('/user/queue/notifications/{userId}', message => {
    console.log('Notification received:', JSON.parse(message.body));
  });
});
```

### Destinations

#### User Queue (Private Messages)
```
/user/queue/notifications/{userId}
```
- **Direction:** Server → Client
- **Access:** Only the specific user receives messages
- **Use Case:** Personal notifications (application status, complaint updates)

**Example Message:**
```json
{
  "id": 1,
  "type": "APPLICATION_STATUS",
  "message": "Your application 'Birth Certificate' status changed to APPROVED",
  "readFlag": false,
  "createdAt": "2026-01-23T10:30:00",
  "userId": 5
}
```

#### Topic (Broadcast)
```
/topic/notifications/all
/topic/notifications/{topicName}
```
- **Direction:** Server → All Subscribers
- **Use Case:** System-wide announcements

---

## REST API Endpoints

### 1. Get All Notifications
**GET** `/api/notifications/me`

Fetch all stored notifications for the authenticated user, sorted by latest first.

**Response:**
```json
{
  "success": true,
  "message": "Notifications fetched",
  "data": [
    {
      "id": 1,
      "type": "APPLICATION_STATUS",
      "message": "Your application status changed to APPROVED",
      "readFlag": false,
      "createdAt": "2026-01-23T10:30:00"
    },
    {
      "id": 2,
      "type": "COMPLAINT_ASSIGNMENT",
      "message": "Your complaint has been assigned to an officer",
      "readFlag": true,
      "createdAt": "2026-01-22T15:20:00"
    }
  ]
}
```

### 2. Get Recent Notifications
**GET** `/api/notifications/me/recent?limit=5`

Fetch recent notifications with optional limit parameter (default: 5).

**Query Parameters:**
- `limit` (optional, default: 5) - Number of notifications to retrieve

**Response:**
```json
{
  "success": true,
  "message": "Recent notifications fetched",
  "data": [
    {
      "id": 1,
      "type": "APPLICATION_STATUS",
      "message": "Your application status changed to APPROVED",
      "readFlag": false,
      "createdAt": "2026-01-23T10:30:00"
    }
  ]
}
```

### 3. Mark Notification as Read
**PATCH** `/api/notifications/{id}/read`

Mark a specific notification as read.

**Path Parameters:**
- `id` (required) - Notification ID

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": null
}
```

### 4. Mark All Notifications as Read
**PATCH** `/api/notifications/read-all`

Mark all unread notifications as read for the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": null
}
```

---

## WebSocket Event Flow

### Application Status Change
```
1. Admin updates application status in database
2. ApplicationService.updateStatus() is called
3. notificationService.sendApplicationStatusChange() is triggered
4. Notification entity is created and saved
5. NotificationPublisher.publishToUser() sends WebSocket message
6. Client receives message on /user/queue/notifications/{userId}
7. UI updates in real-time
```

### Complaint Assignment
```
1. Admin assigns complaint to officer
2. ComplaintService.assignComplaint() is called
3. notificationService.sendComplaintAssignment() is triggered
4. Notification entity is created and saved
5. NotificationPublisher.publishToUser() sends WebSocket message
6. Client receives message on /user/queue/notifications/{userId}
7. UI updates in real-time
```

---

## Frontend Integration

### React Example with stomp.js

**Installation:**
```bash
npm install stompjs sockjs-client
```

**Hook Implementation:**
```typescript
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const useNotifications = (userId: number) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      { Authorization: `Bearer ${localStorage.getItem('token')}` },
      frame => {
        console.log('WebSocket connected:', frame);
        setIsConnected(true);

        // Subscribe to user's notification queue
        stompClient.subscribe(
          `/user/queue/notifications/${userId}`,
          message => {
            const notification = JSON.parse(message.body);
            console.log('New notification:', notification);
            setNotifications(prev => [notification, ...prev]);
            
            // Show toast notification
            showToast(notification.message, notification.type);
          }
        );
      },
      error => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      }
    );

    stompClientRef.current = stompClient;

    return () => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket disconnected');
        });
      }
    };
  }, [userId]);

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, readFlag: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return { notifications, isConnected, markAsRead };
};
```

**Usage in Component:**
```typescript
function NotificationCenter() {
  const { notifications, isConnected, markAsRead } = useNotifications(userId);

  return (
    <div>
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      <ul className="notifications-list">
        {notifications.map(notif => (
          <li key={notif.id} className={notif.readFlag ? 'read' : 'unread'}>
            <span>{notif.message}</span>
            {!notif.readFlag && (
              <button onClick={() => markAsRead(notif.id)}>Mark as read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Notification Types

| Type | Trigger | Message Format |
|------|---------|-----------------|
| `APPLICATION_STATUS` | Application status updated | "Your application '{title}' status changed to {status}" |
| `COMPLAINT_ASSIGNMENT` | Complaint assigned to officer | "Your complaint '{category}' has been assigned to an officer" |
| `COMPLAINT_STATUS` | Complaint status updated | "Your complaint status changed to {status}" |

---

## Data Models

### NotificationMessageDto (WebSocket)
```json
{
  "id": Long,
  "type": String,
  "message": String,
  "readFlag": Boolean,
  "createdAt": LocalDateTime,
  "userId": Long
}
```

### NotificationResponse (REST API)
```json
{
  "id": Long,
  "type": String,
  "message": String,
  "readFlag": Boolean,
  "createdAt": LocalDateTime
}
```

---

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  read_flag BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_flag ON notifications(read_flag);
```

---

## Async Processing

Notification creation and publishing use Spring's `@Async` annotation for non-blocking operations:

```java
@Async
@Transactional
public void sendApplicationStatusChange(Application application) {
    // Create notification
    Notification saved = notificationRepository.save(notification);
    
    // Publish via WebSocket (non-blocking)
    notificationPublisher.publishToUser(
        application.getCitizen().getId(),
        NotificationMessageDto.fromEntity(saved)
    );
}
```

**Configuration Required:**
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

## Error Handling

### Connection Errors
- Automatic reconnection with exponential backoff
- Fallback to SockJS long-polling if WebSocket unavailable
- Graceful degradation to REST API polling

### Message Delivery Guarantees
- At-least-once delivery (messages stored in database)
- User can retrieve missed notifications via REST API
- WebSocket delivery best-effort (for real-time UX)

---

## Performance Considerations

1. **Database Indexing**
   - Index on `user_id` for fast notification retrieval
   - Index on `read_flag` for unread notification filtering

2. **Message Broker**
   - SimpleBroker suitable for single-server deployments
   - For clustering, consider RabbitMQ or ActiveMQ

3. **Connection Limits**
   - StreamBytesLimit: 512KB
   - HttpMessageCacheSize: 1000
   - DisconnectDelay: 30 seconds

---

## Security

1. **Authentication Required** - All endpoints require valid JWT token
2. **User Isolation** - Users only receive their own notifications
3. **WebSocket Authorization** - Token passed in connection handshake
4. **CSRF Protection** - SockJS handles CSRF tokens automatically

---

## Troubleshooting

### WebSocket Connection Fails
```javascript
// Check CORS configuration
// Verify allowed origins in WebSocketConfig
// Check browser console for specific errors
```

### Notifications Not Received
```java
// 1. Verify NotificationService is autowired
// 2. Check @Async is enabled in configuration
// 3. Verify user is subscribed to correct queue
// 4. Check database for stored notification
```

### Lost Connection During Notification
- SockJS automatically reconnects
- Missed notifications stored in database
- Fetch via `GET /api/notifications/me/recent` on reconnect

---

## Testing WebSocket

### Using WebSocket Client
```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8080/ws

# Send STOMP frame
{"command":"CONNECT","headers":{"login":"user","passcode":"pass"}}

# Subscribe to queue
{"command":"SUBSCRIBE","headers":{"id":"sub-1","destination":"/user/queue/notifications/1"}}
```

### CURL Test (REST API)
```bash
# Get notifications
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/notifications/me

# Mark as read
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:8080/api/notifications/1/read
```
