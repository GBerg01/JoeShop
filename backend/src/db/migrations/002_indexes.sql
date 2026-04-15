-- Feed query performance
CREATE INDEX IF NOT EXISTS idx_products_active_discount
  ON products(is_active, discount_pct DESC);

CREATE INDEX IF NOT EXISTS idx_products_category
  ON products(category) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_products_brand
  ON products(brand) WHERE is_active = TRUE;

-- GIN indexes for array containment queries
CREATE INDEX IF NOT EXISTS idx_products_sizes_gin
  ON products USING GIN(sizes_available);

-- Interactions
CREATE INDEX IF NOT EXISTS idx_interactions_user_product
  ON interactions(user_id, product_id);

CREATE INDEX IF NOT EXISTS idx_interactions_event_type
  ON interactions(event_type, created_at DESC);

-- Saves
CREATE INDEX IF NOT EXISTS idx_saves_user_id
  ON saves(user_id, created_at DESC);

-- Stats
CREATE INDEX IF NOT EXISTS idx_product_stats_saves
  ON product_stats(save_count DESC);

CREATE INDEX IF NOT EXISTS idx_product_stats_views
  ON product_stats(view_count DESC);
