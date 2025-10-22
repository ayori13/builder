<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuth } from '@/composables/useAuth'
const { user, logout } = useAuth()
</script>

<template>
  <header style="position:sticky;top:0;z-index:40;border-bottom:1px solid var(--header-border);
                 backdrop-filter:saturate(180%) blur(8px); background:var(--header-bg)">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;">
      <div class="h1">Мои проекты</div>

      <nav class="row">
        <RouterLink class="btn btn--outline" to="/projects">Список</RouterLink>
        <RouterLink class="btn btn--solid" to="/projects/add">Добавить</RouterLink>
        <RouterLink class="btn btn--outline" to="/reports">Отчёты</RouterLink>
        <ThemeToggle />

        <button v-if="user" @click="logout" class="btn btn--danger">Выйти</button>
      </nav>
    </div>
  </header>

  <main class="container sp-8">
    <slot />
  </main>
</template>
