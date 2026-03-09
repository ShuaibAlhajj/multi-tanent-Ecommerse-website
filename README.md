# Multi-Tenant Ecommerce Platform

Production-oriented local monorepo using Django + DRF + MySQL backend and Next.js + TypeScript + Tailwind frontend.

## Step 1 - System Architecture

- Shared database, row-level multi-tenancy via `store_id` foreign key on tenant-owned entities.
- JWT-secured API with store context resolved from `X-Store-ID` header or authenticated user's store.
- Backend apps are modular (`users`, `stores`, `products`, `orders`, `payments`).
- Frontend uses reusable component architecture with service/hook separation.

Architecture doc: `backend/docs/system_architecture.md`

## Step 2 - Database Design

Core models/tables implemented:

- Stores
- Users
- Customers
- Categories
- Products
- Orders
- OrderItems
- Payments

Extra supporting table:

- CartItems (for `/api/cart`)

Schema docs:

- `backend/docs/database_design.md`
- `backend/docs/schema.sql`

## Step 3 - Django Backend Implementation

Backend stack:

- Django
- Django REST Framework
- Simple JWT
- MySQL

Key backend folders:

- `backend/ecommerce_platform` - project config
- `backend/apps/users` - auth, custom user, customer
- `backend/apps/stores` - tenant store model and seed command
- `backend/apps/products` - category/product catalog
- `backend/apps/orders` - cart/order flows
- `backend/apps/payments` - payment records
- `backend/media/products` - local product media files

## Step 4 - REST API Implementation

Implemented endpoints:

- `/api/auth/` (register, login, refresh, me)
- `/api/stores/`
- `/api/categories/`
- `/api/products/`
- `/api/cart/`
- `/api/orders/`
- `/api/payments/`

## Step 5 - Next.js Frontend Setup

Frontend stack:

- Next.js (Pages Router)
- TypeScript
- TailwindCSS
- SWR for client cache/dedup

Required folders included:

- `frontend/src/components`
- `frontend/src/pages`
- `frontend/src/services`
- `frontend/src/hooks`
- `frontend/src/layouts`

## Step 6 - UI Components and Pages

Implemented reusable UI + pages:

- Navbar + layout shell
- Reusable buttons and input fields
- Product cards and responsive product grid
- Home page, products page, cart page, checkout page
- Login/register pages and orders page

## Step 7 - Ecommerce Features (Cart + Orders)

Implemented flows:

- Add/update/remove cart items
- Checkout to create order from cart
- Stock deduction during order placement
- User-specific order history

## Step 8 - Multi-Tenant Support

Tenant support implemented in:

- Model design (`store` FK)
- Tenant-aware unique constraints (`store + slug`, `store + sku`, etc.)
- Store-scoped query filtering in API layer
- Server-side store assignment on create/update

## Step 9 - Local Assets

All assets are local:

- Frontend images: `frontend/public/images` and `frontend/public/images/products`
- Backend media placeholders: `backend/media/products`

No external image URLs are used.

## Step 10 - Run Everything Locally

### 1) Start backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Update `.env` with your local MySQL credentials.

Create DB in MySQL:

```sql
CREATE DATABASE multi_tenant_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run backend setup:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 127.0.0.1:8000
```

### 2) Start frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend will run on `http://localhost:3000` and backend on `http://127.0.0.1:8000`.

## API Quick Reference

### Auth

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Catalog and Stores

- `GET /api/stores/`
- `GET /api/categories/`
- `GET /api/products/`

### Cart and Orders

- `GET /api/cart/`
- `POST /api/cart/`
- `PATCH /api/cart/{id}/`
- `DELETE /api/cart/{id}/`
- `GET /api/orders/`
- `POST /api/orders/`
- `GET /api/orders/{id}/`

### Payments

- `GET /api/payments/`
- `POST /api/payments/`

## Monorepo Structure

```text
backend/
  apps/
    common/
    users/
    stores/
    products/
    orders/
    payments/
  docs/
  ecommerce_platform/
  media/products/
  manage.py
frontend/
  public/images/
  src/components/
  src/pages/
  src/services/
  src/hooks/
  src/layouts/
  src/styles/
```
