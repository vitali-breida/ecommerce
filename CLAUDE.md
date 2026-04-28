# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (ESLint and TypeScript errors are ignored by next.config.ts)
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a Next.js 15 App Router ecommerce demo using MongoDB, Tailwind CSS v4, and TypeScript.

### Data flow

Pages are **server components** that fetch from local API route handlers (`/api/*`), then pass data as props to **client components** that manage interactive state with `useState`. Pages use `export const dynamic = 'force-dynamic'` and `cache: 'no-cache'` to prevent stale data.

### API routes (`src/app/api/`)

- `db.ts` — MongoDB connection with client/db caching (`cachedClient`, `cachedDb`). Credentials come from `MONGODB_USER` and `MONGODB_PASSWORD` env vars. Database: `ecommerce-nextjs`.
- `GET /api/products` — all products from `products` collection
- `GET /api/products/[id]` — single product
- `GET|POST|DELETE /api/users/[id]/cart` — cart CRUD; `carts` collection stores `{ userId, cartIds: [] }`; uses `$push`/`$pull` MongoDB operators

### Cart state management

Cart is **hybrid**: MongoDB for persistence, `useState` in client components for UI state. `ProductList.tsx` (product listing) and `ShoppingCartList.tsx` (cart page) are both `'use client'` components that mutate via the cart API and sync local state from the response.

User ID is hard-coded as `"2"` — there is no authentication system.

### Path alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_USER` | MongoDB Atlas username |
| `MONGODB_PASSWORD` | MongoDB Atlas password |
| `NEXT_PUBLIC_SITE_URL` | Base URL for server-side fetch calls to local API routes |

Credentials for local development are currently stored in `src/app/mongodb.txt` — they should be moved to `.env.local`.
