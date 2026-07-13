# E-Commerce Móvil — Checkout de Pago con Tarjeta de Crédito

Aplicación full-stack de comercio electrónico construida con **React Native CLI** y **NestJS**, con un flujo completo de pago con tarjeta de crédito integrado con la pasarela de pagos **Wompi** (modo sandbox).

---

## APK

La APK compilada de Android se encuentra en:

```
frontend\android\app\build\outputs\apk\release\app-release.apk
```

---

## Stack Tecnológico

| Capa      | Tecnología                                                          |
| --------- | ------------------------------------------------------------------- |
| Móvil     | React Native CLI 0.73, Redux Toolkit, Redux-Saga, Axios            |
| Backend   | NestJS, TypeORM, PostgreSQL, Redis (caché), class-validator         |
| Pagos     | Wompi Sandbox API                                                   |
| Infra     | Docker, Docker Compose                                              |
| Tests     | Jest, Supertest, @testing-library/react-native                      |

---

## Estructura del Proyecto

```
├── backend/                          # API en NestJS
│   ├── src/
│   │   ├── domain/                   # Arquitectura Hexagonal — Capa de dominio
│   │   │   ├── model/                #   Interfaces y enums (IProduct, IPayment, etc.)
│   │   │   ├── dto/                  #   Objetos de Transferencia de Datos con class-validator
│   │   │   └── port/                 #   Puertos (casos de uso de entrada + repositorios de salida)
│   │   ├── application/              # Capa de aplicación — Servicios que implementan casos de uso
│   │   │   └── __tests__/            #   Tests unitarios de servicios
│   │   ├── adapters/                 # Capa de adaptadores
│   │   │   ├── inbound/rest/         #   Controladores REST (adaptadores primarios)
│   │   │   │   └── __tests__/        #   Tests unitarios de controladores
│   │   │   └── outbound/             #   Adaptadores externos
│   │   │       ├── persistence/typeorm/  # Entidades ORM + implementaciones de repositorios
│   │   │       └── external/wompi/       # Gateway de la API de Wompi
│   │   ├── config/                   # Módulos de configuración (DB, Redis, Wompi)
│   │   ├── modules/                  # Módulos feature de NestJS
│   │   └── main.ts                   # Punto de entrada de la aplicación
│   ├── Dockerfile
│   └── package.json
├── frontend/                         # App en React Native CLI
│   ├── src/
│   │   ├── screens/                  # Componentes de pantallas (Home, Carrito, Pago, etc.)
│   │   ├── templates/                # Componentes de plantilla (formulario de pago, historial)
│   │   ├── components/               # Componentes reutilizables de UI
│   │   ├── store/                    # Redux Toolkit + Redux-Saga
│   │   ├── hooks/                    # Hooks personalizados (usePayment, etc.)
│   │   ├── navigation/               # Configuración de React Navigation
│   │   ├── api/                      # Cliente API con Axios
│   │   ├── assets/                   # Imágenes (logos, placeholders)
│   │   └── utils/                    # Helpers (validación, formateo)
│   └── package.json
├── docker-compose.yml                # PostgreSQL + Redis + Backend
├── .env.example
└── README.md
```

---

## API Backend

### Endpoints

| Método   | Ruta                   | Descripción                            |
| -------- | ---------------------- | -------------------------------------- |
| `GET`    | `/api/products`        | Listar todos los productos (con caché) |
| `GET`    | `/api/products/:id`    | Obtener producto por ID                |
| `POST`   | `/api/products`        | Crear producto                         |
| `PUT`    | `/api/products/:id`    | Actualizar producto                    |
| `DELETE` | `/api/products/:id`    | Eliminar producto                      |
| `GET`    | `/api/categories`      | Listar todas las categorías            |
| `GET`    | `/api/categories/:id`  | Obtener categoría por ID               |
| `POST`   | `/api/categories`      | Crear categoría                        |
| `PUT`    | `/api/categories/:id`  | Actualizar categoría                   |
| `DELETE` | `/api/categories/:id`  | Eliminar categoría                     |
| `POST`   | `/api/payments`        | Crear pago (Wompi)                     |
| `GET`    | `/api/payments`        | Listar todos los pagos                 |
| `GET`    | `/api/payments/:id`    | Obtener pago por ID                    |
| `POST`   | `/api/payments/refresh`| Actualizar pagos pendientes            |
| `POST`   | `/api/payments/webhook`| Webhook de Wompi                       |

### Arquitectura — Hexagonal (Puertos y Adaptadores)

El backend sigue una **Arquitectura Hexagonal** para desacoplar la lógica de dominio de las preocupaciones externas:

- **Dominio** (`domain/`): Interfaces puras de negocio, DTOs y definiciones de puertos. Sin dependencias de frameworks.
- **Aplicación** (`application/`): Servicios que implementan los casos de uso definidos por los puertos de entrada y dependen de los puertos de salida.
- **Adaptadores** (`adapters/`):
  - *Entrada*: Controladores REST que reciben peticiones HTTP y delegan a los casos de uso.
  - *Salida*: Repositorios con TypeORM (base de datos) y gateway de la API de Wompi (proveedor de pagos externo).
- **Configuración** (`config/`): Configuración de infraestructura (base de datos, caché, claves de Wompi).
- **Módulos** (`modules/`): Módulos feature de NestJS que ensamblan todo.

---

## Desarrollo Local con Docker

### Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- Git

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd <carpeta-del-proyecto>
```

2. **Crear el archivo `.env`**

```bash
cp .env.example .env
```

Editar `.env` con tus propios valores si es necesario. La configuración por defecto funciona directamente con Docker.

3. **Iniciar todos los servicios**

```bash
docker-compose up --build
```

Esto levanta:

| Servicio   | Puerto | Descripción                    |
| ---------- | ------ | ------------------------------ |
| `postgres` | 5432   | Base de datos PostgreSQL 16    |
| `redis`    | 6379   | Caché Redis 7                  |
| `backend`  | 3000   | Servidor API NestJS            |

4. **Cargar datos de prueba (seed)**

Una vez que el backend esté corriendo:

```bash
docker exec -it test-backend pnpm seed
```

5. **Acceder a la API**

```
http://localhost:3000/api
```

6. **Detener servicios**

```bash
docker-compose down
```

Para eliminar volúmenes (inicio limpio):

```bash
docker-compose down -v
```

---

## Configuración del Frontend (React Native CLI)

### Requisitos previos

- Node.js >= 18
- Android Studio (para el emulador de Android)
- JDK 17

### Pasos

1. **Instalar dependencias**

```bash
cd frontend
npm install
```

2. **Iniciar el bundler Metro**

```bash
npm start
```

3. **Ejecutar en el emulador de Android**

Asegúrese de que un emulador esté corriendo, luego:

```bash
npm run android
```

> El cliente API se conecta a `http://10.0.2.2:3000/api` por defecto, que equivale a `localhost:3000` en la máquina host desde el emulador de Android.

### Compilar APK

```bash
cd android
./gradlew assembleRelease
```

La APK quedará en:

```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## Tests Unitarios

### Backend (96 tests)

```bash
cd backend
pnpm test
```

| Módulo           | Archivo de test                                                        | Tests |
| ---------------- | ---------------------------------------------------------------------- | ----- |
| DTOs             | `domain/dto/__tests__/dto.spec.ts`                                     | 12    |
| ProductService   | `application/__tests__/product.service.spec.ts`                        | 14    |
| CategoryService  | `application/__tests__/category.service.spec.ts`                       | 14    |
| PaymentService   | `application/__tests__/payment.service.spec.ts`                        | 14    |
| ProductsCtrl     | `adapters/inbound/rest/__tests__/products.controller.spec.ts`          | 14    |
| CategoriesCtrl   | `adapters/inbound/rest/__tests__/categories.controller.spec.ts`        | 14    |
| PaymentsCtrl     | `adapters/inbound/rest/__tests__/payments.controller.spec.ts`          | 14    |
| AppController    | `app.controller.spec.ts`                                               | 1     |
| AppService       | `app.service.spec.ts`                                                  | 1     |

**Total: 96 tests pasando**

### Frontend (189 tests)

```bash
cd frontend
npm test
```

| Módulo                | Tests |
| --------------------- | ----- |
| Payment saga          | 16    |
| Payment reducer       | 22    |
| Products saga         | 16    |
| Products reducer      | 22    |
| Categories saga       | 16    |
| Categories reducer    | 22    |
| Cart reducer          | 18    |
| Cart persist          | 8     |
| Validación de tarjeta | 25    |
| Formateo de precio    | 12    |
| App                   | 1     |
| Otras utilidades      | 11    |

**Total: 189 tests pasando**

---

## App Móvil — Flujo de Pago

1. **Pantalla de splash** — Pantalla de carga de la aplicación
2. **Inicio** — Catálogo de productos con filtro por categorías
3. **Detalle del producto** — Ver información del producto y agregar al carrito
4. **Carrito** — Revisar productos seleccionados, ajustar cantidades
5. **Formulario de pago** — Ingresar datos de la tarjeta de crédito (número, vencimiento, CVV, nombre del titular)
   - Detección en tiempo real de la marca de la tarjeta (Visa / Mastercard)
   - Formateo del número de tarjeta con espacios
   - Validación con algoritmo de Luhn
6. **Resumen de pago** — Revisar el pedido antes de confirmar
7. **Estado del pago** — Pantalla de confirmación/rechazo después del procesamiento de Wompi
8. **Historial de pagos** — Ver todos los pagos anteriores con detalles de productos

---

## Integración con Wompi (Sandbox)

Todos los pagos se ejecutan en **modo sandbox** — no se cobra dinero real.

Las claves sandbox por defecto se proporcionan en `docker-compose.yml`. Para usar tus propias claves, actualiza las variables `WOMPI_*` en tu archivo `.env`:

```
WOMPI_API_URL=https://api-sandbox.co.uat.wompi.dev/v1
WOMPI_PUBLIC_KEY=pub_stagtest_xxx
WOMPI_PRIVATE_KEY=prv_stagtest_xxx
WOMPI_EVENTS_KEY=stagtest_events_xxx
WOMPI_INTEGRITY_KEY=stagtest_integrity_xxx
```

---

## Licencia

UNLICENSED
