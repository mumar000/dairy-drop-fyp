import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Provider, useSelector } from "react-redux"
import { Toaster } from "sonner"
import { store } from "./store/index.js"
import AdminLogin from "./pages/admin/AdminLogin.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Products from "./pages/Products.jsx"
import Profile from "./pages/Profile.jsx"
import ProductDetails from "./pages/ProductDetails.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Cart from "./pages/Cart.jsx"
import Checkout from "./pages/Checkout.jsx"
import Orders from "./pages/Orders.jsx"
import NavBar from "./components/NavBar.jsx"
import { useSyncCartWithStore } from "./hooks/useSyncCartWithStore.js"

// Wrapper component to load cart data
function AppContent() {
  const userInfo = useSelector((s) => s.auth.userInfo)
  const { cartData, isLoading, isError } = useSyncCartWithStore()

  if (userInfo?.token && (isLoading || isError)) {
    // We can return a loading state here if needed
    // For now, just render the components and let the cart load in the background
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar /><Home /></>} />
        <Route path="/about" element={<><NavBar /><About /></>} />
        <Route path="/contact" element={<><NavBar /><Contact /></>} />
        <Route path="/login" element={<><NavBar /><Login /></>} />
        <Route path="/register" element={<><NavBar /><Register /></>} />
        <Route path="/products" element={<><NavBar /><Products /></>} />
        <Route path="/products/:productId" element={<><NavBar /><ProductDetails /></>} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <><NavBar /><Cart /></>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <><NavBar /><Checkout /></>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <><NavBar /><Orders /></>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <><NavBar /><Profile /></>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors={true} />
        <AppContent />
      </BrowserRouter>
    </Provider>
  )
}
