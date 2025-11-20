<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Отчётность</h2>

    <div class="card card--surface p-4">

      <div class="filters-row">
        <div class="filters-item">
          <label>Статус</label>
          <select v-model="status" class="input">
            <option value="all">Все</option>
            <option value="created">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="checking">На проверке</option>
            <option value="done">Завершённые</option>
            <option value="cancelled">Отменённые</option>
          </select>
        </div>

        <div class="filters-item">
          <label>Приоритет</label>
          <select v-model="priority" class="input">
            <option value="all">Все</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="h3 mb-2">Всего записей: {{ filtered.length }}</h3>

        <ul class="mt-4">
          <li v-for="p in filtered" :key="p.id" class="mb-1">
            <strong>{{ p.items?.[0]?.title }}</strong> — {{ statusLabel(p.status) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

const orders = ref([])
const status = ref("all")
const priority = ref("all")

const token = localStorage.getItem("auth_token")

async function loadOrders() {
  const res = await fetch("/api/v1/orders", {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (data.success) orders.value = data.data
}

onMounted(loadOrders)

const filtered = computed(() => {
  let list = [...orders.value]

  if (status.value !== "all") {
    list = list.filter(o => o.status === status.value)
  }

  if (priority.value !== "all") {
    list = list.filter(o => o.items?.[0]?.priority === priority.value)
  }

  return list
})

const statusLabel = s => ({
  created: "Новый",
  in_progress: "В работе",
  checking: "На проверке",
  done: "Завершён",
  cancelled: "Отменён"
}[s] || "—")
</script>
