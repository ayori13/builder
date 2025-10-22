<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Список проектов</h2>

    <div v-if="projects.length">
      <table class="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Дедлайн</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in projects" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ p.description || '—' }}</td>
            <td>{{ p.deadline || '—' }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'badge--new': p.priority === 'Низкий',
                  'badge--progress': p.priority === 'Средний',
                  'badge--open': p.priority === 'Высокий'
                }"
              >
                {{ p.priority }}
              </span>
            </td>
            <td>
              <span
                class="badge"
                :class="{
                  'badge--done': p.done,
                  'badge--open': !p.done
                }"
              >
                {{ p.done ? 'Выполнен' : 'Не выполнен' }}
              </span>
            </td>
            <td>
              <RouterLink :to="`/projects/edit/${p.id}`" class="btn btn--outline">Редактировать</RouterLink>
              <button @click="remove(p.id)" class="btn btn--danger" style="margin-left: 4px;">Удалить</button>
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

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const projects = ref([])

onMounted(() => {
  const saved = localStorage.getItem('projects')
  projects.value = saved ? JSON.parse(saved) : []
})

function remove(id) {
  if (!confirm('Удалить проект?')) return
  projects.value = projects.value.filter(p => p.id !== id)
  localStorage.setItem('projects', JSON.stringify(projects.value))
}
</script>

<style scoped>
.mb-4 { margin-bottom: 1rem; }
.table th, .table td { vertical-align: top; }
</style>
