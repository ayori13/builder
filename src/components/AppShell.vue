<template>
  <header class="app-header">
    <div class="container flex items-center justify-between py-4">

      <div class="flex items-center gap-4">
        <h1 class="h3" style="cursor:pointer" @click="$router.push('/projects')">
          Панель управления
        </h1>

        <span class="muted">({{ currentUser?.roles?.[0] }})</span>
      </div>

      <div class="flex items-center gap-4">

        <!-- Тема -->
        <ThemeToggle />

        <!-- Выход -->
        <button class="btn btn--outline" @click="logoutUser">
          Выйти
        </button>

      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>
</template>

<script setup>
import ThemeToggle from "@/components/ThemeToggle.vue"
import { currentUser, logout } from "@/composables/useAuth"

function logoutUser() {
  logout()
}
</script>
