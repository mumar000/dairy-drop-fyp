# Socket.IO Setup For Admin Notifications

This document explains how Socket.IO is added locally for learning and practice in `dairy-drop-fyp`.

## Goal

Socket.IO is used only as a local realtime enhancement for admin notifications.

The real application still works without it because polling remains the fallback.

This means:

- local development can show live admin notifications
- deployed Vercel app may not support the socket server reliably
- refund requests and notifications still work through normal API + polling

## Packages

### Backend

```bash
npm install socket.io
