<template>
  <div class="container sp-8" v-if="loaded">
    <h2 class="h2 mb-2">Редактирование дефекта / проекта</h2>
    <p class="muted mb-4">
      Обновите информацию по задаче. Статус и отметка «выполнено» меняются в
      общем списке.
    </p>

    <form class="card" style="padding:24px;" @submit.prevent="handleSave">
      <div class="form-field">
        <label class="label" for="title">Название</label>
        <input
          id="title"
          v-model="title"
          class="input"
          required
        />
      </div>

      <div class="form-field">
        <label class="label" for="description">Описание</label>
        <textarea
          id="description"
          v-model="description"
          class="textarea"
        />
      </div>

      <div class="form-field">
        <label class="label" for="deadline">Дедлайн</label>
        <input
          id="deadline"
          v-model="deadline"
          type="date"
          class="input"
        />
      </div>

      <div class="form-field">
        <label class="label" for="priority">Приоритет</label>
        <select id="priority" v-model="priority" class="input">
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
      </div>

      <div class="form-field">
        <label class="label" for="assignee">Ответственный</label>
        <input
          id="assignee"
          v-model="assignee"
          class="input"
        />
      </div>

      <p class="muted" style="font-size:12px; margin-top:4px;">
        Текущий статус: <strong>{{ statusLabel }}</strong>.
        Изменяется на странице списка задач.
      </p>

      <div style="display:flex; gap:8px; margin-top:12px;">
        <button type="submit" class="btn btn--solid">
          Сохранить
        </button>
        <button
          type="button"
          class="btn btn--outline"
          @click="router.push('/projects')"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>

  <div v-else class="container sp-8">
    <p class="muted">Загрузка задачи...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loaded = ref(false)
const projectId = route.params.id

const title = ref('')
const description = ref('')
const deadline = ref('')
const priority = ref('medium')
const assignee = ref('')
const status = ref('new')

const statusLabel = computed(() => {
  switch (status.value) {
    case 'in_progress':
      return 'В работе'
    case 'checking':
      return 'На проверке'
    case 'done':
      return 'Завершен'
    default:
      return 'Новый'
  }
})

onMounted(() => {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]')
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    router.push('/projects')
    return
  }

  title.value = project.title || ''
  description.value = project.description || ''
  deadline.value = project.deadline || ''
  priority.value = project.priority || 'medium'
  assignee.value = project.assignee || ''
  status.value = project.status || (project.done ? 'done' : 'new')
  loaded.value = true
})

function handleSave() {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]')
  const index = projects.findIndex(p => p.id === projectId)

  if (index === -1) {
    router.push('/projects')
    return
  }

  const now = new Date().toISOString()

  projects[index] = {
    ...projects[index],
    title: title.value.trim(),
    description: description.value.trim(),
    deadline: deadline.value || '',
    priority: priority.value,
    assignee: assignee.value.trim(),
    updatedAt: now
  }

  localStorage.setItem('projects', JSON.stringify(projects))
  router.push('/projects')
}
</script>
