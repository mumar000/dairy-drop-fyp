import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth.js'

const ProtectedRoute = ({ allowAdmin = false, allowBoth = false, children }) => {
  const { user, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  // If allowBoth is true, we just show the content
  if (allowBoth) return children ? children : <Outlet />

  // If route is for admins only, and user is not admin -> Go Home
  if (allowAdmin && !isAdmin) return <Navigate to="/" replace />

  // If route is for users (not allowAdmin), but user IS admin -> Go to Admin Dashboard
  if (!allowAdmin && isAdmin) return <Navigate to="/admin" replace />

  // 2. Return children if they exist, otherwise use Outlet
  return children ? children : <Outlet />
}

export default ProtectedRoute