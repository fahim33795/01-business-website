export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  addresses?: ShippingAddress[];
  created_at?: string;
}

export interface ShippingAddress {
  id?: number;
  name?: string;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  postal_code?: string;
  full_address?: string;
  phone?: string;
  is_default?: boolean;
}

export interface Variant {
  name: string;
  size?: string;
  shade?: string;
  color?: string;
  price?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number | null;
  cost_price?: number | null;
  stock: number;
  low_stock_threshold: number;
  images: string[];
  variants: Variant[];
  ingredients?: string;
  benefits?: string;
  how_to_use?: string;
  tags?: string[];
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  status: 'active' | 'inactive' | 'deleted';
  rating: number;
  review_count: number;
  discount_percent?: number;
  created_at?: string;
  related?: Product[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status?: string;
  product_count?: number;
}

export interface CartItem {
  id: number; // product id
  product: Product;
  quantity: number;
  selectedVariant?: Variant | null;
}

export interface Coupon {
  id?: number;
  code: string;
  type?: 'percent' | 'fixed';
  discount_type?: 'percent' | 'fixed';
  value?: number;
  discount_value?: number;
  min_spend?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count?: number;
  discountAmount?: number;
  status?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  original_price?: number;
  quantity: number;
  variant?: Variant | null;
  image: string;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  tracking_number?: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress | string;
  delivery_method: 'Standard' | 'Express';
  payment_method: 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'stripe' | 'paypal' | 'cod' | string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | string;
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded' | string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  currency: 'USD' | 'BDT' | string;
  internal_notes?: string;
  created_at: string;
  timeline?: { status: string; completed: boolean; current: boolean }[];
}

export interface Review {
  id: number;
  product_id: number;
  product_name?: string;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  verified_purchase: number;
  status: 'approved' | 'hidden' | 'deleted' | string;
  created_at: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: 'USD' | 'BDT';
  usdToBdtRate: number;
  standardShippingUSD: number;
  expressShippingUSD: number;
  freeShippingThresholdUSD: number;
  standardShippingBDT: number;
  expressShippingBDT: number;
  freeShippingThresholdBDT: number;
  announcementBarText: string;
}
