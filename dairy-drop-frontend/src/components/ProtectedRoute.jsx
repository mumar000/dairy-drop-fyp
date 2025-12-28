import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice.js'
import useAuth from '@/hooks/useAuth.js'

const ProtectedRoute = ({ allowAdmin = false, allowBoth = false, children }) => {
  const { user, isAdmin } = useAuth()
  const dispatch = useDispatch()

  // If route is for admins only, and user is not admin -> Go Home
  if (allowAdmin && (!user || !isAdmin)) return <Navigate to="/" replace />

  // If route is for users (not allowAdmin), but user IS admin -> Log out and redirect to login
  if (!allowAdmin && user && isAdmin) {
    // Dispatch logout action to clear user data
    dispatch(logout());
    // Redirect to login page (not admin login)
    return <Navigate to="/login" replace />
  }

  // If route requires authentication and user is not authenticated
  if (!allowBoth && !user) return <Navigate to="/login" replace />

  // If allowBoth is true, we just show the content
  if (allowBoth) return children ? children : <Outlet />

  // If user is authenticated and not an admin, allow access to user routes
  return children ? children : <Outlet />
}

export default ProtectedRoute