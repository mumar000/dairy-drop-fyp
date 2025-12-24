import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Cart from './pages/Cart.jsx'
// import ProductDetail from './pages/ProductDetail.jsx'
// import Orders from './pages/Orders.jsx'
// import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import NavBar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import { Toaster } from "sonner"
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Products from './pages/Products.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import ProductDetails from './pages/ProductDetails.jsx'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors={true} />

        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/products' element={<Products />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/products/:productId' element={<ProductDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                {<Cart />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                {<Checkout />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {<Orders />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                {/* <AdminDashboard /> */}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

