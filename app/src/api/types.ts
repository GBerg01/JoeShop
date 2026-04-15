export interface FeedProduct {
  id: string;
  external_id: string;
  brand: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  sizes_available: string[];
  image_urls: string[];
  original_price: string;
  discounted_price: string;
  discount_pct: string;
  affiliate_url: string;
  source: string;
  stock_level: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_active: boolean;
  score: number;
  is_trending: boolean;
  is_saved: boolean;
}
