# E-Commerce Mobile App — Credit Card Payment Checkout

Full-stack e-commerce application built with **React Native (Expo)** and **NestJS**, featuring a complete credit card payment checkout flow integrated with the **Wompi** payment gateway (sandbox mode).

---

## APK

The compiled Android APK is located at:

```
frontend\android\app\build\outputs\apk\release\app-release.apk
```

---

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Mobile   | React Native 0.73, Redux Toolkit, Redux-Saga, Axios    |
| Backend  | NestJS, TypeORM, PostgreSQL, Redis (cache), class-validator |
| Payment  | Wompi Sandbox API                                       |
| Infra    | Docker, Docker Compose                                  |
| Tests    | Jest, Supertest, @testing-library/react-native          |

---

## Project Structure

```
├── backend/                          # NestJS API
│   ├── src/
│   │   ├── domain/                   # Hexagonal Architecture — Domain layer
│   │   │   ├── model/                #   Interfaces & enums (IProduct, IPayment, etc.)
│   │   │   ├── dto/                  #   Data Transfer Objects with class-validator
│   │   │   └── port/                 #   Ports (input use cases + output repositories)
│   │   ├── application/              # Application layer — Services implementing use cases
│   │   │   └── __tests__/            #   Unit tests for services
│   │   ├── adapters/                 # Adapters layer
│   │   │   ├── inbound/rest/         #   REST controllers (primary adapters)
│   │   │   │   └── __tests__/        #   Controller unit tests
│   │   │   └── outbound/             #   External adapters
│   │   │       ├── persistence/typeorm/  # ORM entities + repository implementations
│   │   │       └── external/wompi/       # Wompi API gateway
│   │   ├── config/                   # Configuration modules (DB, Redis, Wompi)
│   │   ├── modules/                  # NestJS feature modules
│   │   └── main.ts                   # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                         # React Native app
│   ├── src/
│   │   ├── screens/                  # Screen components (Home, Cart, Payment, etc.)
│   │   ├── templates/                # Template components (payment form, history)
│   │   ├── components/               # Reusable UI components
│   │   ├── store/                    # Redux Toolkit + Redux-Saga
│   │   ├── hooks/                    # Custom hooks (usePayment, etc.)
│   │   ├── navigation/               # React Navigation config
│   │   ├── api/                      # Axios API client
│   │   ├── assets/                   # Images (logos, placeholders)
│   │   └── utils/                    # Helpers (validation, formatters)
│   └── package.json
├── docker-compose.yml                # PostgreSQL + Redis + Backend
├── .env.example
└── README.md
```

---

## Backend API

### Endpoints

| Method   | Endpoint              | Description                   |
| -------- | --------------------- | ----------------------------- |
| `GET`    | `/api/products`       | List all products (with cache) |
| `GET`    | `/api/products/:id`   | Get product by ID             |
| `POST`   | `/api/products`       | Create product                |
| `PUT`    | `/api/products/:id`   | Update product                |
| `DELETE` | `/api/products/:id`   | Delete product                |
| `GET`    | `/api/categories`     | List all categories           |
| `GET`    | `/api/categories/:id` | Get category by ID            |
| `POST`   | `/api/categories`     | Create category               |
| `PUT`    | `/api/categories/:id` | Update category               |
| `DELETE` | `/api/categories/:id` | Delete category               |
| `POST`   | `/api/payments`       | Create payment (Wompi)        |
| `GET`    | `/api/payments`       | List all payments             |
| `GET`    | `/api/payments/:id`   | Get payment by ID             |
| `POST`   | `/api/payments/refresh` | Refresh pending payments     |
| `POST`   | `/api/payments/webhook` | Wompi webhook handler        |

### Architecture — Hexagonal (Ports & Adapters)

The backend follows **Hexagonal Architecture** to decouple the domain logic from external concerns:

- **Domain** (`domain/`): Pure business interfaces, DTOs, and port definitions. No framework dependencies.
- **Application** (`application/`): Services that implement use cases defined by input ports and depend on output ports.
- **Adapters** (`adapters/`):
  - *Inbound*: REST controllers that receive HTTP requests and delegate to use cases.
  - *Outbound*: TypeORM repositories (database) and Wompi API gateway (external payment provider).
- **Config** (`config/`): Infrastructure configuration (database, cache, Wompi keys).
- **Modules** (`modules/`): NestJS feature modules wiring everything together.

---

## Local Development with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- Git

### Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd <project-folder>
```

2. **Create your `.env` file**

```bash
cp .env.example .env
```

Edit `.env` with your own values if needed. The default configuration works out of the box with Docker.

3. **Start all services**

```bash
docker-compose up --build
```

This starts:

| Service    | Port  | Description                    |
| ---------- | ----- | ------------------------------ |
| `postgres` | 5432  | PostgreSQL 16 database         |
| `redis`    | 6379  | Redis 7 cache                  |
| `backend`  | 3000  | NestJS API server              |

4. **Seed the database**

Once the backend is running:

```bash
docker exec -it test-backend pnpm seed
```

5. **Access the API**

```
http://localhost:3000/api
```

6. **Stop services**

```bash
docker-compose down
```

To remove volumes (fresh start):

```bash
docker-compose down -v
```

---

## Frontend Setup (React Native)

### Prerequisites

- Node.js >= 18
- Android Studio (for Android emulator)
- JDK 17

### Steps

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Start Metro bundler**

```bash
npm start
```

3. **Run on Android emulator**

Make sure an emulator is running, then:

```bash
npm run android
```

> The API client connects to `http://10.0.2.2:3000/api` by default, which maps to `localhost:3000` on the host machine from the Android emulator.

### Build APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:

```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## Unit Tests

### Backend (96 tests)

```bash
cd backend
pnpm test
```

| Module          | Test file                                         | Tests |
| --------------- | ------------------------------------------------- | ----- |
| DTOs            | `domain/dto/__tests__/dto.spec.ts`                | 12    |
| ProductService  | `application/__tests__/product.service.spec.ts`   | 14    |
| CategoryService | `application/__tests__/category.service.spec.ts`  | 14    |
| PaymentService  | `application/__tests__/payment.service.spec.ts`   | 14    |
| ProductsCtrl    | `adapters/inbound/rest/__tests__/products.controller.spec.ts`  | 14    |
| CategoriesCtrl  | `adapters/inbound/rest/__tests__/categories.controller.spec.ts` | 14    |
| PaymentsCtrl    | `adapters/inbound/rest/__tests__/payments.controller.spec.ts`   | 14    |
| AppController   | `app.controller.spec.ts`                          | 1     |
| AppService      | `app.service.spec.ts`                             | 1     |

**Total: 96 tests passing**

### Frontend (189 tests)

```bash
cd frontend
npm test
```

| Module              | Tests |
| ------------------- | ----- |
| Payment saga        | 16    |
| Payment reducer     | 22    |
| Products saga       | 16    |
| Products reducer    | 22    |
| Categories saga     | 16    |
| Categories reducer  | 22    |
| Cart reducer        | 18    |
| Cart persist        | 8     |
| Card validation     | 25    |
| Price formatter     | 12    |
| App                 | 1     |
| Other utilities     | 11    |

**Total: 189 tests passing**

---

## Mobile App — Payment Flow

1. **Splash screen** — App loading screen
2. **Home** — Product catalog with categories filter
3. **Product detail** — View product info and add to cart
4. **Cart** — Review selected products, adjust quantities
5. **Payment form** — Enter credit card details (number, expiry, CVV, cardholder name)
   - Real-time card brand detection (Visa / Mastercard)
   - Card number formatting with spaces
   - Luhn algorithm validation
6. **Payment summary** — Review order before submitting
7. **Payment status** — Confirmation/rejection screen after Wompi processing
8. **Payment history** — View all previous payments with product details

---

## Wompi Integration (Sandbox)

All payments run in **sandbox mode** — no real money is charged.

Default sandbox keys are provided in `docker-compose.yml`. To use your own keys, update the `WOMPI_*` variables in your `.env` file:

```
WOMPI_API_URL=https://api-sandbox.co.uat.wompi.dev/v1
WOMPI_PUBLIC_KEY=pub_stagtest_xxx
WOMPI_PRIVATE_KEY=prv_stagtest_xxx
WOMPI_EVENTS_KEY=stagtest_events_xxx
WOMPI_INTEGRITY_KEY=stagtest_integrity_xxx
```

---

## License

UNLICENSED
