import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)

// Демо-пользователи (для назначения исполнителя и логина)
const USERS = [
  { email: 'engineer@example.com', role: 'engineer', name: 'Инженер Иванов', password: '1234' },
  { email: 'manager@example.com', role: 'manager', name: 'Менеджер Петров', password: '1234' },
  { email: 'director@example.com', role: 'director', name: 'Руководитель Сидоров', password: '1234' }
]

export function useAuth() {
  const router = useRouter()

  function login(email, password) {
    const acc = USERS.find(u => u.email === email)
    if (!acc || acc.password !== password) {
      return { success: false, message: 'Неверный логин или пароль' }
    }
    user.value = { email: acc.email, role: acc.role, name: acc.name }
    localStorage.setItem('user', JSON.stringify(user.value))
    return { success: true }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  function engineers() {
    return USERS.filter(u => u.role === 'engineer')
  }

  return { user, login, logout, engineers }
}
