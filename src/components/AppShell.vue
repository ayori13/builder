<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'
import { User, Settings, Wrench } from 'lucide-vue-next'

const { user, logout } = useAuth()

const roleIcon = {
  engineer: Wrench,
  manager: Settings,
  director: User
}
</script>

<template>
  <header style="position:sticky;top:0;z-index:40;border-bottom:1px solid var(--header-border);
                 backdrop-filter:saturate(180%) blur(8px); background:var(--header-bg)">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;">
      <div class="h1">Мои проекты</div>

      <nav class="row">
        <RouterLink class="btn btn--outline" to="/projects">Список</RouterLink>
        <RouterLink v-if="user?.role !== 'director'" class="btn btn--solid" to="/projects/add">Добавить</RouterLink>
        <RouterLink class="btn btn--outline" to="/reports">Отчёты</RouterLink>
        <ThemeToggle />

        <div v-if="user" class="row" style="margin-left:12px;">
          <component :is="roleIcon[user.role]" size="18" />
          <span style="font-weight:600;">{{ roleLabel(user.role) }}</span>
          <button @click="logout" class="btn btn--danger" style="margin-left:6px;">Выйти</button>
        </div>
      </nav>
    </div>
  </header>

  <main class="container sp-8">
    <slot />
  </main>
</template>

<script>
export default {
  methods: {
    roleLabel(role) {
      switch (role) {
        case 'engineer': return 'Инженер'
        case 'manager': return 'Менеджер'
        case 'director': return 'Руководитель'
        default: return ''
      }
    }
  }
}
</script>
