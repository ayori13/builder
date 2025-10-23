<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'
import { RouterLink } from 'vue-router'

const { user, engineers } = useAuth()
const { all, remove, setStatus, STATUSES, assign } = useProjects()

const projects = all()

// Фильтры
const q = ref('')
const statusFilter = ref('Все')
const priorityFilter = ref('Все')

const filtered = computed(() => {
  const search = q.value.trim().toLowerCase()
  return projects.value.filter(p => {
    const okSearch = !search || p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    const okStatus = statusFilter.value === 'Все' || p.status === statusFilter.value
    const okPriority = priorityFilter.value === 'Все' || p.priority === priorityFilter.value
    return okSearch && okStatus && okPriority
  })
})

function confirmRemove(id) {
  if (confirm('Удалить проект?')) remove(id)
}

function quickAssign(p, email) {
  if (user.value?.role !== 'manager') return
  assign(p.id, email)
}

function quickSetStatus(p, to) {
  const ok = setStatus(p.id, to)
  if (!ok) alert('Недопустимый переход статуса')
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Проекты</h2>

    <!-- Панель фильтров -->
    <div class="card" style="padding:12px; display:flex; gap:8px; flex-wrap:wrap;">
      <input class="input" v-model="q" placeholder="Поиск по названию..." style="min-width:240px" />

      <select class="select" v-model="statusFilter">
        <option>Все</option>
        <option v-for="s in ['Новая','В работе','На проверке','Закрыта','Отменена']" :key="s">{{ s }}</option>
      </select>

      <select class="select" v-model="priorityFilter">
        <option>Все</option>
        <option>Высокий</option>
        <option>Средний</option>
        <option>Низкий</option>
      </select>

      <div style="flex:1"></div>

      <RouterLink v-if="user?.role !== 'director'" to="/projects/add" class="btn btn--solid">
        Добавить проект
      </RouterLink>
    </div>

    <div class="table-wrap mt-4" v-if="filtered.length">
      <table class="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дедлайн</th>
            <th>Приоритет</th>
            <th>Исполнитель</th>
            <th>Статус</th>
            <th v-if="user?.role !== 'director'">Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>
              <div class="title">{{ p.title }}</div>
              <div class="muted">{{ p.description }}</div>
            </td>
            <td>{{ p.deadline || '—' }}</td>
            <td>{{ p.priority }}</td>

            <!-- Исполнитель -->
            <td>
              <div v-if="p.assignee">{{ p.assignee }}</div>
              <div v-else class="muted">—</div>

              <details v-if="user?.role === 'manager'" style="margin-top:4px;">
                <summary class="link">Назначить</summary>
                <ul style="margin:6px 0 0 0; padding:0; list-style:none;">
                  <li v-for="e in engineers()" :key="e.email" style="margin-top:4px;">
                    <button class="btn btn--sm" @click="quickAssign(p, e.email)">{{ e.name }}</button>
                  </li>
                </ul>
              </details>
            </td>

            <!-- Статус -->
            <td>
              <span class="badge"
                :class="{
                  'badge--new': p.status==='Новая',
                  'badge--progress': p.status==='В работе' || p.status==='На проверке',
                  'badge--done': p.status==='Закрыта',
                  'badge--open': p.status==='Отменена'
                }">{{ p.status }}</span>

              <details v-if="user?.role !== 'director'" style="margin-top:4px;">
                <summary class="link">Изменить</summary>
                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
                  <button v-for="s in STATUSES" :key="s" class="btn btn--sm" @click="quickSetStatus(p, s)">{{ s }}</button>
                </div>
              </details>
            </td>

            <!-- Действия -->
            <td v-if="user?.role !== 'director'">
              <div class="actions">
                <RouterLink :to="`/projects/${p.id}`" class="btn btn--outline">Открыть</RouterLink>
                <RouterLink :to="`/projects/edit/${p.id}`" class="btn btn--outline">Редактировать</RouterLink>
                <button v-if="user?.role === 'manager'" @click="confirmRemove(p.id)" class="btn btn--danger delete-btn">
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="muted">Проектов пока нет</p>
  </div>
</template>

<style scoped>
.table-wrap { overflow:auto }
.table { width:100%; border-collapse:collapse }
th, td { padding:10px; border-bottom:1px solid var(--border) }
.title { font-weight:600 }
.actions { display:flex; gap:6px; flex-wrap:wrap }
.badge { padding:2px 8px; border-radius:999px; font-size:12px }
.badge--new { background:#dbeafe }
.badge--progress { background:#fde68a }
.badge--done { background:#bbf7d0 }
.badge--open { background:#fecaca }
</style>
