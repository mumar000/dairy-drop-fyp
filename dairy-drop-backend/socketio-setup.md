# Socket.IO Setup For Admin Notifications

This document explains how Socket.IO is added to `dairy-drop-fyp` only for local learning and practice.

It is not the core production notification system.

The real source of truth remains:

- MongoDB notification records
- normal API endpoints
- polling in admin frontend

Socket.IO is used only as a realtime enhancement during local development.

---

## Why We Are Adding Socket.IO

The project already supports refund-request notifications by saving them in MongoDB and showing them in the admin bell through polling.

That works well in production.

But if we want to practice realtime communication, we can add Socket.IO so that:

- when a user requests a refund
- backend emits a realtime event
- admin frontend receives it immediately
- admin bell updates instantly without waiting for polling interval

This is useful for learning:

- websocket-style communication
- rooms
- emitting events from controllers
- listening to events in React
- combining realtime with persistent database state

---

## Important Practical Rule

For this project:

- MongoDB notification is the real truth
- polling is the production-safe fallback
- Socket.IO is only a local realtime helper

This means if Socket.IO fails in production, nothing important breaks.

---

## Installation

### Backend

Run inside `dairy-drop-backend`:

```bash
npm install socket.io
