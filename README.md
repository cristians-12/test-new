# Monorepo - Frontend App & NestJS Backend

A full-stack monorepo containing a React Native mobile app (frontend) and a NestJS backend with Docker support.

## 📁 Project Structure

```
.
├── frontend/           # React Native mobile application
├── backend/            # NestJS API server
├── docker-compose.yml  # Docker Compose orchestration
└── README.md          # This file
```

## 🏗️ Architecture

### Frontend
- **Type**: React Native mobile app (iOS & Android)
- **Stack**: React Native 0.73.6, TypeScript, Redux, React Navigation
- **Location**: `/frontend`
- **Dependencies**: axios (HTTP client), redux-saga, react-native-vector-icons

### Backend
- **Type**: NestJS REST API
- **Stack**: NestJS 11, TypeScript, TypeORM, PostgreSQL, Redis
- **Location**: `/backend`
- **Database**: PostgreSQL (version 16-alpine)
- **Cache**: Redis (version 7-alpine) - configured but currently using in-memory cache
- **Dependencies**: @nestjs/cache-manager, @nestjs/typeorm, class-validator, ioredis

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- pnpm (for backend)
- React Native CLI (for frontend)

### Running the Backend with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker compose up
   ```

   This will start:
   - PostgreSQL on `localhost:5432`
   - Redis on `localhost:6379`
   - Backend (NestJS) on `localhost:3000`

4. **Check service health**
   ```bash
   docker compose ps
   ```

### Running the Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

2. **Start the Metro bundler**
   ```bash
   npm start
   ```

3. **Run on iOS**
   ```bash
   npm run ios
   ```

4. **Run on Android**
   ```bash
   npm run android
   ```

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_USER=root
DB_PASSWORD=root_secret
DB_NAME=test_db

# Backend
NODE_ENV=development
PORT=3000

# Sandbox API (do not use the word "Wompi" in repository)
WOMPI_API_URL=https://sandbox.wompi.co/v1
WOMPI_PUBLIC_KEY=pub_stagtest_xxx
WOMPI_PRIVATE_KEY=prv_stagtest_xxx
WOMPI_EVENTS_KEY=stagtest_events_xxx
WOMPI_INTEGRITY_KEY=stagtest_integrity_xxx
```

### Services Configuration

| Service | Host | Port | Credentials |
|---------|------|------|-------------|
| PostgreSQL | `postgres` (Docker) / `localhost` (Local) | 5432 | User: `root`, Pass: `root_secret` |
| Redis | `redis` (Docker) / `localhost` (Local) | 6379 | - |
| Backend API | `localhost` | 3000 | - |

## 🔧 Backend Development

### Available Scripts

```bash
# Development
pnpm start:dev        # Start with watch mode

# Build & Production
pnpm build            # Compile TypeScript
pnpm start:prod       # Run compiled application

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:cov         # Generate coverage report
pnpm test:e2e         # Run end-to-end tests

# Code Quality
pnpm lint             # Fix ESLint issues
pnpm format           # Format code with Prettier

# Database
pnpm seed             # Run database seed
```

### Project Structure

```
backend/
├── src/
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root module
│   ├── seed.ts               # Database seed script
│   ├── products/             # Products module (CRUD)
│   │   ├── product.entity.ts
│   │   ├── products.service.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   ├── categories/           # Categories module (CRUD + FK)
│   │   ├── category.entity.ts
│   │   ├── categories.service.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   └── payments/             # Payments module (Sandbox API)
│       ├── payment.entity.ts
│       ├── payments.service.ts
│       ├── payments.controller.ts
│       ├── payments.module.ts
│       └── dto/
├── test/
│   ├── jest-e2e.json
│   └── *.e2e-spec.ts
├── Dockerfile          # Docker build configuration
├── .dockerignore       # Docker build exclusions
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## 📱 Frontend Development

### Available Scripts

```bash
# Development
pnpm start              # Start Metro bundler
pnpm run ios            # Run on iOS simulator/device
pnpm run android        # Run on Android emulator/device

# Testing & Quality
pnpm test               # Run tests
pnpm run lint           # Run ESLint
```

### Project Structure

```
frontend/
├── src/
│   ├── App.tsx
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── redux/
│   └── utils/
├── ios/                # iOS native code
├── android/            # Android native code
├── __tests__/
├── app.json            # App configuration
├── metro.config.js     # Metro bundler config
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🐳 Docker & Docker Compose

### Build Backend Image

```bash
docker build -t backend:latest ./backend
```

### Docker Compose Services

```yaml
# Run all services
docker compose up

# Run in background
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f backend
docker compose logs -f postgres
docker compose logs -f redis
```

### Backend Dockerfile

The backend uses a multi-stage Alpine-based build:
- **Base**: `node:22-alpine`
- **Package Manager**: pnpm
- **Port**: 3000
- **Watch Mode**: Enabled for development

### Health Checks

All services include health checks:
- **PostgreSQL**: `pg_isready` check every 5s
- **Redis**: `redis-cli ping` check every 5s

## 🔌 API Integration

The frontend connects to the backend via HTTP:
- **Base URL**: `http://localhost:3000` (dev) or your production domain
- **Client Library**: Axios
- **State Management**: Redux with Redux Saga

Example connection in frontend:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});
```

## 🗄️ Database

### PostgreSQL
- **Version**: 16-alpine
- **Default Database**: `test_db`
- **Volume**: `postgres_data` (persisted)
- **Migrations**: Configure in your NestJS service

### Redis
- **Version**: 7-alpine
- **Purpose**: Configured for caching (currently using in-memory cache)
- **Volume**: `redis_data` (persisted)

## 📦 Dependencies

### Backend Key Libraries
- **NestJS**: Framework for building scalable server-side applications
- **TypeORM**: ORM for database interactions
- **Cache Manager**: In-memory caching (Redis configured for future use)
- **Class Validator**: Input validation
- **Jest**: Testing framework

### Frontend Key Libraries
- **React Native**: Cross-platform mobile framework
- **Redux Toolkit**: State management
- **React Navigation**: Navigation library
- **Axios**: HTTP client

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test
```

## 📚 Code Quality

### Linting & Formatting

**Backend:**
```bash
cd backend
pnpm lint      # Fix ESLint issues
pnpm format    # Format with Prettier
```

**Frontend:**
```bash
cd frontend
npm run lint   # Run ESLint
```

## 🚢 Production Deployment

### Backend Deployment

1. **Build production image**
   ```bash
   docker build -t myapp/backend:1.0.0 ./backend
   ```

2. **Update docker-compose.yml** with production settings:
   - Change `NODE_ENV: production`
   - Remove volume mounts for source code
   - Update database credentials
   - Use production build command instead of watch mode

3. **Push to registry**
   ```bash
   docker push myapp/backend:1.0.0
   docker push myapp/redis:1.0.0
   docker push myapp/postgres:1.0.0
   ```

### Frontend Deployment

**iOS:**
```bash
cd frontend
npm run ios -- --configuration Release
```

**Android:**
```bash
cd frontend
npm run android -- --variant release
```

## 🔐 Security

- **Environment Variables**: Store secrets in `.env` (not committed to git)
- **Input Validation**: Backend uses class-validator for all inputs
- **Docker**: Services run with minimal privileges and Alpine-based images
- **Database**: Use strong credentials in production

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Check Docker logs
docker compose logs backend
```

### Database connection issues
```bash
# Verify PostgreSQL is running
docker compose logs postgres

# Check health
docker compose ps
```

### Frontend won't connect to backend
- Verify backend is running: `docker compose ps`
- Check API base URL in frontend configuration
- Ensure firewall allows connections to port 3000

## 📝 License

UNLICENSED

## 👥 Contributing

Follow the existing code style and ensure all tests pass before submitting changes.
