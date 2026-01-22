# CORS, Error Handling, and API Documentation Configuration

## Overview
This document details the CORS configuration, error response format, and API documentation setup for the JonoSeba backend.

---

## CORS Configuration

### Allowed Origins
- `http://localhost:5173` - React dev server (primary)
- `http://localhost:3000` - Alternative frontend port
- `http://localhost:8080` - Local backend testing

### Configuration Details
Located in: [config/SecurityConfig.java](config/SecurityConfig.java)

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080"
));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
configuration.setAllowedHeaders(Arrays.asList("*"));
configuration.setExposedHeaders(Arrays.asList("Authorization"));
configuration.setAllowCredentials(true);
configuration.setMaxAge(3600L);
```

### Features
- **All HTTP Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **All Headers**: Accepts any request header
- **Credentials**: Allowed (for cookies/auth headers)
- **Cache**: CORS preflight requests cached for 1 hour

---

## Error Response Format

### Standard Error Response
All API errors follow this JSON format:

```json
{
  "timestamp": "2025-01-23T14:30:45.123456",
  "path": "/api/users/123",
  "message": "Resource not found",
  "status": 404,
  "details": null
}
```

### Error Response Fields
- **timestamp** (LocalDateTime): When the error occurred
- **path** (String): The API endpoint that caused the error
- **message** (String): Human-readable error message
- **status** (int): HTTP status code
- **details** (Object, nullable): Additional error details (e.g., field validation errors)

### Validation Error Example
```json
{
  "timestamp": "2025-01-23T14:30:45.123456",
  "path": "/api/auth/register",
  "message": "Validation failed",
  "status": 400,
  "details": {
    "email": "Email must be a valid email address",
    "password": "Password must be at least 8 characters"
  }
}
```

### Error Response DTO
Located in: [common/dto/ErrorResponse.java](common/dto/ErrorResponse.java)

```java
@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private String path;
    private String message;
    private Object details;
    private int status;
}
```

### Global Exception Handler
Located in: [common/exception/GlobalExceptionHandler.java](common/exception/GlobalExceptionHandler.java)

Handles:
- **MethodArgumentNotValidException** (400) - Validation errors with field details
- **BadCredentialsException** (401) - Invalid email/password
- **UsernameNotFoundException** (401) - User not found
- **AuthenticationException** (401) - General auth failures
- **AccessDeniedException** (403) - Insufficient permissions
- **IllegalArgumentException** (400) - Business logic violations
- **ResourceNotFoundException** (404) - Entity not found
- **ValidationException** (400) - Custom validation errors
- **NoHandlerFoundException** (404) - Endpoint not found
- **Exception** (500) - Unexpected errors

---

## API Routing

All controllers follow the `/api/**` convention:

| Controller | Base Path | Purpose |
|-----------|-----------|---------|
| AuthController | `/api/auth` | Login, Register, Token refresh |
| ApplicationController | `/api/applications` | Citizen applications |
| ComplaintController | `/api/complaints` | Citizen complaints |
| FileController | `/api/files` | File upload/download |
| ServiceController | `/api/services` | Public services directory |
| NotificationController | `/api/notifications` | User notifications |
| DashboardController | `/api/dashboard` | Role-based dashboards |

---

## Swagger/OpenAPI Documentation

### Dependency
```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.3.0</version>
</dependency>
```

### Configuration
Located in: [config/SwaggerConfig.java](config/SwaggerConfig.java)

### Access Documentation
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

### API Information
- **Title**: JonoSeba API
- **Version**: 1.0.0
- **Description**: API for JonoSeba application - Citizen Services Platform
- **Base URL**: `http://localhost:8080` (dev) or `https://api.jonoseba.com` (prod)

### Security Scheme
JWT Bearer token authentication configured:
```
Authorization: Bearer <jwt_token>
```

---

## Testing CORS from React Frontend

### Example fetch request from React (localhost:5173):
```typescript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### Success Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response:
```json
{
  "timestamp": "2025-01-23T14:30:45.123456",
  "path": "/api/auth/login",
  "message": "Invalid email or password",
  "status": 401
}
```

---

## Adding Swagger Documentation to Controllers

To document your endpoints in Swagger, use annotations:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by user ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        // Implementation
    }
}
```

---

## Environment-Specific Configuration

### Development (local)
- Frontend origins: `http://localhost:5173`, `http://localhost:3000`
- Backend: `http://localhost:8080`
- Documentation: `http://localhost:8080/swagger-ui.html`

### Production
- Configure allowed origins in `application-prod.yml`:
```yaml
cors:
  allowed-origins:
    - https://jonoseba.com
    - https://www.jonoseba.com
```

---

## Summary of Changes

✅ **CORS Configuration**: Already present in SecurityConfig.java, covers localhost:5173 and localhost:3000
✅ **Error Response Format**: New ErrorResponse DTO with timestamp, path, message, details, status
✅ **Global Exception Handler**: Updated to return ErrorResponse for all exception types
✅ **API Routing**: All controllers under /api/** convention verified
✅ **Swagger/OpenAPI**: Added springdoc-openapi-starter-webmvc-ui dependency and SwaggerConfig.java
✅ **Documentation**: Available at http://localhost:8080/swagger-ui.html
