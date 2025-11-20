<template>
  <div class="container sp-8">
    <h2 class="h2 mb-2">Добавить дефект / проект</h2>
    <p class="muted mb-4">
      Создание новой записи с приоритетом, сроком и ответственным.
    </p>

    <form class="card" style="padding:24px;" @submit.prevent="handleSubmit">
      <div class="form-field">
        <label class="label" for="title">Название</label>
        <input
          id="title"
          v-model="title"
          class="input"
          required
          placeholder="Например, Трещина в стене"
        />
      </div>

      <div class="form-field">
        <label class="label" for="description">Описание</label>
        <textarea
          id="description"
          v-model="description"
          class="textarea"
          placeholder="Кратко опишите проблему"
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
          :placeholder="assigneePlaceholder"
        />
        <p class="muted" style="font-size:12px; margin-top:4px;">
          Инженер обычно указывает себя, менеджер — назначает исполнителя.
        </p>
      </div>

      <div class="form-field">
        <span class="label">Статус по умолчанию</span>
        <span class="badge badge--new">Новый</span>
      </div>

      <div style="display:flex; gap:8px; margin-top:8px;">
        <button type="submit" class="btn btn--solid">
          Создать
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

const title = ref('')
const description = ref('')
const deadline = ref('')
const priority = ref('medium')
const assignee = ref('')

const assigneePlaceholder = computed(() => {
  if (user.value?.role === 'manager') return 'Укажите инженера / исполнителя'
  if (user.value?.role === 'engineer') return 'Например, ваша фамилия или email'
  return 'Ответственный за задачу'
})

function handleSubmit() {
  if (!title.value.trim()) return

  const now = new Date().toISOString()
  const currentUser = user.value || {}

  const projects = JSON.parse(localStorage.getItem('projects') || '[]')

  const project = {
    id: Date.now().toString(),
    title: title.value.trim(),
    description: description.value.trim(),
    deadline: deadline.value || '',
    priority: priority.value,
    done: false,
    status: 'new',
    assignee: assignee.value.trim() || currentUser.name || currentUser.email || '',
    authorRole: currentUser.role || 'unknown',
    createdAt: now,
    updatedAt: now
  }

  projects.push(project)
  localStorage.setItem('projects', JSON.stringify(projects))

  router.push('/projects')
}
</script>
