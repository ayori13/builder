<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'

const route = useRoute()
const router = useRouter()
const { user, engineers } = useAuth()
const { byId, update, STATUSES, setStatus, canSetStatus } = useProjects()

const form = ref(null)
const error = ref('')

onMounted(() => {
  const item = byId(route.params.id)
  if (!item) { error.value = 'Проект не найден'; return }
  form.value = { ...item }
})

function save() {
  if (!form.value) return
  if (user.value?.role === 'manager') {
    update(form.value.id, {
      title: form.value.title,
      description: form.value.description,
      deadline: form.value.deadline,
      priority: form.value.priority,
      assignee: form.value.assignee,
      status: form.value.status
    })
  } else if (user.value?.role === 'engineer') {
    const current = byId(form.value.id)
    if (canSetStatus(current.status, form.value.status)) {
      setStatus(form.value.id, form.value.status)
      update(form.value.id, {
        title: form.value.title,
        description: form.value.description,
        deadline: form.value.deadline,
        priority: form.value.priority
      })
    } else {
      alert('Недопустимый переход статуса')
      return
    }
  }
  router.push('/projects')
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Редактировать проект</h2>

    <p v-if="error" class="muted" style="color:var(--danger)">{{ error }}</p>
    <form v-else-if="form" class="project-form" @submit.prevent="save">
      <div class="form-field">
        <label for="title">Название</label>
        <input id="title" v-model="form.title" class="input" type="text" required />
      </div>

      <div class="form-field">
        <label for="description">Описание</label>
        <textarea id="description" v-model="form.description" class="input" rows="3"></textarea>
      </div>

      <div class="form-field">
        <label for="deadline">Дедлайн</label>
        <input id="deadline" v-model="form.deadline" class="input" type="date" />
      </div>

      <div class="form-field">
        <label for="priority">Приоритет</label>
        <select id="priority" v-model="form.priority" class="select">
          <option>Высокий</option>
          <option>Средний</option>
          <option>Низкий</option>
        </select>
      </div>

      <!-- Исполнитель -->
      <div class="form-field">
        <label for="assignee">Исполнитель</label>
        <template v-if="user?.role === 'manager'">
          <select id="assignee" v-model="form.assignee" class="select">
            <option value="">— не назначен —</option>
            <option v-for="e in engineers()" :key="e.email" :value="e.email">
              {{ e.name }} ({{ e.email }})
            </option>
          </select>
        </template>
        <template v-else>
          <input class="input" :value="form.assignee || '—'" disabled />
        </template>
      </div>

      <!-- Статус -->
      <div class="form-field">
        <label for="status">Статус</label>
        <select id="status" v-model="form.status" class="select">
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
        <p class="muted" style="margin-top:6px">
          Допустимые переходы: Новая → В работе → На проверке → Закрыта / Отменена
        </p>
      </div>

      <div class="row" style="gap:8px">
        <button type="submit" class="btn btn--solid">Сохранить</button>
        <RouterLink to="/projects" class="btn btn--outline">Отмена</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.project-form { max-width: 560px }
.form-field { margin-bottom: 12px }
</style>
