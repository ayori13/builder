import { ref } from 'vue'

const user = ref({
  name: 'Demo User',
  role: localStorage.getItem('role') || 'admin' // 'admin' | 'viewer'
})

export function useAuth() {
  function setRole(role) {
    user.value.role = role
    localStorage.setItem('role', role)
  }

  return { user, setRole }
}
