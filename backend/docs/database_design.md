# Database Design (Step 2)

## Core Tables

- `stores`
- `users`
- `customers`
- `categories`
- `products`
- `orders`
- `order_items`
- `payments`

Additional table:
- `cart_items` (supports `/api/cart` endpoint)

## Multi-Tenant Rules

- Tenant-owned records store `store_id`.
- Composite uniqueness is tenant-aware (e.g., `products(store_id, sku)`).
- Query filters always include `store_id`.

## ERD (Simplified)

- Store 1..* Users
- Store 1..* Customers
- Store 1..* Categories
- Store 1..* Products
- Store 1..* Orders
- Order 1..* OrderItems
- Store 1..* Payments (Payment belongs to one Order)
- Store 1..* CartItems (per User + Product)

See `schema.sql` for SQL DDL reference.
