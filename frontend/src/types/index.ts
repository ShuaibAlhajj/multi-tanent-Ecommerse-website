export interface Store {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  is_active: boolean;
  settings: Record<string, unknown>;
}

export interface Category {
  id: number;
  store: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  store: number;
  category: number | null;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: string;
  currency: string;
  stock_qty: number;
  image?: string;
  is_active: boolean;
}

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image?: string;
  unit_price: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  sku: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  status: string;
  subtotal: string;
  tax_amount: string;
  total: string;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  created_at: string;
  items: OrderItem[];
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  store_id: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
