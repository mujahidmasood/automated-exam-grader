# Changelog

## [2.0.0] - 2024-01-01

### Major Updates - Complete Modernization

#### Frontend (Ionic/Angular)
- **BREAKING**: Upgraded from Ionic 3 to Ionic 7
- **BREAKING**: Upgraded from Angular 7-11 to Angular 17
- **NEW**: Added Capacitor for mobile app development (replacing Cordova)
- **NEW**: Modern TypeScript configuration with strict mode
- **NEW**: Nginx-based production build with optimized serving
- **NEW**: Health checks and security headers
- **IMPROVED**: Modern build pipeline with multi-stage Docker builds

#### Backend (Spring Boot)
- **BREAKING**: Upgraded from Spring Boot 2.0.1 to 3.2.0
- **BREAKING**: Upgraded from Java 8 to Java 17
- **NEW**: Spring Security integration
- **NEW**: Actuator health checks
- **NEW**: MongoDB authentication support
- **NEW**: Maven wrapper for consistent builds
- **IMPROVED**: Docker multi-stage builds with non-root user
- **IMPROVED**: Modern dependency management

#### ML Service (Flask/Python)
- **BREAKING**: Upgraded from Python 3.6 to Python 3.11
- **BREAKING**: Upgraded from TensorFlow 1.4 to 2.15.0
- **NEW**: Gunicorn for production WSGI server
- **NEW**: Modern requirements.txt with pinned versions
- **NEW**: Health checks and proper error handling
- **IMPROVED**: Docker security with non-root user
- **IMPROVED**: Google Cloud Vision API integration

#### Infrastructure
- **NEW**: Docker Compose with health checks and dependencies
- **NEW**: Named volumes for persistent data
- **NEW**: Proper networking configuration
- **NEW**: Modern MongoDB 7.0 with authentication
- **IMPROVED**: Security best practices throughout
- **IMPROVED**: Comprehensive documentation

#### Development Experience
- **NEW**: Modern development setup with hot reload
- **NEW**: Comprehensive error handling
- **NEW**: Automated setup script
- **IMPROVED**: Clear project structure
- **IMPROVED**: Better logging and monitoring

### Removed
- Cordova (replaced with Capacitor)
- Ionic v3 legacy components
- Angular HTTP module (replaced with HttpClient)
- Old build scripts and configurations

### Migration Guide
This is a complete rewrite. To upgrade:
1. Backup your data
2. Update Google Cloud service account keys
3. Follow the new setup instructions in README.md
4. Migrate any custom code to the new architecture