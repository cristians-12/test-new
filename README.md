# Backend - Test Results

## Test Summary

| Metric | Result |
|---|---|
| Test Suites | 5 passed, 5 total |
| Tests | **44 passed**, 44 total |
| Coverage (Statements) | **96.55%** |
| Coverage (Branches) | **81.81%** |
| Coverage (Functions) | **100%** |
| Coverage (Lines) | **100%** |

## Coverage Report

```
-------------------------|----------|----------|----------|----------|-------------------
File                     | % Stmts  | % Branch | % Funcs  | % Lines  | Uncovered Line #s
-------------------------|----------|----------|----------|----------|-------------------
All files                |   96.55  |   81.81  |     100  |     100  |
 src                     |     100  |      75  |     100  |     100  |
  app.controller.ts      |     100  |      75  |     100  |     100  | 6
  app.service.ts         |     100  |     100  |     100  |     100  |
 src/products            |    94.44 |     82.5 |     100  |     100  |
  product.entity.ts      |    77.77 |      75  |     100  |     100  | 36-39
  products.controller.ts |     100  |      75  |     100  |     100  | 19-37
  products.service.ts    |     100  |    93.75 |     100  |     100  | 13
 src/products/dto        |     100  |     100  |     100  |     100  |
  create-product.dto.ts  |     100  |     100  |     100  |     100  |
  query-product.dto.ts   |     100  |     100  |     100  |     100  |
  update-product.dto.ts  |     100  |     100  |     100  |     100  |
-------------------------|----------|----------|----------|----------|-------------------
```

## Test Files

| File | Tests | Description |
|---|---|---|
| `src/app.controller.spec.ts` | 1 | Root controller - getHello |
| `src/app.service.spec.ts` | 2 | Root service - getHello |
| `src/products/products.service.spec.ts` | 12 | CRUD + filtering + pagination + error handling |
| `src/products/products.controller.spec.ts` | 6 | All endpoints delegation to service |
| `src/products/dto/dto.spec.ts` | 23 | Validation rules for all DTOs |

## How to Run

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```
