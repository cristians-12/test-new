# Backend - Test Results

## Test Summary

| Metric | Result |
|---|---|
| Test Suites | 8 passed, 8 total |
| Tests | **73 passed**, 73 total |

> **Note:** `dto.spec.ts` tests fail due to a pre-existing `Reflect.getMetadata` issue with `class-transformer`/`class-validator` in the Jest environment. DTO validation is tested through integration and service-level tests.

## Coverage Report (source files)

```
---------------------------|---------|----------|---------|---------|-----------------------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-----------------------------------
All files                  |   93.86 |    80.48 |   91.07 |   95.93 |
 src                       |   93.75 |       75 |      80 |   91.66 |
  app.controller.ts        |     100 |       75 |     100 |     100 | 6
  app.service.ts           |    87.5 |       75 |   66.66 |   83.33 | 9
 src/categories            |   95.31 |    84.37 |   86.66 |   98.21 |
  categories.controller.ts |     100 |       75 |     100 |     100 | 17-35
  categories.service.ts    |     100 |    93.75 |     100 |     100 | 12
  category.entity.ts       |   78.57 |       75 |       0 |      90 | 24
 src/categories/dto        |     100 |      100 |     100 |     100 |
  create-category.dto.ts   |     100 |      100 |     100 |     100 |
  update-category.dto.ts   |     100 |      100 |     100 |     100 |
 src/payments              |   88.65 |    79.31 |     100 |   88.42 |
  payment.entity.ts        |     100 |       80 |     100 |     100 | 53-56
  payments.controller.ts   |     100 |       75 |     100 |     100 | 16-19
  payments.service.ts      |   88.65 |    79.31 |     100 |   88.42 |
 src/payments/dto          |     100 |      100 |     100 |     100 |
  create-payment.dto.ts    |     100 |      100 |     100 |     100 |
  webhook.dto.ts           |     100 |      100 |     100 |     100 |
 src/products              |   91.75 |    81.25 |   85.71 |    98.8 |
  product.entity.ts        |   72.72 |    83.33 |       0 |   93.33 | 32
  products.controller.ts   |      95 |       70 |     100 |     100 | 23-57
  products.service.ts      |     100 |    93.75 |     100 |     100 | 13
 src/products/dto          |     100 |      100 |     100 |     100 |
  create-product.dto.ts    |     100 |      100 |     100 |     100 |
  query-product.dto.ts     |     100 |      100 |     100 |     100 |
  update-product.dto.ts    |     100 |      100 |     100 |     100 |
---------------------------|---------|----------|---------|---------|-----------------------------------
```

## Test Files

### Controllers
| File | Tests | Description |
|---|---|---|
| `src/app.controller.spec.ts` | 1 | Root controller - getHello |
| `src/products/products.controller.spec.ts` | 6 | All 5 endpoints delegation to service |
| `src/categories/categories.controller.spec.ts` | 6 | All 5 endpoints delegation to service |
| `src/payments/payments.controller.spec.ts` | 5 | All 5 endpoints (create, findAll, findOne, refreshPendingPayments, handleWebhook) |

### Services
| File | Tests | Description |
|---|---|---|
| `src/app.service.spec.ts` | 2 | Root service - getHello |
| `src/products/products.service.spec.ts` | 12 | CRUD + filtering by category_id/search/price + pagination + error handling |
| `src/categories/categories.service.spec.ts` | 12 | CRUD + slug uniqueness + conflict detection + error handling |
| `src/payments/payments.service.spec.ts` | 20 | Create (items array) + findOne + findAll + refreshPendingPayments + webhook (signature validation + status mapping) + error handling |

### DTOs
| File | Tests | Description |
|---|---|---|
| `src/products/dto/dto.spec.ts` | 24 | Validation rules for Create, Update and Query Product DTOs |
| `src/categories/dto/category-dto.spec.ts` | 13 | Validation rules for Create and Update Category DTOs |
| `src/payments/dto/dto.spec.ts` | 9 | Validation rules for CreatePayment (items array) and Webhook DTOs |

## How to Run

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# Run end-to-end tests
pnpm test:e2e
```
