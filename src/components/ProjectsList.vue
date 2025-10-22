<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
// если используешь роли — раскомментируй:
// import { useAuth } from '@/composables/useAuth'
// const { user } = useAuth()

const projects = ref([])

// фильтры/поиск/сортировка
const q = ref('')
const fPriority = ref('')
const fStatus = ref('') // 'done' | 'open' | ''
const sortBy = ref('createdDesc') // createdDesc | deadlineAsc | deadlineDesc | titleAsc | titleDesc

onMounted(() => {
  const saved = localStorage.getItem('projects')
  projects.value = saved ? JSON.parse(saved) : []
})

function norm(s) {
  return String(s ?? '').toLowerCase().trim()
}

const view = computed(() => {
  let arr = [...projects.value]

  const query = norm(q.value)
  if (query) arr = arr.filter(p => norm(p.title).includes(query))

  if (fPriority.value) arr = arr.filter(p => p.priority === fPriority.value)

  if (fStatus.value === 'done') arr = arr.filter(p => !!p.done)
  else if (fStatus.value === 'open') arr = arr.filter(p => !p.done)

  const byTitle = (a, b) => norm(a.title).localeCompare(norm(b.title))
  const byDeadline = (a, b) => (a.deadline || '').localeCompare(b.deadline || '')
  const byCreatedDesc = (a, b) => Number(b.id) - Number(a.id) // если id = Date.now()

  switch (sortBy.value) {
    case 'titleAsc': arr.sort(byTitle); break
    case 'titleDesc': arr.sort((a,b) => byTitle(b,a)); break
    case 'deadlineAsc': arr.sort(byDeadline); break
    case 'deadlineDesc': arr.sort((a,b) => byDeadline(b,a)); break
    default: arr.sort(byCreatedDesc)
  }
  return arr
})

function removeProject(id) {
  if (!confirm('Удалить проект?')) return
  projects.value = projects.value.filter(p => p.id !== id)
  localStorage.setItem('projects', JSON.stringify(projects.value))
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Список проектов</h2>

    <!-- Панель фильтров -->
    <div class="card" style="padding:16px; margin-bottom:16px; display:flex; gap:12px; flex-wrap:wrap;">
      <input v-model="q" class="input" placeholder="Поиск по названию…" style="max-width:240px" />

      <select v-model="fPriority" class="select" style="max-width:180px">
        <option value="">Все приоритеты</option>
        <option>Высокий</option>
        <option>Средний</option>
        <option>Низкий</option>
      </select>

      <select v-model="fStatus" class="select" style="max-width:180px">
        <option value="">Все статусы</option>
        <option value="done">Выполнен</option>
        <option value="open">Не выполнен</option>
      </select>

      <select v-model="sortBy" class="select" style="max-width:200px">
        <option value="createdDesc">Сначала новые</option>
        <option value="deadlineAsc">Дедлайн ↑</option>
        <option value="deadlineDesc">Дедлайн ↓</option>
        <option value="titleAsc">Название A→Я</option>
        <option value="titleDesc">Название Я→A</option>
      </select>
    </div>

    <!-- Таблица -->
    <div v-if="view.length" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Дедлайн</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th style="width:280px">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in view" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ p.description || '—' }}</td>
            <td>{{ p.deadline || '—' }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'badge--open': p.priority === 'Высокий',
                  'badge--progress': p.priority === 'Средний',
                  'badge--new': p.priority === 'Низкий'
                }"
              >
                {{ p.priority }}
              </span>
            </td>
            <td>
              <span class="badge" :class="p.done ? 'badge--done' : 'badge--open'">
                {{ p.done ? 'Выполнен' : 'Не выполнен' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <RouterLink :to="`/projects/${p.id}`" class="btn btn--outline">Открыть</RouterLink>

                <!-- если будешь включать роли — оберни ниже в v-if="user.role === 'admin'" -->
                <RouterLink :to="`/projects/edit/${p.id}`" class="btn btn--outline">Редактировать</RouterLink>
                <button @click="removeProject(p.id)" class="btn btn--danger">Удалить</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="muted">Проектов пока нет</p>

    <div class="mt-6">
      <RouterLink to="/projects/add" class="btn btn--solid">Добавить новый проект</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.mb-4 { margin-bottom: 1rem; }
</style>
