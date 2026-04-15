export interface User {
  id: string;
  email: string;
  password_hash: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarded: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  user_id: string;
  sizes: string[];
  brands: string[];
  categories: string[];
  updated_at: Date;
}

export interface Product {
  id: string;
  external_id: string;
  brand: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  sizes_available: string[];
  image_urls: string[];
  original_price: number;
  discounted_price: number;
  discount_pct: number;
  affiliate_url: string;
  source: string;
  stock_level: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductStats {
  product_id: string;
  view_count: number;
  save_count: number;
  click_count: number;
  ctr: number;
  updated_at: Date;
}

export interface Interaction {
  id: string;
  user_id: string;
  product_id: string;
  event_type: 'view' | 'click' | 'save' | 'unsave' | 'scroll_past';
  duration_ms: number | null;
  scroll_depth: number | null;
  session_id: string | null;
  created_at: Date;
}

export interface Save {
  id: string;
  user_id: string;
  product_id: string;
  created_at: Date;
}

export interface FeedProduct extends Product {
  is_saved: boolean;
  is_trending: boolean;
  score: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}
