// src/composables/useAuth.js
import { ref } from "vue"

export const currentUser = ref(null)

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"

// восстанавливаем состояние при загрузке приложения
export function initAuthFromStorage() {
  const token = localStorage.getItem(TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)

  if (token && rawUser) {
    try {
      currentUser.value = JSON.parse(rawUser)
    } catch {
      currentUser.value = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }
}

export function getAuthHeader() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// вход через backend /api/v1/users/login
export async function login(email, password) {
  try {
    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!data.success) {
      return {
        success: false,
        message: data.error || "Неверный логин или пароль"
      }
    }

    const { token, user } = data.data

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    currentUser.value = user

    return { success: true }
  } catch {
    return { success: false, message: "Сервер недоступен, попробуйте позже" }
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  currentUser.value = null
}
