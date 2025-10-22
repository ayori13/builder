<script setup>
import { ref, onMounted } from 'vue'
const isDark = ref(false)
onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})
function toggle(){
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <button class="btn btn--outline" @click="toggle">
    {{ isDark ? 'Тёмная' : 'Светлая' }} тема
  </button>
</template>
