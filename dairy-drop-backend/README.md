# Dairy Drop Backend (Node 20+, ESM, TypeScript)

A clean, scalable Express + TypeScript + Mongoose backend using modern ESM imports and Node 20+.

## Requirements
- Node `>=20`
- MongoDB (local or Atlas)

## Setup
- Copy `.env.example` to `.env` and adjust values
- Install deps: `npm i` (or `pnpm i`/`yarn`)
- Development: `npm run dev`
- Build: `npm run build`
- Run compiled: `npm start`

## Seed Data
- Set `ADMIN_EMAIL` (required) and optionally `ADMIN_PASSWORD`, `ADMIN_PHONE` in `.env`
- Run seeding: `npm run seed`
- If `ADMIN_PASSWORD` is not set, a strong password is generated and printed in the console.

## Scripts
- `dev`: Runs with `tsx` in watch mode
- `build`: Type-checks and emits ESM to `dist`
- `start`: Runs compiled server from `dist`

## File Structure
```
/dairy-drop
├─ src
│  ├─ app.ts                 # Express app setup
│  ├─ server.ts              # Bootstrap + DB + listen
│  ├─ config
│  │  └─ env.ts              # Env loader using dotenv
│  ├─ db
│  │  └─ connection.ts       # Mongoose connection
│  ├─ routes
│  │  ├─ index.ts            # API v1 router
│  │  └─ health.route.ts     # Health check endpoint
│  ├─ middlewares
│  │  ├─ error.middleware.ts
│  │  └─ not-found.middleware.ts
│  └─ utils
│     ├─ api-error.ts
│     └─ async-handler.ts
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ .gitignore
```

## Health Check
- `GET /` → basic API info
- `GET /api/health` → uptime and timestamp

## Notes
- Uses ESM imports throughout (no CommonJS)
- TypeScript configured with `module: NodeNext` for Node 20 ESM
- Add features next: auth (JWT), users, products, orders, reviews

## API Overview
- `POST /api/auth/register` — name, email, phone, password
- `POST /api/auth/login` — emailOrPhone, password; returns JWT
- `GET /api/auth/me` — current user profile
- `PATCH /api/auth/me` — update name/email/phone
- `POST /api/auth/change-password` — oldPassword, newPassword
- `GET /api/auth/addresses` / `POST /api/auth/addresses` / `PATCH /api/auth/addresses/:id` / `DELETE /api/auth/addresses/:id`
- `GET /api/auth/cart` / `POST /api/auth/cart` (productId, quantity) / `PATCH /api/auth/cart` (productId, quantity) / `DELETE /api/auth/cart/:productId` / `DELETE /api/auth/cart`
- `GET /api/products` — filters: q, category, minPrice, maxPrice, inStock, page, limit, sort
- `GET /api/products/:id`
- `POST /api/products` (admin) — create
- `PATCH /api/products/:id` (admin) — update
- `DELETE /api/products/:id` (admin) — delete
- `GET /api/reviews/product/:productId` — list
- `POST /api/reviews` (user) — create/update
- `DELETE /api/reviews/product/:productId` (user) — delete own
- `PATCH /api/reviews/:id/moderate` (admin) — approve/reject
- `POST /api/orders` (user) — place order from cart or items
- `GET /api/orders/me` (user) — my orders
- `GET /api/orders/:id` (user) — my order detail
- `POST /api/orders/:id/cancel` (user) — cancel pending
- `GET /api/orders` (admin) — list all
- `PATCH /api/orders/:id/status` (admin) — update status
- `GET /api/users` (admin), `GET /api/users/:id`, `PATCH /api/users/:id/role`, `DELETE /api/users/:id`

Auth: send `Authorization: Bearer <token>` header for protected routes.

Admin bootstrap: set `ADMIN_EMAIL` in `.env` to auto-promote a matching account on startup.
