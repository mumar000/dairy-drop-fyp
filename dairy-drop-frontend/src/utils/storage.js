export function getToken() {
  try {
    const raw = localStorage.getItem('userInfo')
    if (!raw) return null
    const obj = JSON.parse(raw)
    return obj?.token || null
  } catch {
    return null
  }
}

export function saveUserInfo(userInfo) {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function clearUserInfo() {
  localStorage.removeItem('userInfo')
}

