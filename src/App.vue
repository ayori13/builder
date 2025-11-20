<template>
  <!-- для авторизованных показываем AppShell + контент -->
  <AppShell v-if="isAuthed">
    <RouterView />
  </AppShell>

  <!-- страница логина и прочие гостевые без шапки -->
  <RouterView v-else />
</template>

<script setup>
import { computed } from "vue"
import { useRoute, RouterView } from "vue-router"
import AppShell from "@/components/AppShell.vue"
import { currentUser } from "@/composables/useAuth"

const route = useRoute()

const isAuthed = computed(() => {
  return !!currentUser.value && route.name !== "Login"
})
</script>
