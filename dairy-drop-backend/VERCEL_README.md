# Dairy Drop Backend - Vercel Deployment

## Environment Variables Required for Vercel Deployment

Make sure to set these environment variables in your Vercel project settings:

- `NODE_ENV`: Set to `production`
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret for JWT tokens (must NOT be 'change-me' in production)
- `JWT_EXPIRES_IN`: Token expiration time (e.g., '1d')
- `ADMIN_EMAIL`: Admin user email
- `CORS_ORIGIN`: Allowed origins (comma-separated if multiple)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds
- `RATE_LIMIT_MAX`: Max requests per window
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For image uploads (if needed)

## Important Notes

1. The application will refuse to start in production if `JWT_SECRET` is still set to 'change-me'
2. Make sure your MongoDB connection string is accessible from Vercel's servers
3. The API routes are available under `/api/*` path
4. The root path `/` is also handled by the same serverless function