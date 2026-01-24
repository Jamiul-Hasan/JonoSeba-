# JonoSeba - Digital Governance Platform

A comprehensive digital governance platform designed to streamline public services in rural Bangladesh. This platform connects citizens, officers, and administrators to facilitate efficient service delivery, application tracking, and complaint management.

## 🚀 Quick Start

### Option 1: Docker (Production Mode)
```bash
./start.sh
```
Access the application at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### Option 2: Development Mode
```bash
./start-dev.sh
```
Access the application at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

### Option 3: Windows Development
```cmd
start-dev.bat
```

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## ✨ Features

### For Citizens 👥
- 📝 Apply for government services online
- 🔍 Track application status in real-time
- 📢 Submit complaints and suggestions
- 🔔 Receive instant notifications via WebSocket
- 📄 Upload and manage required documents
- 📱 Responsive mobile-friendly interface

### For Officers 👨‍💼
- 📋 Review and process applications
- ✅ Update application status with workflow
- 📊 View assigned applications dashboard
- 💬 Respond to complaints efficiently
- 📈 Generate and export reports
- ⏰ Automated scheduled tasks

### For Administrators 👑
- 👥 Manage users, roles, and permissions
- 🛠️ Configure services and requirements
- 📊 View analytics and comprehensive reports
- ⚙️ System configuration and monitoring
- 🔐 Security and access control
- 📉 Performance metrics via Actuator

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21 (Amazon Corretto)
- **Database**: MySQL 8.0 (H2 for testing)
- **Security**: JWT Authentication with Spring Security
- **Real-time**: WebSocket with STOMP messaging
- **API Documentation**: SpringDoc OpenAPI 3 (Swagger)
- **Monitoring**: Spring Boot Actuator
- **Build Tool**: Maven 3.9.12
- **Testing**: JUnit 5, MockMvc, 24 comprehensive tests

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 5.0
- **UI Library**: Tailwind CSS 3.4 + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Build Tool**: Vite 5.0
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Toast notifications with real-time updates

### DevOps & Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (production)
- **Health Checks**: Built-in Docker health monitoring
- **CI/CD Ready**: GitHub Actions compatible
- **Monitoring**: Spring Boot Actuator endpoints
- **API Testing**: Swagger UI integrated

---

## 📋 Prerequisites

### For Docker Mode (Recommended)
- Docker 20.10+
- Docker Compose 2.0+

### For Development Mode
- **Java**: 17 or higher (21 recommended)
- **Maven**: 3.8+ (3.9.12 recommended)
- **Node.js**: 16+ (18 recommended)
- **MySQL**: 8.0+ (or use Docker for MySQL)

2️⃣ Online Government Service Applications

Citizens can apply for:

Birth Certificate

Death Certificate

Land Mutation

Nationality Certificate

VGF / VGD

Old Age, Widow & Disability Allowance

Features:

Online form submission

Document upload

Status tracking: Pending → Review → Approved / Rejected

3️⃣ Local Problem Reporting System

Citizens can report:

Damaged roads

Water supply issues

Garbage problems

Street light & drainage issues

Features:

Photo upload

Automatic assignment to field workers

Progress updates from field staff

4️⃣ Real-Time Notification System

Application status updates

Complaint progress updates

Admin remarks

Implemented using:

Spring WebSocket + STOMP

SockJS + StompJS (React)

5️⃣ Role-Based Dashboards
Citizen Dashboard

View submitted applications

View reported problems

Receive live notifications

Admin Dashboard

Review & manage applications

Assign tasks to field workers

Monitor system activity

Field Worker Dashboard

View assigned tasks

Update progress

Upload completion proofs

6️⃣ Background Task Processing

Implemented using multithreading:

Automatic complaint assignment

Daily summary report generation

Asynchronous notifications

Technologies:

@Async

@Scheduled

ExecutorService

🗄️ Database Design (High Level)

User

id, name, email, password, role

Application

id, user_id, service_type, status, documents, created_at

Report

id, citizen_id, issue_type, description, photo, assigned_worker_id, status

Notification

id, user_id, message, read_status, timestamp

Task

id, worker_id, application_id/report_id, progress, status

⚙️ Installation & Setup
Prerequisites

Java 17+

Maven

Node.js & npm

MySQL / PostgreSQL

GitHub Codespaces or Local IDE

Backend Setup
cd backend
mvn spring-boot:run


Backend runs at:

http://localhost:8080

Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🔐 Security

JWT-based authentication

Role-based authorization

Secure REST APIs

Token-based client-server communication

🌐 Networking Concepts Used

RESTful APIs over HTTP/HTTPS

WebSocket communication over TCP

Client-server architecture

Token-based authentication

🧵 Multithreading & Concurrency

Background task execution

Non-blocking async operations

Scheduled system tasks

Improved performance & responsiveness

📈 Future Enhancements

Mobile App (Android)

SMS notifications

GIS-based complaint tracking

AI-based complaint prioritization

Government analytics dashboard

👨‍💻 Developed By

Project Name: JonoSeba (জনসেবা)
Type: Academic / Learning Project
Stack: Spring Boot + React
Purpose: Digital Governance & E-Government System

📄 License

This project is for educational and academic purposes.
