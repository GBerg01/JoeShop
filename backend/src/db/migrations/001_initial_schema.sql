-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  onboarded     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USER PREFERENCES
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  sizes       TEXT[]    NOT NULL DEFAULT '{}',
  brands      TEXT[]    NOT NULL DEFAULT '{}',
  categories  TEXT[]    NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id      TEXT UNIQUE NOT NULL,
  brand            TEXT NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL,
  subcategory      TEXT,
  sizes_available  TEXT[]    NOT NULL DEFAULT '{}',
  image_urls       TEXT[]    NOT NULL DEFAULT '{}',
  original_price   NUMERIC(10,2) NOT NULL,
  discounted_price NUMERIC(10,2) NOT NULL,
  discount_pct     NUMERIC(5,2)  NOT NULL,
  affiliate_url    TEXT NOT NULL,
  source           TEXT NOT NULL DEFAULT 'mock',
  stock_level      TEXT NOT NULL DEFAULT 'in_stock',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCT STATS
CREATE TABLE IF NOT EXISTS product_stats (
  product_id  UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  view_count  BIGINT NOT NULL DEFAULT 0,
  save_count  BIGINT NOT NULL DEFAULT 0,
  click_count BIGINT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INTERACTIONS
CREATE TABLE IF NOT EXISTS interactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,
  duration_ms  INTEGER,
  scroll_depth NUMERIC(5,2),
  session_id   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SAVES
CREATE TABLE IF NOT EXISTS saves (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- USER SESSIONS
CREATE TABLE IF NOT EXISTS user_sessions (
  id         TEXT PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
