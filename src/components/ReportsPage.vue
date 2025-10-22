<script setup>
import { ref, computed, onMounted } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// регистрация модулей
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const projects = ref([])

onMounted(() => {
  loadProjects()
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
  const overdue = projects.value.filter(p => !p.done && p.deadline && p.deadline < today).length
  return { total, done, open, overdue }
})

// Pie chart: статус проектов
const pieData = computed(() => ({
  labels: ['Выполнено', 'Не выполнено', 'Просрочено'],
  datasets: [
    {
      backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
      data: [stats.value.done, stats.value.open, stats.value.overdue],
      borderWidth: 0
    }
  ]
}))

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: 'var(--text)', font: { size: 14 } }
    },
    title: {
      display: true,
      text: 'Статус проектов',
      color: 'var(--text)',
      font: { size: 18, weight: 'bold' }
    }
  }
}

// Bar chart: приоритеты проектов
const barData = computed(() => {
  const count = { Высокий: 0, Средний: 0, Низкий: 0 }
  projects.value.forEach(p => {
    if (p.priority && count[p.priority] !== undefined) count[p.priority]++
  })
  return {
    labels: Object.keys(count),
    datasets: [
      {
        label: 'Количество проектов',
        data: Object.values(count),
        backgroundColor: ['#f87171', '#facc15', '#60a5fa']
      }
    ]
  }
})

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Проекты по приоритетам',
      color: 'var(--text)',
      font: { size: 18, weight: 'bold' }
    }
  },
  scales: {
    x: {
      ticks: { color: 'var(--text)' },
      grid: { color: 'var(--border)' }
    },
    y: {
      ticks: { color: 'var(--text)' },
      grid: { color: 'var(--border)' },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Отчёты по проектам</h2>

    <div v-if="stats.total" class="grid">
      <!-- Статистика -->
      <div class="card" style="padding:20px;">
        <h3 class="h2 mb-2">Сводка</h3>
        <ul style="list-style:none;padding:0;margin:0;font-size:16px;">
          <li><strong>Всего проектов:</strong> {{ stats.total }}</li>
          <li><strong>Выполнено:</strong> {{ stats.done }}</li>
          <li><strong>Не выполнено:</strong> {{ stats.open }}</li>
          <li><strong>Просрочено:</strong> {{ stats.overdue }}</li>
        </ul>
      </div>

      <!-- Диаграммы -->
      <div class="card chart-card">
        <Pie :data="pieData" :options="pieOptions" />
      </div>

      <div class="card chart-card">
        <Bar :data="barData" :options="barOptions" />
      </div>
    </div>

    <p v-else class="muted">Нет данных для отчёта</p>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.chart-card {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
