# Dashboard API Documentation

## Overview
The Dashboard API provides role-based analytics and statistics endpoints for Citizens, Admins, and Officers.

## Endpoints

### 1. Citizen Dashboard
**GET** `/api/dashboard/citizen` (Requires CITIZEN role)

Returns statistics for the logged-in citizen including application and complaint counts, and recent notifications.

**Response:**
```json
{
  "success": true,
  "message": "Citizen dashboard data",
  "data": {
    "applicationsTotal": 5,
    "applicationsPending": 2,
    "complaintsTotal": 3,
    "complaintsOpen": 1,
    "recentNotifications": [
      {
        "id": 1,
        "type": "APPLICATION_STATUS_CHANGE",
        "message": "Your application has been approved",
        "readFlag": false,
        "createdAt": "2026-01-23T10:30:00"
      }
    ]
  }
}
```

**Fields:**
- `applicationsTotal` - Total number of applications submitted by citizen
- `applicationsPending` - Number of applications with PENDING status
- `complaintsTotal` - Total number of complaints filed by citizen
- `complaintsOpen` - Number of complaints with NEW, ASSIGNED, or IN_PROGRESS status
- `recentNotifications` - List of 5 most recent notifications (sorted by latest first)

---

### 2. Admin Dashboard
**GET** `/api/dashboard/admin` (Requires ADMIN role)

Returns system-wide statistics including application and complaint counts by status, and user counts by role.

**Response:**
```json
{
  "success": true,
  "message": "Admin dashboard data",
  "data": {
    "applicationsTotal": 42,
    "applicationsByStatus": {
      "PENDING": 15,
      "REVIEW": 8,
      "APPROVED": 12,
      "REJECTED": 7
    },
    "complaintsTotal": 28,
    "complaintsByStatus": {
      "NEW": 5,
      "ASSIGNED": 8,
      "IN_PROGRESS": 10,
      "RESOLVED": 4,
      "REJECTED": 1
    },
    "totalUsers": 50,
    "totalOfficers": 8,
    "totalCitizens": 41
  }
}
```

**Fields:**
- `applicationsTotal` - Total applications in the system
- `applicationsByStatus` - Count of applications grouped by status (PENDING, REVIEW, APPROVED, REJECTED)
- `complaintsTotal` - Total complaints in the system
- `complaintsByStatus` - Count of complaints grouped by status (NEW, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED)
- `totalUsers` - Total user count in the system
- `totalOfficers` - Total officers in the system
- `totalCitizens` - Total citizens in the system

---

### 3. Officer Dashboard
**GET** `/api/dashboard/officer` (Requires OFFICER role)

Returns statistics for the logged-in officer including assigned complaint counts and recent assigned complaints.

**Response:**
```json
{
  "success": true,
  "message": "Officer dashboard data",
  "data": {
    "complaintsAssignedByStatus": {
      "ASSIGNED": 3,
      "IN_PROGRESS": 2,
      "RESOLVED": 1
    },
    "totalAssigned": 6,
    "inProgress": 2,
    "resolved": 1,
    "rejected": 0,
    "recentAssignedComplaints": [
      {
        "id": 5,
        "category": "Road Damage",
        "description": "Large pothole on Main Street",
        "citizenName": "John Doe",
        "status": "IN_PROGRESS",
        "createdAt": "2026-01-22T14:30:00",
        "updatedAt": "2026-01-23T09:15:00"
      }
    ]
  }
}
```

**Fields:**
- `complaintsAssignedByStatus` - Count of assigned complaints grouped by status
- `totalAssigned` - Total number of complaints assigned to the officer
- `inProgress` - Number of complaints with IN_PROGRESS status
- `resolved` - Number of complaints with RESOLVED status
- `rejected` - Number of complaints with REJECTED status
- `recentAssignedComplaints` - List of 5 most recent assigned complaints (sorted by creation date, latest first)

---

## Data Models

### RecentNotificationDto
```java
{
  "id": Long,
  "type": String,           // e.g., "APPLICATION_STATUS_CHANGE", "COMPLAINT_ASSIGNED"
  "message": String,
  "readFlag": Boolean,
  "createdAt": LocalDateTime
}
```

### AssignedComplaintDto
```java
{
  "id": Long,
  "category": String,
  "description": String,
  "citizenName": String,
  "status": Complaint.ComplaintStatus,  // NEW, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime
}
```

---

## Usage Examples

### Frontend (React/TypeScript)

**Fetch Citizen Dashboard:**
```typescript
const fetchCitizenDashboard = async (token: string) => {
  const response = await fetch('/api/dashboard/citizen', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data;
};
```

**Fetch Admin Dashboard:**
```typescript
const fetchAdminDashboard = async (token: string) => {
  const response = await fetch('/api/dashboard/admin', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data;
};
```

**Fetch Officer Dashboard:**
```typescript
const fetchOfficerDashboard = async (token: string) => {
  const response = await fetch('/api/dashboard/officer', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data;
};
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access Denied - User does not have required role",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while fetching dashboard data",
  "data": null
}
```

---

## Query Performance

The dashboard service uses optimized aggregation queries:
- `countByCitizen()` - Count applications by citizen
- `countByCitizenAndStatus()` - Count applications with specific status
- `countByStatus()` - Count applications/complaints by status
- `countByAssignedTo()` - Count complaints assigned to officer
- `countByRole()` - Count users by role
- `findByAssignedToOrderByCreatedAtDesc()` - Fetch recent complaints (paginated)

All queries use repository methods to minimize database hits and leverage JPA's query generation.

---

## Caching Recommendations

For high-traffic systems, consider implementing caching:

```java
@Cacheable(value = "adminDashboard", cacheManager = "cacheManager")
public AdminDashboardResponse getAdminDashboard() {
    // ...
}

@CacheEvict(value = "adminDashboard", allEntries = true)
public void invalidateAdminDashboardCache() {
    // Called after significant updates
}
```

---

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT token
2. **Role-Based Access**: Each endpoint checks user role
3. **Data Isolation**: Citizens only see their own data, not other users' data
4. **Officer Scope**: Officers only see their assigned complaints
