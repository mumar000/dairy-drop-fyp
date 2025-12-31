# 🥛 Dairy Drop | Full-Stack Fresh Dairy Delivery System

### **Project Overview**
**Dairy Drop** is a sophisticated full-stack e-commerce solution specifically engineered to bridge the gap between local organic dairy farms and health-conscious consumers. The platform provides a seamless, digital "farm-to-table" experience, ensuring that perishable dairy essentials like milk, yogurt, and cheese are accessible through a high-performance web interface. Beyond a simple storefront, Dairy Drop incorporates a robust inventory management system, real-time order tracking, and an automated admin ecosystem. It solves the logistical challenge of dairy retail by managing stock levels, calculating real-time taxes, and handling multi-step secure checkouts, all while providing administrators with high-level data visualization to monitor revenue and user growth.

---

## 🚀 Technical Tech Stack

### **Frontend (Client-Side)**
*   **Framework:** React.js (built with Vite for lightning-fast development).
*   **State Management:** Redux Toolkit (centralized global state).
*   **Data Fetching:** RTK Query (provides sophisticated caching, loading states, and automatic re-fetching).
*   **UI/UX Styling:** Tailwind CSS (utility-first CSS for a responsive, modern aesthetic).
*   **Icons & Graphics:** Lucide-React.
*   **Feedback System:** Sonner (modern toast notifications for user actions).
*   **Authentication:** JWT-based logic with persistent storage via `localStorage`.

### **Backend (Server-Side)**
*   **Environment:** Node.js (v20+ ESM).
*   **Framework:** Express.js.
*   **Database:** MongoDB via Mongoose ODM.
*   **Image Hosting:** Cloudinary API (automated cloud storage for product images).
*   **Validation:** Zod (ensures strict type-safety for all incoming API requests).
*   **Security:** 
    *   `bcryptjs` for password hashing.
    *   `Helmet` for setting secure HTTP headers.
    *   `CORS` for cross-origin resource sharing.
    *   `Express-Rate-Limit` to prevent Brute Force/DDoS attacks.

---

## 🌟 Comprehensive Features

### **👤 Customer Experience**
*   **Real-time Search & Filter:** A high-performance search bar with **150ms debouncing** allows users to find products instantly without overwhelming the server.
*   **Advanced Filtering:** Users can drill down by category, price range, and minimum star ratings.
*   **Dynamic Cart Logic:** A sophisticated cart that syncs with the database, validating stock levels before allowing quantity increments.
*   **Address Management:** Users can save multiple shipping addresses and toggle a "Default" location for faster checkouts.
*   **Interactive Reviews:** A dual-purpose review system allowing users to post, edit, and delete their own feedback, which then updates the product's average rating in real-time.
*   **Order Tracking:** A dedicated "My Orders" portal to view history and cancel "Pending" shipments.

### **🛡️ Admin Management Dashboard**
*   **Business Intelligence:** A data-driven home screen showing Total Revenue (calculated from all orders), User Growth, and Inventory Health.
*   **Cloud-Integrated CRUD:** Admins can add new products with **Cloudinary image uploads**. The system automatically handles image compression and multi-file uploads.
*   **Order Workflow:** A management interface to move orders through stages: *Pending → Confirmed → Shipped → Delivered*. 
*   **User Moderation:** Ability to promote users to Admin or deactivate accounts to restrict access.
*   **Review Moderation:** A dedicated queue where admins approve or reject reviews to maintain community standards.

---

## 📂 Project Architecture

### **Frontend Structure**

src/
├── api/             # RTK Query services (Admin, Auth, Products, Orders, Reviews)
├── components/      
│   ├── About/       # Mission, Vision, and Stats UI
│   ├── admin/       # Dashboard Home, Product Forms, Modals
│   ├── Cart/        # Item cards and Summary logic
│   └── Profile/     # Address management and Security tabs
├── features/        # Redux slices for global Auth and Cart states
├── hooks/           # useAuth (JWT decoding), useDebounce (Search optimization)
├── pages/           # Main route views (Home, Shop, Product Detail, Checkout)
└── store/           # Redux Store configuration
```

### **Backend Structure**

api/                 # Vercel Serverless entry points
src/
├── bootstrap/       # Auto-promotes the first user to Admin via .env
├── controllers/     # Modular business logic (Auth, Product, Order, Review)
├── models/          # Mongoose Schemas (Relational-style MongoDB design)
├── routes/          # Express route definitions grouped by feature
├── utils/           # Image uploaders, JWT generators, and Async handlers
└── validators/      # Zod schemas for strict API request validation
```

---

## 🛠️ Installation & Environment Setup

### **1. Prerequisites**
*   Node.js v20 or higher
*   MongoDB Atlas Account
*   Cloudinary Account (for product images)

### **2. Backend Configuration**
1.  Navigate to the `/backend` directory.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file and populate:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
ADMIN_EMAIL=your_admin_email@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```
4.  Run seed script to populate initial products: `npm run seed`.

### **3. Frontend Configuration**
1.  Navigate to the `/frontend` directory.
2.  Install dependencies: `npm install`.
3.  Create a `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🔒 Security Implementations
*   **Data Integrity:** All numeric inputs (Price, Stock) are pre-processed through Zod to prevent database corruption from malformed strings.
*   **Access Control:** Custom `ProtectedRoute` components prevent unauthenticated users or standard users from reaching the Admin Panel.
*   **Password Safety:** Industry-standard `bcryptjs` encryption ensures that even in the event of a database leak, user passwords remain secure.
*   **Rate Limiting:** Protects the `/api/auth` endpoints from brute-force login attempts.

---

## 🚢 Deployment Details

### **Vercel Deployment**
The project is optimized for Vercel. 
*   **Frontend:** Vite handles the build, and `vercel.json` ensures client-side routing works correctly via rewrites.
*   **Backend:** The Express app is wrapped in a Serverless Function (`api/index.js`). The database connection is "cached" to prevent opening too many connections during serverless invocations.

---

## 👨‍💻 Author
**Muhammad Umar**
*   Full-Stack Developer
*   Specializing in React, Node.js, and Scalable E-commerce Architecture.