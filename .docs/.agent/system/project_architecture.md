# Project Architecture Overview

## Current Tech Stack

### Mobile Development
- **Framework**: Flutter 3.x
- **Language**: Dart 3.x
- **State Management**: Riverpod/Provider
- **Navigation**: Go Router
- **Local Database**: Hive/SQLite
- **HTTP Client**: Dio

### Backend & Database
- **Database**: MySQL 8.x on Docker
- **Cloud Platform**: Oracle Cloud Infrastructure
- **API Framework**: Python FastAPI/Django
- **Authentication**: JWT tokens

### Development Tools
- **IDE**: VS Code, Cursor IDE
- **AI Assistant**: Claude API, Cursor AI
- **Version Control**: Git, GitHub
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## Flutter Project Structure

```
lib/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   ├── utils/
│   └── widgets/
├── features/
│   ├── authentication/
│   ├── flashcards/
│   ├── real_estate/
│   └── [other_features]/
├── shared/
│   ├── data/
│   ├── domain/
│   └── presentation/
└── main.dart
```

## Database Architecture

### Primary Database: MySQL
- **Host**: Oracle Cloud Instance
- **Version**: MySQL 8.0
- **Connection**: SSL enabled
- **Backup**: Automated daily backups

### Local Storage: Hive
- **Usage**: Offline data, user preferences
- **Encryption**: Enabled for sensitive data
- **Sync Strategy**: Background sync when online

## API Architecture

### REST API Endpoints
- **Base URL**: `https://api.drjoy-vietnam.com`
- **Authentication**: Bearer JWT tokens
- **Rate Limiting**: 1000 requests/hour
- **Documentation**: OpenAPI 3.0

### Key Endpoints
- `/auth/*` - Authentication flows
- `/flashcards/*` - Learning content
- `/real-estate/*` - Property data
- `/user/*` - User management

## Related Documentation
- Database Schema: `system/database_schema.md`
- API Documentation: `system/api_endpoints.md`
- Deployment Guide: `sops/deployment_process.md`