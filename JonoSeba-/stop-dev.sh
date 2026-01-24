#!/bin/bash

# JonoSeba - Stop Development Servers

echo "🛑 Stopping JonoSeba development servers..."

# Kill backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "  Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        # Also kill any Maven processes
        pkill -f "spring-boot:run" 2>/dev/null || true
    fi
    rm .backend.pid
fi

# Kill frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "  Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
        # Also kill any Vite processes
        pkill -f "vite" 2>/dev/null || true
    fi
    rm .frontend.pid
fi

echo "✅ Development servers stopped!"
