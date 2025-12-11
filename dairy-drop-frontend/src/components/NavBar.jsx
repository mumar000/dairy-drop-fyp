import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/auth/authSlice.js'

export default function NavBar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((s) => s.auth.userInfo)

  const onLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: 16 }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Dairy Drop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        {userInfo?.token ? (
          <>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}

