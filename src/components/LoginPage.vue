<template>
  <div class="container sp-8" style="max-width:400px;">
    <h2 class="h2 mb-4">Вход в систему</h2>

    <form @submit.prevent="handleLogin" class="card" style="padding:24px;">
      <div class="form-field">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          required
          placeholder="example@example.com"
        />
      </div>

      <div class="form-field">
        <label for="password">Пароль:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="input"
          required
        />
      </div>

      <p class="muted" style="font-size:14px;">
        Демо-аккаунты:<br />
        engineer@example.com<br />
        manager@example.com<br />
        director@example.com<br />
        Пароль: 1234
      </p>

      <button type="submit" class="btn btn--solid mt-2">
        Войти
      </button>

      <p v-if="error" style="color:var(--danger); margin-top:10px;">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { login } from "@/composables/useAuth"

const router = useRouter()
const email = ref("")
const password = ref("")
const error = ref("")

async function handleLogin() {
  error.value = ""
  const result = await login(email.value.trim(), password.value.trim())

  if (result.success) {
    const redirect = router.currentRoute.value.query.redirect || "/projects"
    router.push(redirect)
  } else {
    error.value = result.message
  }
}
</script>
