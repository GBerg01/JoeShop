# ThreadDrop MVP

TikTok-style fashion deals discovery app.

## Stack
- **Backend**: Node.js + TypeScript (Fastify), PostgreSQL, Redis
- **App**: React Native + Expo (managed)

---

## Quick Start

### 1. Start databases (requires Docker)
```bash
docker start threaddrop-pg threaddrop-redis
# Or first time:
docker run --name threaddrop-pg -e POSTGRES_DB=threaddrop -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16
docker run --name threaddrop-redis -p 6379:6379 -d redis:7
```

### 2. Start backend
```bash
cd backend
npm run dev
# API runs on http://localhost:3000
# Health: http://localhost:3000/health
```

### 3. Start app
```bash
cd app
npx expo start
# Scan QR with Expo Go (iOS/Android)
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

---

## Backend Scripts
```bash
npm run dev      # Dev server with hot reload
npm run seed     # Reseed 200 mock products
npm run build    # Compile TypeScript
npm start        # Run compiled output
```

---

## API Overview (`/api/v1`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh JWT |
| GET | `/onboarding/options` | Size/brand/category options |
| POST | `/onboarding/complete` | Save preferences |
| GET | `/feed` | Ranked personalized feed |
| POST | `/feed/refresh` | Invalidate feed cache |
| GET | `/products` | Browse products |
| GET/POST/DELETE | `/saves/:productId` | Wishlist |
| POST | `/interactions/batch` | Analytics events |
| GET | `/users/me` | Profile |
| GET | `/health` | Status |

---

## Feed Ranking

Score = 35% discount + 30% preference match + 20% engagement + 10% popularity + 5% freshness

Badges: 🔥 Trending (high save rate), Hot Deal (50%+ off), Almost Gone (low stock)

---

## App Screens

- **Auth**: Login / Register
- **Onboarding**: Sizes → Brands → Categories
- **Feed**: Full-screen swipeable cards (single tap = buy, double tap = save)
- **Saved**: 2-column grid of wishlist items
- **Profile**: User info + sign out
