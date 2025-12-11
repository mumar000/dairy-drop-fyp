import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth.js'

const ProtectedRoute = ({ allowAdmin = false, allowBoth = false }) => {
  const { user, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (allowBoth) return <Outlet />
  if (allowAdmin && !isAdmin) return <Navigate to="/" replace />
  if (!allowAdmin && isAdmin) return <Navigate to="/admin" replace />

  return <Outlet />
}

export default ProtectedRoute

