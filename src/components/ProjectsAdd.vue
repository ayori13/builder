<template>
  <div class="container sp-8">
    <h2 class="h2">Добавить проект</h2>

    <form @submit.prevent="handleSubmit" class="project-form mt-6">
      <div class="form-field">
        <label for="title">Название проекта:</label>
        <input id="title" v-model="form.title" type="text" required class="input" />
      </div>

      <div class="form-field">
        <label for="description">Описание:</label>
        <textarea id="description" v-model="form.description" rows="3" class="textarea"></textarea>
      </div>

      <div class="form-field">
        <label for="deadline">Дедлайн:</label>
        <input id="deadline" v-model="form.deadline" type="date" class="input" />
      </div>

      <div class="form-field">
        <label for="priority">Приоритет:</label>
        <select id="priority" v-model="form.priority" class="select">
          <option>Высокий</option>
          <option>Средний</option>
          <option>Низкий</option>
        </select>
      </div>

      <button type="submit" class="btn btn--solid">Создать проект</button>
      <RouterLink to="/projects" class="btn btn--outline" style="margin-left: 8px;">Отмена</RouterLink>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const form = reactive({
  title: '',
  description: '',
  deadline: '',
  priority: 'Средний',
  done: false
})

function handleSubmit() {
  const saved = localStorage.getItem('projects')
  const projects = saved ? JSON.parse(saved) : []
  projects.push({
    id: Date.now().toString(),
    ...form
  })
  localStorage.setItem('projects', JSON.stringify(projects))
  router.push('/projects')
}
</script>

<style scoped>
.project-form { max-width: 480px; }
.form-field { margin-bottom: 1rem; }
.form-field label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
</style>
