# JonoSeba - Complete Setup & Running Guide

## 🎯 Quick Start

### Option 1: Docker (Recommended)
```bash
# Start everything with Docker
./start.sh

# Stop everything
./stop.sh
```

### Option 2: Development Mode
```bash
# Start in development mode (hot reload)
./start-dev.sh

# Stop development servers
./stop-dev.sh
```

### Option 3: Windows Development Mode
```cmd
# Double-click or run:
start-dev.bat
```

---

## 📋 Prerequisites

### For Docker Mode
- Docker 20.10+
- Docker Compose 2.0+

### For Development Mode
- **Java**: 17 or higher (recommended: 21)
- **Maven**: 3.8+
- **Node.js**: 16+ (recommended: 18)
- **MySQL**: 8.0+ (or use Docker for MySQL only)

---

## 🚀 Detailed Setup Instructions

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd JonoSeba-
```

### 2. Environment Configuration

#### Backend Configuration
The backend uses `application.yml` for configuration. Default settings work for Docker mode.

For development mode, you may need to update:
```yaml
# backend/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/jonoseba
    username: jonoseba
    password: jonoseba123
```

#### Frontend Configuration
Create or update environment files:

**Development (.env.development):**
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

**Production (.env.production):**
```env
VITE_API_URL=https://your-domain.com/api
VITE_WS_URL=https://your-domain.com/ws
```

#### Docker Configuration
Create `.env` file in project root (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and update:
- `JWT_SECRET` - Generate a secure random string
- `MYSQL_ROOT_PASSWORD` - Set a strong root password
- `MYSQL_PASSWORD` - Set a strong user password

### 3. Database Setup

#### Option A: Docker (Automatic)
Database is automatically created when you run `./start.sh`

#### Option B: Manual MySQL Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE jonoseba;
CREATE USER 'jonoseba'@'localhost' IDENTIFIED BY 'jonoseba123';
GRANT ALL PRIVILEGES ON jonoseba.* TO 'jonoseba'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run initialization script (optional)
mysql -u jonoseba -p jonoseba < backend/init.sql
```

### 4. Install Dependencies

#### Backend Dependencies
```bash
cd backend
mvn clean install
cd ..
```

#### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 🏃 Running the Application

### Production Mode (Docker)

#### Start All Services
```bash
./start.sh
```

This will:
- Build Docker images
- Start MySQL database
- Start Spring Boot backend
- Start React frontend with Nginx
- Run health checks
- Display service URLs

#### Access Points
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/actuator/health

#### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

#### Stop Services
```bash
./stop.sh
# or
docker-compose down

# Remove volumes as well
docker-compose down -v
```

### Development Mode (Local)

#### Start Development Servers
```bash
./start-dev.sh
```

This will:
- Check prerequisites (Java, Maven, Node.js, MySQL)
- Start MySQL in Docker (if not running)
- Start Spring Boot with hot reload
- Start Vite dev server with hot reload

#### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

#### Stop Development Servers
```bash
./stop-dev.sh
```

### Manual Development Mode

#### Backend Only
```bash
cd backend
mvn spring-boot:run
```

#### Frontend Only
```bash
cd frontend
npm run dev
```

#### Build for Production
```bash
# Backend
cd backend
mvn clean package
java -jar target/jonoseba-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# Serve the dist/ folder with nginx or any static server
```

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=ApplicationServiceTest
```

### Run with Coverage
```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

---

## 🏗️ Project Structure

```
JonoSeba-/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Configuration files
│   │   └── test/           # Test files
│   ├── pom.xml             # Maven dependencies
│   ├── Dockerfile          # Backend Docker image
│   └── init.sql            # Database initialization
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript type definitions
│   ├── Dockerfile         # Frontend Docker image
│   ├── nginx.conf         # Nginx configuration
│   └── package.json       # NPM dependencies
├── docker-compose.yml     # Multi-container orchestration
├── .env.example          # Environment variables template
├── start.sh              # Docker startup script
├── start-dev.sh          # Development mode script
├── stop.sh               # Docker stop script
└── stop-dev.sh           # Development mode stop script
```

---

## 🔧 Configuration Details

### Backend Configuration (application.yml)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/jonoseba
    username: jonoseba
    password: jonoseba123
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
jwt:
  secret: your-secret-key-here
  expiration: 86400000  # 24 hours

file:
  upload-dir: ./uploads
  max-size: 10485760  # 10MB
```

### Frontend Configuration

**Vite Config (vite.config.ts):**
```typescript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': {
        target: 'http://localhost:8080',
        ws: true
      }
    }
  }
})
```

### Docker Configuration

**Backend Dockerfile:**
- Multi-stage build
- Maven dependency caching
- Java 21 runtime
- Health checks
- Non-root user

**Frontend Dockerfile:**
- Node 18 build stage
- Nginx Alpine runtime
- Optimized static assets
- SPA routing support

**Docker Compose:**
- MySQL 8.0 service
- Backend service with health checks
- Frontend service with Nginx
- Shared network
- Persistent volumes

---

## 🔐 Security Configuration

### JWT Authentication
- Access tokens expire in 24 hours
- Refresh tokens supported
- Secure password hashing with BCrypt

### CORS Configuration
```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost
  allowed-methods: GET,POST,PUT,DELETE,PATCH
  allowed-headers: "*"
  allow-credentials: true
```

### File Upload Security
- Max file size: 10MB
- Allowed types: PDF, JPEG, PNG
- Virus scanning recommended (not included)

---

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Application health
curl http://localhost:8080/actuator/health

# Detailed health
curl http://localhost:8080/actuator/health/liveness
curl http://localhost:8080/actuator/health/readiness

# Metrics
curl http://localhost:8080/actuator/metrics

# Info
curl http://localhost:8080/actuator/info
```

### Docker Health Checks
- MySQL: `mysqladmin ping`
- Backend: `/actuator/health`
- Frontend: Nginx status check

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :8080
sudo lsof -i :3306
sudo lsof -i :5173

# Kill the process
kill -9 <PID>
```

### MySQL Connection Failed
```bash
# Check MySQL is running
docker ps | grep mysql

# View MySQL logs
docker-compose logs mysql

# Connect to MySQL
docker-compose exec mysql mysql -u jonoseba -p
```

### Backend Won't Start
```bash
# Check Java version
java -version  # Should be 17+

# Clean and rebuild
cd backend
mvn clean install

# Check logs
tail -f backend/logs/application.log
```

### Frontend Build Errors
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 16+
```

### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View logs
docker-compose logs -f
```

---

## 📚 API Documentation

### Swagger UI
Access interactive API documentation:
```
http://localhost:8080/swagger-ui.html
```

### OpenAPI Specification
Download OpenAPI spec:
```
http://localhost:8080/v3/api-docs
http://localhost:8080/v3/api-docs.yaml
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

#### Services
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get service details
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/{id}` - Update service (Admin)
- `DELETE /api/services/{id}` - Delete service (Admin)

#### Applications
- `GET /api/applications` - List user applications
- `GET /api/applications/{id}` - Get application details
- `POST /api/applications` - Submit new application
- `PUT /api/applications/{id}/status` - Update status (Officer)

#### Complaints
- `GET /api/complaints` - List complaints
- `POST /api/complaints` - Submit complaint
- `PUT /api/complaints/{id}/status` - Update status

---

## 🚀 Deployment

### Production Deployment

#### Using Docker (Recommended)
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production services
docker-compose up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

#### Manual Deployment

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
java -jar target/jonoseba-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to nginx/apache/cloudflare
```

### Environment-Specific Configuration

#### Production Environment Variables
```env
# Backend
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<secure-random-string-256-bits>
DB_URL=jdbc:mysql://prod-db-host:3306/jonoseba
DB_USERNAME=jonoseba_prod
DB_PASSWORD=<secure-password>

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

### Cloud Deployment Options

#### AWS
- **ECS/Fargate**: Run Docker containers
- **RDS MySQL**: Managed database
- **S3 + CloudFront**: Frontend hosting
- **ALB**: Load balancing

#### Azure
- **Container Apps**: Run containers
- **Azure Database for MySQL**: Managed database
- **Blob Storage + CDN**: Frontend hosting

#### DigitalOcean
- **App Platform**: One-click deployment
- **Managed MySQL**: Database
- **Spaces + CDN**: Static assets

---

## 📞 Support

### Issues & Bug Reports
Please report issues on GitHub with:
- Error messages
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Java version, etc.)

### Feature Requests
Submit feature requests through GitHub Issues with:
- Use case description
- Proposed solution
- Priority level

---

## 📝 License

[Add your license information here]

---

## 👥 Contributors

[Add contributor information here]

---

**Last Updated:** 2024
**Version:** 1.0.0
