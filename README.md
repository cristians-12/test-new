# Monorepo - Frontend App & NestJS Backend

Monorepo full-stack que contiene una app móvil React Native (frontend) y un backend NestJS con soporte Docker.

## 📁 Estructura del Proyecto

```
.
├── frontend/           # Aplicación móvil React Native
├── backend/            # Servidor API NestJS
├── docker-compose.yml  # Orquestación con Docker Compose
└── README.md          # Este archivo
```

## 🏗️ Arquitectura

### Frontend
- **Tipo**: App móvil React Native (iOS & Android)
- **Stack**: React Native 0.73.6, TypeScript, Redux, React Navigation
- **Ubicación**: `/frontend`
- **Dependencias**: axios (cliente HTTP), redux-saga, react-native-vector-icons

### Backend
- **Tipo**: API REST con NestJS
- **Stack**: NestJS 11, TypeScript, TypeORM, PostgreSQL, Redis
- **Ubicación**: `/backend`
- **Base de datos**: PostgreSQL (versión 16-alpine)
- **Caché**: Redis (versión 7-alpine) - configurado pero actualmente usa caché en memoria
- **Dependencias**: @nestjs/cache-manager, @nestjs/typeorm, class-validator, ioredis

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 18
- Docker & Docker Compose
- pnpm (para el backend)
- React Native CLI (para el frontend)

### Ejecutar el Backend con Docker

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-proyecto>
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

3. **Iniciar todos los servicios con Docker Compose**
   ```bash
   docker compose up
   ```

   Esto iniciará:
   - PostgreSQL en `localhost:5432`
   - Redis en `localhost:6379`
   - Backend (NestJS) en `localhost:3000`

4. **Verificar el estado de los servicios**
   ```bash
   docker compose ps
   ```

### Ejecutar el Frontend

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   # o
   pnpm install
   ```

2. **Iniciar el bundler Metro**
   ```bash
   npm start
   ```

3. **Ejecutar en iOS**
   ```bash
   npm run ios
   ```

4. **Ejecutar en Android**
   ```bash
   npm run android
   ```

   > **Nota:** `localhost` dentro del Android Emulator se refiere al emulador mismo, no a tu máquina. El cliente API está configurado para usar `10.0.2.2`, un alias especial que Android Emulator utiliza para acceder al `localhost` de la máquina anfitriona. Ver más detalles en [Red del Android Emulator](https://developer.android.com/tools/emulator#networking).

## 📋 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_USER=root
DB_PASSWORD=root_secret
DB_NAME=test_db

# Backend
NODE_ENV=development
PORT=3000

# API Sandbox (no usar la palabra "Wompi" en el repositorio)
WOMPI_API_URL=https://sandbox.wompi.co/v1
WOMPI_PUBLIC_KEY=pub_stagtest_xxx
WOMPI_PRIVATE_KEY=prv_stagtest_xxx
WOMPI_EVENTS_KEY=stagtest_events_xxx
WOMPI_INTEGRITY_KEY=stagtest_integrity_xxx
```

### Configuración de Servicios

| Servicio | Host | Puerto | Credenciales |
|----------|------|--------|--------------|
| PostgreSQL | `postgres` (Docker) / `localhost` (Local) | 5432 | Usuario: `root`, Contraseña: `root_secret` |
| Redis | `redis` (Docker) / `localhost` (Local) | 6379 | - |
| Backend API | `localhost` | 3000 | - |

## 🔧 Desarrollo del Backend

### Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev        # Iniciar en modo watch

# Build y Producción
pnpm build            # Compilar TypeScript
pnpm start:prod       # Ejecutar aplicación compilada

# Testing
pnpm test             # Ejecutar tests unitarios
pnpm test:watch       # Ejecutar tests en modo watch
pnpm test:cov         # Generar reporte de cobertura
pnpm test:e2e         # Ejecutar tests end-to-end

# Calidad de Código
pnpm lint             # Corregir problemas de ESLint
pnpm format           # Formatear código con Prettier

# Base de datos
pnpm seed             # Ejecutar seed de la base de datos
```

### Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts               # Punto de entrada de la aplicación
│   ├── app.module.ts         # Módulo raíz
│   ├── seed.ts               # Script de seed de la base de datos
│   ├── products/             # Módulo de productos (CRUD)
│   │   ├── product.entity.ts
│   │   ├── products.service.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   ├── categories/           # Módulo de categorías (CRUD + FK)
│   │   ├── category.entity.ts
│   │   ├── categories.service.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   └── payments/             # Módulo de pagos (API Sandbox)
│       ├── payment.entity.ts
│       ├── payments.service.ts
│       ├── payments.controller.ts
│       ├── payments.module.ts
│       └── dto/
├── test/
│   ├── jest-e2e.json
│   └── *.e2e-spec.ts
├── Dockerfile          # Configuración de build Docker
├── .dockerignore       # Exclusiones del build Docker
├── package.json        # Dependencias
└── tsconfig.json       # Configuración de TypeScript
```

## 📱 Desarrollo del Frontend

### Scripts Disponibles

```bash
# Desarrollo
pnpm start              # Iniciar bundler Metro
pnpm run ios            # Ejecutar en simulador/dispositivo iOS
pnpm run android        # Ejecutar en emulador/dispositivo Android

# Testing y Calidad
pnpm test               # Ejecutar tests
pnpm run lint           # Ejecutar ESLint
```

### Estructura del Proyecto

```
frontend/
├── src/
│   ├── App.tsx
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── redux/
│   └── utils/
├── ios/                # Código nativo de iOS
├── android/            # Código nativo de Android
├── __tests__/
├── app.json            # Configuración de la app
├── metro.config.js     # Configuración del bundler Metro
├── package.json        # Dependencias
└── tsconfig.json       # Configuración de TypeScript
```

## 🐳 Docker & Docker Compose

### Construir imagen del Backend

```bash
docker build -t backend:latest ./backend
```

### Servicios de Docker Compose

```bash
# Ejecutar todos los servicios
docker compose up

# Ejecutar en segundo plano
docker compose up -d

# Detener todos los servicios
docker compose down

# Ver logs
docker compose logs -f backend
docker compose logs -f postgres
docker compose logs -f redis
```

### Dockerfile del Backend

El backend usa un build multi-stage basado en Alpine:
- **Base**: `node:22-alpine`
- **Gestor de paquetes**: pnpm
- **Puerto**: 3000
- **Modo watch**: Habilitado para desarrollo

### Health Checks

Todos los servicios incluyen health checks:
- **PostgreSQL**: Verificación con `pg_isready` cada 5s
- **Redis**: Verificación con `redis-cli ping` cada 5s

## 🔌 Integración API

El frontend se conecta al backend vía HTTP:
- **URL base**: `http://10.0.2.2:3000/api` (Android Emulator) / `http://localhost:3000/api` (iOS Simulator / Web)
- **Biblioteca cliente**: Axios
- **Gestión de estado**: Redux con Redux Saga

Ejemplo de conexión en el frontend:
```typescript
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Android Emulator
  timeout: 15000,
});
```

## 🗄️ Base de Datos

### PostgreSQL
- **Versión**: 16-alpine
- **Base de datos por defecto**: `test_db`
- **Volumen**: `postgres_data` (persistido)
- **Migraciones**: Configurar en tu servicio NestJS

### Redis
- **Versión**: 7-alpine
- **Propósito**: Configurado para caché (actualmente usa caché en memoria)
- **Volumen**: `redis_data` (persistido)

## 📦 Dependencias

### Bibliotecas Principales del Backend
- **NestJS**: Framework para construir aplicaciones escalables del lado del servidor
- **TypeORM**: ORM para interacciones con la base de datos
- **Cache Manager**: Caché en memoria (Redis configurado para uso futuro)
- **Class Validator**: Validación de entradas
- **Jest**: Framework de testing

### Bibliotecas Principales del Frontend
- **React Native**: Framework móvil multiplataforma
- **Redux Toolkit**: Gestión de estado
- **React Navigation**: Biblioteca de navegación
- **Axios**: Cliente HTTP

## 🧪 Testing

### Tests del Backend

| Métrica | Resultado |
|---|---|
| Test Suites | 11 pasaron, 11 total |
| Tests | **105 pasaron**, 105 total |
| Cobertura (Statements) | **94.3%** |
| Cobertura (Branches) | **81.41%** |
| Cobertura (Functions) | **92.59%** |
| Cobertura (Lines) | **95.96%** |

```bash
cd backend

# Tests unitarios
pnpm test

# Modo watch
pnpm test:watch

# Reporte de cobertura
pnpm test:cov

# Tests E2E
pnpm test:e2e
```

### Tests del Frontend

| Métrica | Resultado |
|---|---|
| Test Suites | 7 pasaron, 7 total |
| Tests | **125 pasaron**, 125 total |
| Cobertura (Statements) | **99.44%** |
| Cobertura (Branches) | **95.23%** |
| Cobertura (Functions) | **98.50%** |
| Cobertura (Lines) | **99.42%** |

Cobertura por archivo:

| Archivo | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| cart/reducer.ts | 100% | 100% | 100% | 100% |
| categories/reducer.ts | 100% | 100% | 100% | 100% |
| categories/saga.ts | 100% | 100% | 100% | 100% |
| products/reducer.ts | 100% | 100% | 100% | 100% |
| products/saga.ts | 100% | 100% | 100% | 100% |
| cartPersist.ts | 100% | 100% | 100% | 100% |
| formatPrice.ts | 85.71% | 0% | 66.66% | 85.71% |

```bash
cd frontend

# Ejecutar tests
pnpm test

# Ejecutar tests con reporte de cobertura
pnpm test -- --coverage
```

## 📚 Calidad de Código

### Linting y Formateo

**Backend:**
```bash
cd backend
pnpm lint      # Corregir problemas de ESLint
pnpm format    # Formatear con Prettier
```

**Frontend:**
```bash
cd frontend
npm run lint   # Ejecutar ESLint
```

## 🚢 Despliegue en Producción

### Despliegue del Backend

1. **Construir imagen de producción**
   ```bash
   docker build -t myapp/backend:1.0.0 ./backend
   ```

2. **Actualizar docker-compose.yml** con configuración de producción:
   - Cambiar `NODE_ENV: production`
   - Eliminar volume mounts del código fuente
   - Actualizar credenciales de la base de datos
   - Usar comando de build de producción en vez del modo watch

3. **Subir al registro**
   ```bash
   docker push myapp/backend:1.0.0
   docker push myapp/redis:1.0.0
   docker push myapp/postgres:1.0.0
   ```

### Despliegue del Frontend

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

## 🔐 Seguridad

- **Variables de entorno**: Almacenar secretos en `.env` (no se commitea a git)
- **Validación de entradas**: El backend usa class-validator para todas las entradas
- **Docker**: Los servicios se ejecutan con privilegios mínimos e imágenes basadas en Alpine
- **Base de datos**: Usar credenciales seguras en producción

## 📖 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de React Native](https://reactnative.dev/)
- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Redis](https://redis.io/docs/)

## 🐛 Solución de Problemas

### El backend no inicia
```bash
# Verificar si el puerto 3000 está en uso
lsof -i :3000

# Verificar logs de Docker
docker compose logs backend
```

### Problemas de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker compose logs postgres

# Verificar estado
docker compose ps
```

### El frontend no se conecta al backend
- Verificar que el backend esté ejecutándose: `docker compose ps`
- Verificar la URL base de la API en la configuración del frontend (`frontend/src/api/api.ts`)
- Asegurar que el firewall permita conexiones al puerto 3000
- **Android Emulator:** El cliente API usa `10.0.2.2` en lugar de `localhost`. Este es un alias especial que Android Emulator utiliza para acceder a la máquina anfitriona. Si cambias la URL, asegúrate de usar `10.0.2.2` y no `localhost` al ejecutar en un emulador de Android. Ver [Red del Android Emulator](https://developer.android.com/tools/emulator#networking).
- **iOS Simulator:** `localhost` funciona normalmente ya que el simulador comparte la red del anfitrión.

## 📝 Licencia

UNLICENSED

## 👥 Contribuir

Seguir el estilo de código existente y asegurar que todos los tests pasen antes de enviar cambios.
