<script setup>
import { ref, computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// реактивные данные
const projects = ref([])

onMounted(() => {
  loadProjects()
  // слушаем изменения localStorage — если в другом окне что-то поменялось
  window.addEventListener('storage', loadProjects)
})

function loadProjects() {
  const saved = localStorage.getItem('projects')
  projects.value = saved ? JSON.parse(saved) : []
}

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const total = projects.value.length
  const done = projects.value.filter(p => p.done).length
  const open = total - done
  const overdue = projects.value.filter(
    p => !p.done && p.deadline && p.deadline < today
  ).length
  return { total, done, open, overdue }
})

// данные для графика
const chartData = computed(() => ({
  labels: ['Выполнено', 'Не выполнено', 'Просрочено'],
  datasets: [
    {
      backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
      data: [stats.value.done, stats.value.open, stats.value.overdue],
      borderWidth: 0
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: 'var(--text)',
        font: { size: 14, family: 'var(--font)' }
      }
    },
    title: {
      display: true,
      text: 'Статус проектов',
      color: 'var(--text)',
      font: { size: 18, weight: 'bold' }
    }
  }
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Отчёты по проектам</h2>

    <div v-if="stats.total" class="grid">
      <!-- Карточка статистики -->
      <div class="card" style="padding:20px;">
        <h3 class="h2 mb-2">Сводка</h3>
        <ul style="list-style:none;padding:0;margin:0;font-size:16px;">
          <li><strong>Всего проектов:</strong> {{ stats.total }}</li>
          <li><strong>Выполнено:</strong> {{ stats.done }}</li>
          <li><strong>Не выполнено:</strong> {{ stats.open }}</li>
          <li><strong>Просрочено:</strong> {{ stats.overdue }}</li>
        </ul>
      </div>

      <!-- Диаграмма -->
      <div class="card" style="padding:20px;display:flex;justify-content:center;align-items:center;">
        <Pie :data="chartData" :options="chartOptions" style="max-width:400px;"/>
      </div>
    </div>

    <p v-else class="muted">Нет данных для отчёта</p>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}
</style>
