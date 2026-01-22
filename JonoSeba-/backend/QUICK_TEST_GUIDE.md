# Quick Start - Running Tests

## Build and Test

```bash
# Navigate to backend directory
cd backend

# Run all tests with H2 in-memory database
mvn clean test

# Run specific test class
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=ApplicationServiceTest
mvn test -Dtest=ScheduledJobsTest

# Run specific test method
mvn test -Dtest=AuthControllerTest#testRegisterSuccess

# Run with detailed output
mvn clean test -X
```

## Test Summary

### AuthControllerTest (8 tests)
Tests `/api/auth` endpoints with MockMvc:
- Register: valid registration, invalid email, weak password, missing fields
- Login: successful login, invalid email, missing password
- Logout: success response
- **Security**: Verifies password never exposed in responses

### ApplicationServiceTest (7 tests)
Tests authorization for application status updates:
- Admin/Officer can update status ✅
- Citizen cannot update status (AccessDeniedException) ✅
- Non-existent application handling ✅
- Multiple state transitions ✅
- Notification triggered on each update

### ScheduledJobsTest (10 tests)
Tests auto-assignment scheduler with H2:
- Single complaint assignment ✅
- Load balancing across 3 officers ✅
- Officer with least load assigned next complaint ✅
- FIFO processing by creation timestamp ✅
- Idempotent (running twice = same result) ✅
- Handles 9 complaints → 3 each per officer ✅

## Expected Output

```
[INFO] Building jonoseba-backend 0.0.1-SNAPSHOT
[INFO] 
[INFO] --- maven-surefire-plugin:3.x.x:test (default-test) @ jonoseba-backend ---
[INFO] Running com.jonoseba.auth.controller.AuthControllerTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.345 s
[INFO] 
[INFO] Running com.jonoseba.applications.service.ApplicationServiceTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.456 s
[INFO] 
[INFO] Running com.jonoseba.scheduling.ScheduledJobsTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.789 s
[INFO] 
[INFO] BUILD SUCCESS
[INFO] Total time: 8.234 s
```

## Files Created

✅ **Dependencies**: 
- H2 in-memory database
- Spring Security Test

✅ **Configuration**:
- `src/test/resources/application-test.yml` - H2 + JPA config

✅ **Test Classes**:
- `src/test/java/com/jonoseba/auth/controller/AuthControllerTest.java`
- `src/test/java/com/jonoseba/applications/service/ApplicationServiceTest.java`
- `src/test/java/com/jonoseba/scheduling/ScheduledJobsTest.java`

✅ **Security**:
- `@JsonIgnore` added to `User.passwordHash`
- Password never exposed in DTOs

## Key Features

### H2 Database
- In-memory testing database
- MySQL compatibility mode
- Auto schema creation/drop per test
- No external dependencies

### Test Isolation
- Each test uses fresh H2 instance
- @Transactional ensures rollback
- MockBean prevents side effects

### Authorization Testing
- Mock Authentication objects
- Role-based access verification
- AccessDeniedException for unauthorized users

### Load Balancing Tests
- Pre-assign tasks to officers
- Verify round-robin distribution
- Test FIFO processing
- Confirm idempotent operations

## Troubleshooting

### Tests Fail with "Column not found"
- Ensure H2 DDL is `create-drop` in application-test.yml
- Check entity annotations (@Entity, @Table)

### Password Exposed in Response
- Verify `@JsonIgnore` on `User.passwordHash`
- Check response DTOs don't include password field

### Load Balance Test Failures
- Verify officer creation in @BeforeEach
- Check complaint timestamps for FIFO testing
- Ensure ComplaintRepository methods exist (countByAssignedToAndStatus)

## Next Steps

1. ✅ Run: `mvn clean test`
2. ✅ Verify: All 25+ tests pass
3. ✅ Review: Check application-test.yml profile
4. ✅ Extend: Add more edge case tests
5. ✅ CI/CD: Integrate into build pipeline

See **TEST_DOCUMENTATION.md** for comprehensive details.
