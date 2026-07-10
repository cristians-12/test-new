# Backend - Test Results

## Test Summary

| Metric | Result |
|---|---|
| Test Suites | 11 passed, 11 total |
| Tests | **103 passed**, 103 total |
| Coverage (Statements) | **94.65%** |
| Coverage (Branches) | **82.66%** |
| Coverage (Functions) | **92.45%** |
| Coverage (Lines) | **96.42%** |

## Coverage Report

```
---------------------------|---------|----------|---------|---------|---------------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s         
---------------------------|---------|----------|---------|---------|---------------------------
All files                  |   94.65 |    82.66 |   92.45 |   96.42 |                           
 src                       |     100 |       75 |     100 |     100 |                           
  app.controller.ts        |     100 |       75 |     100 |     100 | 6                         
  app.service.ts           |     100 |      100 |     100 |     100 |                           
 src/categories            |   95.31 |    84.37 |   86.66 |   98.21 |                           
  categories.controller.ts |     100 |       75 |     100 |     100 | 17-35                     
  categories.service.ts    |     100 |    93.75 |     100 |     100 | 12                        
  category.entity.ts       |   78.57 |       75 |       0 |      90 | 24                        
 src/categories/dto        |     100 |      100 |     100 |     100 |                           
  create-category.dto.ts   |     100 |      100 |     100 |     100 |                           
  update-category.dto.ts   |     100 |      100 |     100 |     100 |                           
 src/payments              |   92.74 |    81.42 |     100 |   92.37 |                           
  payment.entity.ts        |     100 |       80 |     100 |     100 | 53-56                     
  payments.controller.ts   |     100 |       75 |     100 |     100 | 16-19                     
  payments.service.ts      |   89.77 |    82.69 |     100 |   89.53 | 78-81,126-129,187-188,202 
 src/payments/dto          |     100 |      100 |     100 |     100 |                           
  create-payment.dto.ts    |     100 |      100 |     100 |     100 |                           
  webhook.dto.ts           |     100 |      100 |     100 |     100 |                           
 src/products              |    92.1 |    84.09 |   85.71 |   98.46 |                           
  product.entity.ts        |    72.72 |    83.33 |       0 |    93.33 | 32                        
  products.controller.ts   |     100 |       75 |     100 |     100 | 19-37                     
  products.service.ts      |     100 |    93.75 |     100 |     100 | 13                        
 src/products/dto          |     100 |      100 |     100 |     100 |                           
  create-product.dto.ts    |     100 |      100 |     100 |     100 |                           
  query-product.dto.ts     |     100 |      100 |     100 |     100 |                           
  update-product.dto.ts    |     100 |      100 |     100 |     100 |                           
---------------------------|---------|----------|---------|---------|---------------------------
```

## Test Files

| File | Tests | Description |
|---|---|---|
| `src/app.controller.spec.ts` | 1 | Root controller - getHello |
| `src/app.service.spec.ts` | 2 | Root service - getHello |
| `src/products/products.service.spec.ts` | 12 | CRUD + filtering by category_id/search/price + pagination + error handling |
| `src/products/products.controller.spec.ts` | 6 | All 5 endpoints delegation to service |
| `src/products/dto/dto.spec.ts` | 24 | Validation rules for Create, Update and Query Product DTOs |
| `src/categories/categories.service.spec.ts` | 12 | CRUD + slug uniqueness + conflict detection + error handling |
| `src/categories/categories.controller.spec.ts` | 6 | All 5 endpoints delegation to service |
| `src/categories/dto/category-dto.spec.ts` | 13 | Validation rules for Create and Update Category DTOs |
| `src/payments/payments.service.spec.ts` | 16 | CRUD + webhook handling + status mapping + error handling |
| `src/payments/payments.controller.spec.ts` | 3 | All 3 endpoints delegation to service |
| `src/payments/dto/dto.spec.ts` | 8 | Validation rules for CreatePayment and Webhook DTOs |

## How to Run

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```
