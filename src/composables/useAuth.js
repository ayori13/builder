import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)

export function useAuth() {
  const router = useRouter()

  function login(email, password) {
    // Простейшая авторизация
    const accounts = {
      'engineer@example.com': { role: 'engineer', password: '1234' },
      'manager@example.com': { role: 'manager', password: '1234' },
      'director@example.com': { role: 'director', password: '1234' }
    }

    const acc = accounts[email]
    if (!acc || acc.password !== password) {
      return { success: false, message: 'Неверный логин или пароль' }
    }

    user.value = { email, role: acc.role }
    localStorage.setItem('user', JSON.stringify(user.value))
    return { success: true }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  return { user, login, logout }
}
