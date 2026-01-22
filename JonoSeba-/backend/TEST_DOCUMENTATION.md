# Spring Boot Tests Documentation

Comprehensive test suite for JonoSeba application with H2 in-memory database for fast integration testing.

## Test Setup

### Dependencies Added
- **H2 Database**: In-memory database for testing (`com.h2database:h2`)
- **Spring Security Test**: Testing authentication and authorization (`org.springframework.security:spring-security-test`)
- **Spring Boot Test**: Test utilities and MockMvc (`org.springframework.boot:spring-boot-starter-test`)

### Configuration
- **Test Profile**: `application-test.yml` with H2 configuration
- **JPA DDL**: `ddl-auto: create-drop` - tables created/dropped per test
- **Database URL**: `jdbc:h2:mem:testdb;MODE=MySQL` - MySQL compatibility mode

## Test Classes

### 1. AuthControllerTest
**Location**: `backend/src/test/java/com/jonoseba/auth/controller/AuthControllerTest.java`

**Technology**: MockMvc, @SpringBootTest, @AutoConfigureMockMvc

**Test Cases**:

#### Register Endpoint (/api/auth/register)
- ✅ `testRegisterSuccess` - Successful registration returns 201 with JWT token
- ✅ `testRegisterInvalidEmail` - Invalid email format rejected (400)
- ✅ `testRegisterWeakPassword` - Password < 6 chars rejected (400)
- ✅ `testRegisterMissingFields` - Missing required fields return validation errors
- ✅ **Password Security**: Verifies password never returned in response

#### Login Endpoint (/api/auth/login)
- ✅ `testLoginSuccess` - Successful login returns 200 with JWT token
- ✅ `testLoginInvalidEmail` - Invalid email format rejected (400)
- ✅ `testLoginMissingPassword` - Missing password validation error
- ✅ **Password Security**: Verifies password never returned in response

#### Logout Endpoint (/api/auth/logout)
- ✅ `testLogoutSuccess` - Logout returns 200 with success message

**Authentication Details**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "name": "John Doe",
    "role": "CITIZEN"
  }
}
```

**Assertion**: Password fields are never present in any response

---

### 2. ApplicationServiceTest
**Location**: `backend/src/test/java/com/jonoseba/applications/service/ApplicationServiceTest.java`

**Technology**: @SpringBootTest, @Transactional, H2 database, Authentication mock

**Test Cases**:

#### Authorization - Status Update
- ✅ `testAdminCanUpdateStatus` - Admin user can update application status
- ✅ `testOfficerCanUpdateStatus` - Officer user can update application status
- ✅ `testCitizenCannotUpdateStatus` - Citizen role throws AccessDeniedException
- ✅ `testUpdateWithNullAuthentication` - Null auth throws AccessDeniedException

#### Error Handling
- ✅ `testUpdateNonExistentApplication` - Non-existent ID throws ResourceNotFoundException
- ✅ `testUpdateStatusWithNullRemarks` - Null remarks are allowed

#### State Transitions
- ✅ `testMultipleStatusTransitions` - PENDING → IN_PROGRESS → APPROVED

**Test Setup**:
```
User Setup:
  - Admin: ROLE_ADMIN
  - Officer: ROLE_OFFICER
  - Citizen: ROLE_CITIZEN (cannot update status)

Application Setup:
  - Status: PENDING
  - Citizen: assigned test citizen
```

**Authorization Check**:
```java
private boolean isAdminOrOfficer(Authentication authentication) {
    // Only ROLE_ADMIN and ROLE_OFFICER can update status
}
```

**Notification Verification**: 
- NotificationService.sendApplicationStatusChange() called once per update
- Never called for unauthorized operations

---

### 3. ScheduledJobsTest
**Location**: `backend/src/test/java/com/jonoseba/scheduling/ScheduledJobsTest.java`

**Technology**: @SpringBootTest, @Transactional, H2 database, integration test

**Purpose**: Test auto-assignment of complaints to officers with load balancing

**Test Cases**:

#### Basic Assignment
- ✅ `testAutoAssignSingleComplaint` - Single complaint assigned to available officer
- ✅ `testNoComplaintsToAssign` - No-op when no unassigned complaints
- ✅ `testNoOfficersAvailable` - Graceful handling when no officers exist

#### Load Balancing
- ✅ `testLoadBalancingDistribution` - 6 complaints evenly distributed (2 each) across 3 officers
- ✅ `testAssignToOfficerWithLeastLoad` - Prefers officer with fewest open tasks
- ✅ `testHandleMultipleConcurrentComplaints` - 9 complaints correctly distributed (3 each)

#### Data Integrity
- ✅ `testAutoAssignOnlyNewComplaints` - Only NEW status complaints assigned (not ASSIGNED/IN_PROGRESS)
- ✅ `testComplaintsProcessedInCreationOrder` - FIFO processing by creation timestamp
- ✅ `testIdempotentAutoAssignment` - Running twice doesn't reassign already-assigned complaints

**Algorithm Details**:

```
Load Balancing Logic:
1. Find all complaints with status=NEW and assignedTo=null
2. Load all OFFICER users
3. For each officer, count: ASSIGNED + IN_PROGRESS complaints
4. For each NEW complaint (sorted by creation time):
   - Find officer with minimum open count (tie-break by ID)
   - Assign complaint to that officer
   - Mark complaint status as ASSIGNED
   - Update open count for that officer
   - Send notification to citizen
```

**Test Data Setup**:
```
Officers: 3 (officer1, officer2, officer3)
Citizen: 1 test citizen
Complaints: Created with specific timestamps for order testing
```

**Load Balance Example**:
```
Before: officer1: 3 open, officer2: 1 open, officer3: 0 open
New complaint → assigned to officer3
After:  officer1: 3 open, officer2: 1 open, officer3: 1 open
```

---

## Password Security

### @JsonIgnore Implementation

**Locations where password is protected**:

1. **User Entity** (`com.jonoseba.users.model.User`)
   ```java
   @JsonIgnore
   @Column(name = "password_hash", nullable = false)
   private String passwordHash;
   ```

2. **Request DTOs** (password input only):
   - `RegisterRequest.password` - Transient, never serialized back
   - `LoginRequest.password` - Transient, never serialized back

3. **Response DTOs** - No password field:
   - `AuthResponse` - token, userId, name, role only
   - `UserDTO` - id, name, email, phone, role, active only

### Test Verification
```java
// Auth tests verify password never in response
.andExpect(jsonPath("$.data.password").doesNotExist())
```

---

## Running Tests

### Run All Tests
```bash
cd backend
mvn clean test
```

### Run Specific Test Class
```bash
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=ApplicationServiceTest
mvn test -Dtest=ScheduledJobsTest
```

### Run Specific Test Method
```bash
mvn test -Dtest=AuthControllerTest#testRegisterSuccess
mvn test -Dtest=ScheduledJobsTest#testLoadBalancingDistribution
```

### Generate Coverage Report
```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

---

## Test Configuration Profile

**File**: `src/test/resources/application-test.yml`

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false;MODE=MySQL
    driver-class-name: org.h2.Driver
    username: sa
    password:

  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop  # Recreate schema for each test
    show-sql: false

  h2:
    console:
      enabled: true
      path: /h2-console  # For debugging if needed

logging:
  level:
    root: WARN
    com.jonoseba: DEBUG
```

---

## Key Testing Principles

### 1. Isolation
- Each test class runs with fresh H2 database
- `@Transactional` rollback ensures no state leakage
- MockBean for NotificationService prevents side effects

### 2. Authorization Testing
- Create mock Authentication with specific roles
- Verify AccessDeniedException for unauthorized users
- Confirm NotificationService called/not called appropriately

### 3. Load Balancing Verification
- Pre-assign complaints to officers with different counts
- Verify new assignment goes to officer with least open tasks
- Test round-robin distribution with multiple complaints

### 4. State Management
- Test transitions between states (PENDING → IN_PROGRESS → APPROVED)
- Verify idempotent operations (running twice = same result)
- Confirm FIFO processing by timestamps

---

## Dependencies Summary

```xml
<!-- Test Framework -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>

<!-- H2 Database -->
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
  <scope>test</scope>
</dependency>

<!-- Spring Security Test -->
<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Test Coverage Goals

| Component | Coverage | Tests |
|-----------|----------|-------|
| AuthController | register, login, logout | 8 tests |
| ApplicationService | authorization, state updates | 7 tests |
| ScheduledJobs | auto-assignment, load balancing | 10 tests |
| **Total** | **Authorization, Scheduling, State** | **25+ tests** |

---

## Common Test Patterns

### Create Authentication
```java
Authentication auth = createAuthentication("email@example.com", "ROLE_ADMIN");
```

### Assert No Password in Response
```java
.andExpect(jsonPath("$.data.password").doesNotExist())
```

### Verify Transactional Behavior
```java
@Transactional  // Auto-rollback after test
void testSomething() {
    // Changes don't persist after test
}
```

### Mock Service Interaction
```java
@MockBean
private NotificationService notificationService;

// Verify called
verify(notificationService, times(1)).sendComplaintAssignment(any());

// Verify not called
verifyNoInteractions(notificationService);
```

---

## Next Steps

1. **Run Tests**: `mvn clean test`
2. **Check Coverage**: Generate and review coverage report
3. **CI/CD Integration**: Add test stage to GitHub Actions/GitLab CI
4. **Expand Tests**: Add edge cases and integration scenarios
5. **Performance Tests**: Add load testing for ScheduledJobs

