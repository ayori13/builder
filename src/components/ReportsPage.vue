<script setup>
import { computed } from 'vue'
defineOptions({ name: 'ReportsPage' })

const saved = localStorage.getItem('projects')
const projects = saved ? JSON.parse(saved) : []

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const total = projects.length
  const done = projects.filter(p => p.done).length
  const open = total - done
  const overdue = projects.filter(p => !p.done && p.deadline && p.deadline < today).length
  return { total, done, open, overdue }
})

const chips = computed(() => ([
  { label: 'Выполнено', class: 'badge--done', value: stats.value.done },
  { label: 'Не выполнено', class: 'badge--open', value: stats.value.open },
  { label: 'Просрочено', class: 'badge--open', value: stats.value.overdue },
]))
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Отчёты по проектам</h2>

    <div v-if="stats.total">
      <div class="card" style="padding:20px; margin-bottom:20px;">
        <p><strong>Всего проектов:</strong> {{ stats.total }}</p>
        <p><strong>Выполнено:</strong> {{ stats.done }}</p>
        <p><strong>Не выполнено:</strong> {{ stats.open }}</p>
        <p><strong>Просрочено:</strong> {{ stats.overdue }}</p>
      </div>

      <div class="card" style="padding:20px;">
        <h3 class="h2 mb-4">Статусы</h3>
        <div class="row">
          <span v-for="c in chips" :key="c.label" class="badge" :class="c.class">
            {{ c.label }} — {{ c.value }}
          </span>
        </div>
      </div>
    </div>

    <p v-else class="muted">Нет данных для отчёта</p>
  </div>
</template>
