#!/bin/bash

# JonoSeba - Stop Docker Containers

echo "🛑 Stopping JonoSeba Docker containers..."

docker-compose down

echo "✅ All containers stopped!"
echo ""
echo "💡 To remove volumes as well, run:"
echo "   docker-compose down -v"
