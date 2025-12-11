import { useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  const token = useSelector((state) => state.auth.userInfo?.token)

  let user = null
  if (token) {
    try {
      const decode = jwtDecode(token)
      user = { id: decode.id, role: decode.role }
    } catch (e) {
      console.error('Invalid token', e)
      user = null
    }
  }

  const role = user?.role
  const isAdmin = role === 'admin'
  const isGuest = !user

  const hasRoleOrHigher = (targetRole) => {
    const hierarchy = { user: 1, admin: 2 }
    const current = hierarchy[role] || 0
    const target = hierarchy[targetRole] || 0
    return current >= target
  }

  return { user, role, isAdmin, isGuest, hasRoleOrHigher }
}

export default useAuth

