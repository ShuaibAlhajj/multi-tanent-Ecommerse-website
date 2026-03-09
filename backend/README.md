# Multi-Tenant Ecommerce Backend

## Quick Start

1. Create and activate virtual environment:
   - `python -m venv .venv`
   - Windows: `.venv\\Scripts\\activate`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Configure environment variables:
   - Copy `.env.example` to `.env` and set your MySQL credentials.
4. Create MySQL database:
   - `CREATE DATABASE multi_tenant_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
5. Run migrations:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
6. Create admin user:
   - `python manage.py createsuperuser`
7. Run server:
   - `python manage.py runserver 127.0.0.1:8000`

## Multi-Tenant Strategy

All tenant-owned models include `store` foreign key (`store_id` in SQL). API filtering uses:
- `X-Store-ID` request header, or
- authenticated user's `store_id`, or
- first active store fallback for read flows.

## Key APIs

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`
- `GET/POST /api/stores/`
- `GET/POST /api/categories/`
- `GET/POST /api/products/`
- `GET/POST/PATCH/DELETE /api/cart/`
- `GET/POST /api/orders/`
- `GET /api/orders/{id}/`
