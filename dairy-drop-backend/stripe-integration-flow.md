# Stripe Integration Flow

This document explains the current Stripe integration in `dairy-drop-fyp` from local development to deployed environments.

## Goal

The project supports:

- `COD` orders
- `Stripe Checkout` one-time payments
- Stripe payment verification through:
  - webhook
  - frontend success-return fallback
- admin-triggered refunds

The app keeps MongoDB as the source of truth for:

- products
- cart
- orders
- stock

Stripe is used for:

- collecting card payments
- returning checkout session metadata
- storing payment intent references
- issuing refunds

## Current Architecture

### Product and Cart

Products are stored only in MongoDB.

We do not create Stripe Products for every product uploaded by admin.

At checkout:

- backend reads the user's cart from MongoDB
- backend validates product existence, active status, and stock
- backend builds Stripe `line_items` dynamically

### Order Lifecycle

For Stripe:

1. User selects `Stripe` on checkout.
2. Backend creates or reuses a pending unpaid Stripe order.
3. Backend creates a Stripe Checkout Session.
4. User pays on Stripe-hosted checkout.
5. Order is finalized by:
   - webhook, or
   - frontend success redirect verification fallback

For COD:

1. User selects `COD`.
2. Backend places order directly.
3. Cart is cleared immediately.

## Important Files

### Backend

- `dairy-drop-backend/src/controllers/payment.controller.js`
- `dairy-drop-backend/src/controllers/webhook.controller.js`
- `dairy-drop-backend/src/routes/payment.route.js`
- `dairy-drop-backend/src/models/order.model.js`
- `dairy-drop-backend/src/app.js`
- `dairy-drop-backend/api/index.js`

### Frontend

- `dairy-drop-frontend/src/pages/Checkout.jsx`
- `dairy-drop-frontend/src/pages/Orders.jsx`
- `dairy-drop-frontend/src/api/paymentApi.js`
- `dairy-drop-frontend/src/api/adminApi.js`
- `dairy-drop-frontend/src/components/admin/OrderDetailModal.jsx`

## Stripe Checkout Flow

### 1. Checkout Session Creation

In `payment.controller.js`:

- backend gets authenticated user
- backend loads cart from MongoDB
- backend recalculates totals server-side
- backend creates Stripe line items
- backend creates or reuses a pending Stripe order
- backend creates a Stripe Checkout Session

Metadata added to Stripe session:

- `orderId`
- `userId`

This lets Stripe events map back to MongoDB orders.

### 2. Duplicate Prevention

The integration prevents duplicate Stripe orders using:

- pending order reuse
- `stripeCheckoutFingerprint`
- Stripe idempotency key

Fingerprint is based on:

- address
- cart items
- quantities
- totals
- success/cancel URLs

If the same checkout is retried:

- existing Stripe session is reused

If checkout data changes:

- new Stripe session is created

## Payment Finalization

### Primary Path: Webhook

Stripe sends events to:

- `/api/webhooks/stripe`

Webhook verifies Stripe signature using:

- `STRIPE_WEBHOOK_SECRET`

On successful payment:

- order is marked `Paid`
- `stripePaymentIntentId` is saved
- stock is decremented
- shipping address is saved if new
- cart is cleared

### Fallback Path: Success Redirect Verification

Success URL includes:

- `session_id={CHECKOUT_SESSION_ID}`
- `stripe=success`

When frontend lands on `/orders`, it:

1. reads `session_id` from query params
2. calls backend verify endpoint
3. backend retrieves session from Stripe
4. if session is paid, backend finalizes the order

This protects against missed or delayed webhooks.

## Payment Failure Handling

Stripe Checkout usually keeps the user on Stripe page if card is declined.

Possible failure scenarios:

- customer cancels checkout
- checkout session expires
- async payment fails

The system can mark the order failed using:

- cancel return flow
- Stripe failure-related events

Possible payment statuses:

- `Unpaid`
- `Paid`
- `Failed`
- `RefundPending`
- `Refunded`
- `RefundFailed`

## Refund Flow

Refunds are admin-controlled.

### Refund Rules

- only Stripe orders can be refunded
- only `Paid` Stripe orders should be refunded
- refund uses `stripePaymentIntentId`

### Refund Process

1. Admin opens order details modal.
2. Refund button appears only for paid Stripe orders.
3. Frontend calls refund endpoint.
4. Backend creates Stripe refund.
5. Order status becomes:
   - `RefundPending`, or
   - `Refunded`
6. Stripe refund events can keep local status synced.

## Local Development Flow

### Required Services

1. Run backend
2. Run frontend
3. Run Stripe CLI forwarding

### Stripe CLI Command

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

Stripe CLI prints a webhook secret:

```bash
whsec_...
```

That secret must be placed in local backend `.env`.

### Local Env Example

Backend:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_cli
STRIPE_CURRENCY=pkr
CLIENT_URL_SUCCESS=http://localhost:5174/orders
CLIENT_URL_CANCEL=http://localhost:5174/cart
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Deployed Test Mode Flow

For deployed testing:

- backend and frontend use deployed URLs
- Stripe still uses `test` keys
- webhook secret must come from Stripe Dashboard webhook destination

Important:

- do not use Stripe CLI webhook secret on deployed backend
- use test-mode dashboard webhook secret for deployed endpoint

Example deployed webhook URL:

```text
https://your-backend-domain/api/webhooks/stripe
```

For deployed test mode, the redirect URLs must point to your deployed frontend, not localhost.

Example:

```env
CLIENT_URL_SUCCESS=https://your-frontend-domain/orders
CLIENT_URL_CANCEL=https://your-frontend-domain/orders
```

Recommended:

- use `/orders` as success URL
- use `/orders` as cancel URL too, with query params such as `stripe=cancelled`

Reason:

- Stripe Checkout often keeps the customer on the Stripe-hosted page when a card is declined
- cancel URL is mainly used when the customer explicitly leaves checkout
- sending both success and cancel paths to `/orders` gives a single place to verify payment, show failure/cancel state, and refresh order data

## Production Flow

When moving to real production:

1. switch Stripe Dashboard to live mode
2. use `pk_live_...`
3. use `sk_live_...`
4. create live webhook endpoint in Stripe Dashboard
5. use live `whsec_...`
6. redeploy frontend and backend

Production uses:

- live publishable key
- live secret key
- live webhook secret

Never mix:

- local CLI secret
- deployed test webhook secret
- live webhook secret

## Why `api/index.js` Matters on Vercel

The backend is deployed as a Vercel serverless function.

`api/index.js` must reuse the same Express app from `src/app.js`.

This ensures deployed backend has the same routes as local:

- `/api/payments`
- `/api/webhooks`
- normal API routes

Without that, live can miss Stripe routes even if local works.

## Summary

The Stripe integration now supports:

- secure Stripe Checkout payments
- pending order creation before payment
- duplicate checkout protection
- webhook-based finalization
- frontend success fallback verification
- cart clearing after successful payment
- stock reduction after successful payment
- admin refunds for Stripe orders

## Recommended Refund Product Flow

For this project, a better business flow than direct admin refund is:

1. User opens `My Orders`
2. User clicks `Request Refund` on eligible Stripe orders
3. A modal opens and asks for refund reason
4. Order moves into a review state such as:
   - `RefundRequested`
5. Admin receives a notification
6. Admin reviews the request
7. Admin either:
   - approves refund and Stripe refund is created
   - rejects refund request
8. If approved and Stripe refund succeeds, order moves to:
   - `Refunded`

Suggested order/payment states for this approach:

- `Paid`
- `RefundRequested`
- `RefundPending`
- `Refunded`
- `RefundFailed`
- `RefundRejected`

Recommended UI tabs:

User orders page:

- `Pending`
- `Shipped`
- `Delivered`
- `Cancelled`
- `Refunded`

Admin orders view:

- `All`
- `Pending`
- `Processing`
- `Refund Requests`
- `Refunded`

Notification idea:

- when a user requests a refund, create a notification record in backend
- admin bell count increments
- dropdown/panel shows unread notifications
- optional realtime delivery can be added with Socket.IO or another realtime channel

Important implementation note:

- Socket.IO is a good fit only if your deployment supports long-lived realtime connections
- if the backend stays on Vercel serverless functions, Socket.IO is usually not the best choice
- for Vercel, a managed realtime service or polling is usually a more reliable choice

This setup is suitable for:

- local development
- deployed test mode
- later migration to live mode
