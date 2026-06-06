// =====================================================
// DATABASE TYPES
// =====================================================

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      penitipan_bookings: {
        Row: PenitipanBooking;
        Insert: Omit<PenitipanBooking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PenitipanBooking, 'id' | 'created_at' | 'updated_at'>>;
      };
      penitipan_packages: {
        Row: PenitipanPackage;
        Insert: Omit<PenitipanPackage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PenitipanPackage, 'id' | 'created_at' | 'updated_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>;
      };
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// =====================================================
// APPLICATION TYPES
// =====================================================

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  stock: number;
  image_url?: string | null;
  images?: string[];
  is_active: boolean;
  featured: boolean;
  sku?: string;
  weight?: number;
  meta_description?: string;
  meta_keywords?: string[];
  created_at: string | Date;
  updated_at: string | Date;
}

export type ProductCategory = 
  | 'dry_food' 
  | 'wet_food' 
  | 'tools' 
  | 'grooming' 
  | 'accessories' 
  | 'medicine';

export interface Service {
  id: string;
  name: string;
  description?: string;
  service_type: ServiceType;
  price: number;
  duration?: string;
  image_url?: string;
  is_active: boolean;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export type ServiceType = 'penitipan' | 'operasi' | 'konsultasi' | 'grooming';

export interface PenitipanPackage {
  id: string;
  name: string;
  description?: string;
  price_per_night: number;
  features?: string[];
  max_cats: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  order_type: OrderType;
  subtotal: number;
  discount: number;
  total: number;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_proof_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: 'product' | 'service';
  product_id?: string;
  service_id?: string;
  item_name: string;
  item_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export type OrderType = 'product' | 'service' | 'penitipan';
export type PaymentMethod = 'qris' | 'transfer' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface PenitipanBooking {
  id: string;
  booking_number: string;
  order_id?: string;
  customer_id?: string;
  package_id?: string;
  cat_name: string;
  cat_age?: string;
  cat_gender?: string;
  cat_health_condition?: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  total_price: number;
  booking_status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'checked_out' 
  | 'cancelled';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: BlogCategory;
  image_url?: string;
  author: string;
  is_published: boolean;
  published_at?: string;
  meta_description?: string;
  meta_keywords?: string[];
  views: number;
  created_at: string;
  updated_at: string;
}

export type BlogCategory = 
  | 'kesehatan' 
  | 'nutrisi' 
  | 'perawatan' 
  | 'tips_penitipan' 
  | 'pasca_operasi';

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_avatar?: string;
  cat_name?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CART TYPES - Enhanced with Variants
// =====================================================

export interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  description?: string | null;
  category?: string;
  stock?: number;
  
  // Variant Support
  variantId?: string;
  variantName?: string;
  variantAttributes?: Record<string, string>; // { size: "M", color: "Blue" }
  
  // Original Data
  productData?: Product;
  serviceData?: Service;
  
  // Metadata
  sku?: string;
  maxQuantity?: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  itemCount: number;
}

// Cart Validation Response
export interface CartValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

// =====================================================
// FORM TYPES
// =====================================================

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface BookingFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  package_id: string;
  cat_name: string;
  cat_age?: string;
  cat_gender?: 'jantan' | 'betina';
  cat_health_condition?: string;
  check_in_date: string;
  check_out_date: string;
  special_requests?: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =====================================================
// SETTINGS TYPES
// =====================================================

export interface SiteConfig {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
}

export interface PaymentConfig {
  qris: {
    enabled: boolean;
    image_url: string;
  };
  transfer: {
    enabled: boolean;
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

export interface BusinessHours {
  [key: string]: string;
}
