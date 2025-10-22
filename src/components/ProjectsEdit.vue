<template>
  <div v-if="loaded">
    <h2 class="h2">Редактировать проект</h2>

    <form @submit.prevent="handleSubmit" class="project-form mt-6">
      <div class="form-field">
        <label for="title">Название:</label>
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
        <label>
          <input type="checkbox" v-model="form.done" />
          Выполнен
        </label>
      </div>

      <div class="form-field">
        <label for="priority">Приоритет:</label>
        <select id="priority" v-model="form.priority" class="select">
          <option>Высокий</option>
          <option>Средний</option>
          <option>Низкий</option>
        </select>
      </div>

      <button type="submit" class="btn btn--solid">Сохранить изменения</button>
      <RouterLink to="/projects" class="btn btn--outline" style="margin-left:8px">Отмена</RouterLink>
    </form>
  </div>

  <div v-else>
    <p class="muted">Загрузка…</p>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

// форма — удобно через reactive (объект)
const form = reactive({
  title: '',
  description: '',
  deadline: '',
  done: false,
  priority: 'Средний'
})

// флаг загрузки — именно ref, не reactive
const loaded = ref(false)

onMounted(() => {
  const projectId = String(route.params.id ?? '')
  const saved = localStorage.getItem('projects')
  const projects = saved ? JSON.parse(saved) : []
  const existing = projects.find(p => String(p.id) === projectId)

  if (!existing) {
    alert('Проект не найден')
    router.push('/projects')
    return
  }

  // заполняем форму
  form.title = existing.title ?? ''
  form.description = existing.description ?? ''
  form.deadline = existing.deadline ?? ''
  form.done = !!existing.done
  form.priority = existing.priority || 'Средний'

  loaded.value = true
})

function handleSubmit() {
  const projectId = String(route.params.id ?? '')
  const saved = localStorage.getItem('projects')
  const projects = saved ? JSON.parse(saved) : []

  const index = projects.findIndex(p => String(p.id) === projectId)
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      done: form.done,
      priority: form.priority
    }
    localStorage.setItem('projects', JSON.stringify(projects))
  }

  router.push('/projects')
}
</script>

<style scoped>
.project-form { max-width: 480px; }
.form-field { margin-bottom: 1rem; }
.form-field label { display:block; margin-bottom:.3rem; font-weight:600; }
</style>
