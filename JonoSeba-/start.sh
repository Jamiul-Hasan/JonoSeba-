#!/bin/bash

# JonoSeba - Complete Project Startup Script
# This script starts the entire application stack

set -e

echo "🚀 Starting JonoSeba Application..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file. Please review and update it with your settings.${NC}"
fi

# Stop any existing containers
echo -e "\n${YELLOW}📦 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true

# Build and start containers
echo -e "\n${GREEN}🏗️  Building Docker images...${NC}"
docker-compose build

echo -e "\n${GREEN}▶️  Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "\n${YELLOW}⏳ Waiting for services to be ready...${NC}"

# Wait for MySQL
echo -n "  Waiting for MySQL..."
timeout=60
counter=0
while ! docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo -e "\n${RED}❌ MySQL failed to start within ${timeout} seconds${NC}"
        docker-compose logs mysql
        exit 1
    fi
done
echo -e " ${GREEN}✓${NC}"

# Wait for Backend
echo -n "  Waiting for Backend..."
counter=0
while ! docker-compose exec -T backend wget --quiet --tries=1 --spider http://localhost:8080/actuator/health 2>/dev/null; do
    sleep 3
    counter=$((counter + 3))
    if [ $counter -ge 90 ]; then
        echo -e "\n${RED}❌ Backend failed to start within 90 seconds${NC}"
        docker-compose logs backend
        exit 1
    fi
done
echo -e " ${GREEN}✓${NC}"

# Wait for Frontend
echo -n "  Waiting for Frontend..."
counter=0
while ! docker-compose exec -T frontend wget --quiet --tries=1 --spider http://localhost/health 2>/dev/null; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge 30 ]; then
        echo -e "\n${RED}❌ Frontend failed to start within 30 seconds${NC}"
        docker-compose logs frontend
        exit 1
    fi
done
echo -e " ${GREEN}✓${NC}"

# Display status
echo -e "\n${GREEN}✅ All services are up and running!${NC}"
echo "===================================="
echo -e "\n📱 Application URLs:"
echo -e "   ${GREEN}Frontend:${NC}     http://localhost"
echo -e "   ${GREEN}Backend API:${NC}  http://localhost:8080/api"
echo -e "   ${GREEN}Swagger UI:${NC}   http://localhost:8080/swagger-ui.html"
echo -e "   ${GREEN}Health Check:${NC} http://localhost:8080/actuator/health"
echo -e "\n📊 Service Status:"
docker-compose ps

echo -e "\n💡 Useful Commands:"
echo "   View logs:        docker-compose logs -f"
echo "   View backend:     docker-compose logs -f backend"
echo "   View frontend:    docker-compose logs -f frontend"
echo "   Stop all:         docker-compose down"
echo "   Restart:          docker-compose restart"
echo ""
echo -e "${GREEN}🎉 JonoSeba is ready to use!${NC}"
