import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/api/authApi.js'
import { setCredentials } from '@/features/auth/authSlice.js'

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading } ] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ emailOrPhone, password }).unwrap()
      dispatch(setCredentials({ token: res.token, user: res.user }))
      navigate('/')
    } catch (e) {
      alert(e?.data?.message || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '48px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Email or Phone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={isLoading} type="submit">{isLoading ? '...' : 'Login'}</button>
      </form>
    </div>
  )
}

