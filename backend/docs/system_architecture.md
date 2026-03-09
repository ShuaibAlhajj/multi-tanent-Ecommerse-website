# System Architecture (Step 1)

## Overview

The platform is a shared-database, row-level multi-tenant system. Every tenant-owned row contains `store_id`.

- Frontend: Next.js (TypeScript, TailwindCSS)
- Backend: Django + DRF + JWT
- Database: MySQL (single schema)

## Request Flow

1. Client authenticates with `/api/auth/login/` and receives JWT.
2. Client sends `Authorization: Bearer <token>` and optional `X-Store-ID`.
3. DRF viewsets resolve store context and filter querysets by `store_id`.
4. All writes inject `store_id` server-side to prevent cross-tenant contamination.

## Multi-Tenant Controls

- Each tenant-owned table has `store` foreign key.
- Unique constraints include `(store_id, field)` where needed (`slug`, `sku`, etc.).
- Business logic (cart/order/payment) always scopes to a single store.
- Non-admin users only access data in their own store.

## Scaling Direction

- Start with one store row for launch.
- Add new stores without schema changes.
- Horizontal scale with read replicas/caching can be layered later.
