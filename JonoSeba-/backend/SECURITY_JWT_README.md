# Spring Security JWT Authentication Implementation

## Overview
Complete Spring Security implementation for Spring Boot 3 with JWT-based authentication.

## Architecture

### Components

#### 1. **JwtService** 
- Location: `com.jonoseba.security.JwtService`
- Algorithm: HS256
- Features:
  - Token generation with configurable expiration
  - Token validation
  - Username extraction from token
  - Claims management

#### 2. **CustomUserDetailsService**
- Location: `com.jonoseba.security.CustomUserDetailsService`
- Backed by: `UserRepository`
- Loads users by email
- Converts user roles to Spring Security authorities (ROLE_CITIZEN, ROLE_ADMIN, ROLE_OFFICER)

#### 3. **JwtAuthenticationFilter**
- Location: `com.jonoseba.security.JwtAuthenticationFilter`
- Extends: `OncePerRequestFilter`
- Process:
  1. Extracts JWT from `Authorization: Bearer <token>` header
  2. Validates token
  3. Loads UserDetails
  4. Sets SecurityContext with authentication and authorities

#### 4. **SecurityConfig**
- Location: `com.jonoseba.config.SecurityConfig`
- Configuration:
  - **CSRF**: Disabled (stateless)
  - **CORS**: Enabled with configurable origins
  - **Session Management**: Stateless (SessionCreationPolicy.STATELESS)
  - **Password Encoding**: BCryptPasswordEncoder

##### Endpoint Security Rules:
- **Public** (No authentication):
  - `/api/auth/**` - Authentication endpoints
  - `/actuator/health` - Health check
  - `/ws/**` - WebSocket connections
  - `GET /api/services` - Public services listing

- **ADMIN only**:
  - `/api/admin/**`
  - `/api/users/**`

- **OFFICER or ADMIN**:
  - `/api/officer/**`

- **CITIZEN, OFFICER, or ADMIN** (All authenticated users):
  - `/api/citizen/**`
  - `/api/applications/**`
  - `/api/complaints/**`

- **All other endpoints**: Require authentication

#### 5. **AuthService**
- Location: `com.jonoseba.auth.service.AuthService`
- Methods:
  - `register(RegisterRequest)`: Create new CITIZEN user with encoded password
  - `login(LoginRequest)`: Authenticate and return JWT token

#### 6. **AuthController**
- Location: `com.jonoseba.auth.controller.AuthController`
- Endpoints:
  - `POST /api/auth/register` - Register new user
  - `POST /api/auth/login` - Login and get JWT token
  - `POST /api/auth/logout` - Logout (client-side token removal)

#### 7. **DTOs**
- **RegisterRequest**: `fullName`, `email`, `password`, `phone`
- **LoginRequest**: `email`, `password`
- **AuthResponse**: `token`, `role`, `userId`, `name`

#### 8. **GlobalExceptionHandler**
- Location: `com.jonoseba.common.exception.GlobalExceptionHandler`
- Handles:
  - Validation errors (`@Valid` annotations)
  - Bad credentials
  - User not found
  - Authentication failures
  - Access denied (403)
  - General exceptions

## Configuration

### application.yml
```yaml
jwt:
  secret: ${JWT_SECRET:your-base64-encoded-secret-key}
  expiration-minutes: ${JWT_EXP_MINUTES:60}
  issuer: ${JWT_ISSUER:jonoseba}
```

⚠️ **Important**: Use a strong Base64-encoded secret key in production!

## User Roles

- **CITIZEN**: Default role for new registrations
- **OFFICER**: Handles applications and complaints
- **ADMIN**: Full system access

## API Usage Examples

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "phone": "1234567890"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "role": "CITIZEN",
    "userId": 1,
    "name": "John Doe"
  }
}
```

### Authenticated Request
```bash
GET /api/applications
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## Security Features

✅ **Stateless Authentication**: No server-side session storage
✅ **CSRF Protection**: Disabled (not needed for JWT)
✅ **CORS**: Enabled with configurable origins
✅ **Password Hashing**: BCrypt with salt
✅ **Role-Based Access Control**: Using Spring Security's `hasRole()`
✅ **Token Expiration**: Configurable token lifetime
✅ **Input Validation**: Jakarta Validation API
✅ **Exception Handling**: Centralized with proper HTTP status codes

## Testing Role-Based Access

```bash
# Admin endpoint (requires ADMIN role)
GET /api/admin/dashboard
Authorization: Bearer <admin-token>

# Officer endpoint (requires OFFICER or ADMIN role)
GET /api/officer/applications
Authorization: Bearer <officer-token>

# Citizen endpoint (requires any authenticated user)
GET /api/citizen/profile
Authorization: Bearer <citizen-token>
```

## Error Responses

```json
// Validation Error (400)
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email must be valid",
    "password": "Password is required"
  }
}

// Authentication Error (401)
{
  "success": false,
  "message": "Invalid email or password"
}

// Access Denied (403)
{
  "success": false,
  "message": "Access denied"
}
```

## Dependencies

All required dependencies are already in `pom.xml`:
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.11.5)

## Notes

- JWT tokens are self-contained and contain user information
- Logout is handled client-side by removing the token
- Token refresh is not implemented (tokens expire after configured time)
- For production, use environment variables for JWT secret
- CORS origins should be configured for production domains
