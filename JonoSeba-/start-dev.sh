#!/bin/bash

# JonoSeba - Development Mode Startup Script
# This script runs backend and frontend in development mode (without Docker)

set -e

echo "🚀 Starting JonoSeba in Development Mode..."
echo "==========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "\n${YELLOW}🔍 Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d. -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}❌ Java version must be 17 or higher. Current: $JAVA_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java ${JAVA_VERSION}${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven$(mvn -version | head -1 | cut -d' ' -f3)${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL client not found. Make sure MySQL server is running.${NC}"
else
    echo -e "${GREEN}✓ MySQL client${NC}"
fi

# Create frontend .env if not exists
if [ ! -f frontend/.env.development ]; then
    echo -e "\n${YELLOW}⚠️  Creating frontend .env.development file...${NC}"
    cp frontend/.env.example frontend/.env.development 2>/dev/null || \
    echo "VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws" > frontend/.env.development
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "\n${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

# Start MySQL if using Docker
echo -e "\n${YELLOW}🗄️  Checking MySQL database...${NC}"
if command -v docker &> /dev/null; then
    if ! docker ps | grep -q jonoseba-mysql; then
        echo -e "${YELLOW}Starting MySQL in Docker...${NC}"
        docker run -d \
            --name jonoseba-mysql \
            -e MYSQL_ROOT_PASSWORD=rootpassword \
            -e MYSQL_DATABASE=jonoseba \
            -e MYSQL_USER=jonoseba \
            -e MYSQL_PASSWORD=jonoseba123 \
            -p 3306:3306 \
            mysql:8.0
        
        echo -n "Waiting for MySQL to be ready..."
        sleep 10
        echo -e " ${GREEN}✓${NC}"
    else
        echo -e "${GREEN}✓ MySQL container already running${NC}"
    fi
fi

# Start Backend
echo -e "\n${GREEN}🔧 Starting Backend (Spring Boot)...${NC}"
cd backend
export JAVA_HOME=${JAVA_HOME:-$(dirname $(dirname $(readlink -f $(which java))))}
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -n "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    sleep 2
    if [ $i -eq 30 ]; then
        echo -e "\n${RED}❌ Backend failed to start${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
done

# Start Frontend
echo -e "\n${GREEN}🎨 Starting Frontend (React + Vite)...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Save PIDs for cleanup
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Display info
echo -e "\n${GREEN}✅ Development servers are running!${NC}"
echo "====================================="
echo -e "\n📱 Application URLs:"
echo -e "   ${GREEN}Frontend:${NC}     http://localhost:5173"
echo -e "   ${GREEN}Backend API:${NC}  http://localhost:8080/api"
echo -e "   ${GREEN}Swagger UI:${NC}   http://localhost:8080/swagger-ui.html"
echo -e "   ${GREEN}Health Check:${NC} http://localhost:8080/actuator/health"
echo -e "\n💡 To stop servers, run: ${YELLOW}./stop-dev.sh${NC}"
echo -e "\n${GREEN}🎉 JonoSeba is ready for development!${NC}"

# Keep script running
wait
