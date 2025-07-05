# Development Guide

## Prerequisites

- **Docker & Docker Compose**: For containerized development
- **Node.js 18+**: For frontend development
- **Java 17+**: For backend development
- **Python 3.11+**: For ML service development
- **Google Cloud Account**: For Vision API

## Project Structure

```
automated-exam-grader/
├── ExamAutoGraderService/     # Spring Boot backend
│   ├── src/                   # Java source code
│   ├── pom.xml               # Maven dependencies
│   ├── Dockerfile            # Production Docker image
│   └── mvnw                  # Maven wrapper
├── ExamAutoGraderProcessor/   # Flask ML service
│   ├── src/                  # Python source code
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile           # Production Docker image
├── ExamGraderUi/             # Ionic/Angular frontend
│   ├── src/                  # TypeScript/HTML/SCSS source
│   ├── package.json         # Node.js dependencies
│   ├── angular.json         # Angular CLI configuration
│   ├── capacitor.config.ts  # Mobile app configuration
│   └── Dockerfile          # Production Docker image
├── docker-compose.yml        # Multi-service orchestration
├── setup.sh                 # Quick setup script
└── README.md               # Project documentation
```

## Development Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd automated-exam-grader
./setup.sh
```

### 2. Local Development (without Docker)

#### Backend (Spring Boot)
```bash
cd ExamAutoGraderService
./mvnw spring-boot:run
```

#### Frontend (Ionic/Angular)
```bash
cd ExamGraderUi
npm install
npm start
# or
ionic serve
```

#### ML Service (Flask)
```bash
cd ExamAutoGraderProcessor
pip install -r requirements.txt
python src/app.py
```

### 3. Google Cloud Vision API Setup

1. Create a Google Cloud Project
2. Enable the Vision API
3. Create a service account
4. Download the JSON key file
5. Place it as `ExamAutoGraderProcessor/src/gcloud.json`

## Development Workflow

### Making Changes

1. **Backend Changes**: Edit Java files in `ExamAutoGraderService/src/`
2. **Frontend Changes**: Edit TypeScript/HTML/SCSS files in `ExamGraderUi/src/`
3. **ML Service Changes**: Edit Python files in `ExamAutoGraderProcessor/src/`

### Testing

```bash
# Backend tests
cd ExamAutoGraderService
./mvnw test

# Frontend tests
cd ExamGraderUi
npm test

# ML service tests
cd ExamAutoGraderProcessor
python -m pytest
```

### Building

```bash
# Build all services
docker-compose build

# Build individual services
docker-compose build springboot
docker-compose build web
docker-compose build machinelearning
```

## API Endpoints

### Backend (Spring Boot) - Port 9090
- `GET /actuator/health` - Health check
- `POST /api/exams` - Create exam
- `GET /api/exams` - List exams
- `POST /api/process-image` - Process exam image

### ML Service (Flask) - Port 5000
- `GET /` - Health check
- `POST /getTextFromImage` - Extract text from image
- `POST /processExamSheetSerial` - Process exam sheet

### Frontend (Ionic/Angular) - Port 80
- `GET /` - Main application
- `GET /health` - Health check

## Database

### MongoDB Configuration
- **Host**: localhost:27017
- **Database**: exam_grader
- **Username**: admin
- **Password**: password123

### Connection String
```
mongodb://admin:password123@localhost:27017/exam_grader?authSource=admin
```

## Mobile App Development

### Build for Android
```bash
cd ExamGraderUi
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

### Build for iOS
```bash
cd ExamGraderUi
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   docker-compose down
   docker system prune -f
   ```

2. **Maven Dependencies**
   ```bash
   cd ExamAutoGraderService
   ./mvnw clean install
   ```

3. **Node Modules**
   ```bash
   cd ExamGraderUi
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python Dependencies**
   ```bash
   cd ExamAutoGraderProcessor
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

### Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f springboot
docker-compose logs -f web
docker-compose logs -f machinelearning
docker-compose logs -f mongo
```

## Performance Optimization

### Backend
- Use Spring Boot profiles for different environments
- Configure JVM heap size: `-Xmx512m -Xms256m`
- Enable connection pooling for MongoDB

### Frontend
- Enable Angular production build optimizations
- Use lazy loading for routes
- Implement service workers for caching

### ML Service
- Use Gunicorn with multiple workers
- Implement request queuing for heavy processing
- Cache frequent API calls

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use HTTPS** in production
3. **Enable CORS** properly
4. **Validate all inputs** on backend
5. **Use proper authentication** for API endpoints

## Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale springboot=2 --scale machinelearning=2
```

### Environment Variables
```bash
# Backend
SPRING_PROFILES_ACTIVE=production
SPRING_DATA_MONGODB_URI=mongodb://user:pass@host:27017/db

# ML Service
GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcloud.json
FLASK_ENV=production

# Frontend
API_URL=https://your-api-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
1. Check the [troubleshooting section](#troubleshooting)
2. Review the [changelog](CHANGELOG.md)
3. Create an issue in the repository