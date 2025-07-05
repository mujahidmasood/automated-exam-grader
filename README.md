# Automated Exam Grader - Modernized Version

A modern exam auto-grading system built with the latest technologies for recognizing handwritten text from images using Google Cloud Vision API.

## Architecture
- **Frontend**: Ionic 7 with Angular 17
- **Backend**: Spring Boot 3.2 with Java 17
- **ML Service**: Python 3.11 with TensorFlow 2.15
- **Database**: MongoDB 7.0

## Quick Start

1. **Prerequisites**:
   - Docker & Docker Compose
   - Node.js 18+
   - Java 17+
   - Python 3.11+

2. **Environment Setup**:
   ```bash
   # Create network
   docker network create exam-autograder-network
   
   # Run the application
   docker-compose up --build
   ```

3. **Access the Application**:
   - Frontend: http://localhost:8100
   - Backend API: http://localhost:9090
   - ML Service: http://localhost:5000

## Google Cloud Vision API Setup

1. Create a Google Cloud Project
2. Enable Vision API
3. Create service account and download JSON key
4. Place the key as `ExamAutoGraderProcessor/src/gcloud.json`

## Development

For local development without Docker:
```bash
# Backend
cd ExamAutoGraderService
mvn spring-boot:run

# Frontend
cd ExamGraderUi
npm install
ionic serve

# ML Service
cd ExamAutoGraderProcessor
pip install -r requirements.txt
python src/app.py
``` 
