#!/bin/bash

# Create Docker network if it doesn't exist
docker network create exam-autograder-network 2>/dev/null || true

# Create necessary directories
mkdir -p uploads
mkdir -p mongo-entrypoint

# Build and start all services
docker-compose up --build -d

echo "🚀 Exam Auto Grader is starting up..."
echo "📱 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:9090"
echo "🤖 ML Service: http://localhost:5000"
echo "🗄️ MongoDB: localhost:27017"
echo ""
echo "To stop all services: docker-compose down"
echo "To view logs: docker-compose logs -f"
