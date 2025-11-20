<template>
  <div class="container sp-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="h2">Список дефектов / проектов</h2>

      <div class="flex gap-2">
        <button class="btn btn--outline" @click="exportCSV">Экспорт в CSV</button>

        <button
          v-if="canCreate"
          class="btn btn--solid"
          @click="$router.push('/projects/add')"
        >
          Добавить новый
        </button>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters card card--surface">
      <div class="filters-row">

        <div class="filters-item">
          <label class="label">Поиск</label>
          <input v-model="search" class="input" placeholder="По названию или описанию..." />
        </div>

        <div class="filters-item">
          <label class="label">Приоритет</label>
          <select v-model="priority" class="input">
            <option value="all">Все</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>

        <div class="filters-item">
          <label class="label">Статус</label>
          <select v-model="status" class="input">
            <option value="all">Все</option>
            <option value="created">Новый</option>
            <option value="in_progress">В работе</option>
            <option value="checking">На проверке</option>
            <option value="done">Завершён</option>
            <option value="cancelled">Отменён</option>
          </select>
        </div>

        <div class="filters-item">
          <label class="label">Сортировка</label>
          <select v-model="sort" class="input">
            <option value="created_desc">Сначала новые</option>
            <option value="created_asc">Сначала старые</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-wrapper mt-4">
      <table class="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Дата</th>
            <th style="width:120px;"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td class="text-wrap">{{ p.items?.[0]?.title || '—' }}</td>
            <td>
              <span :class="['badge', priorityClass(p.items?.[0]?.priority)]">
                {{ priorityLabel(p.items?.[0]?.priority) }}
              </span>
            </td>
            <td>
              <span :class="['badge', statusClass(p.status)]">
                {{ statusLabel(p.status) }}
              </span>
            </td>
            <td>{{ formatDate(p.createdAt) }}</td>

            <td>
              <div class="actions">
                <button class="btn btn--xs btn--outline"
                        @click="$router.push('/projects/' + p.id)">
                  Открыть
                </button>

                <button v-if="canEdit(p)"
                        class="btn btn--xs btn--solid"
                        @click="$router.push('/projects/' + p.id + '/edit')">
                  Править
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td colspan="5" class="muted">Ничего не найдено</td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { currentUser } from "@/composables/useAuth"

const orders = ref([])
const search = ref("")
const priority = ref("all")
const status = ref("all")
const sort = ref("created_desc")

const token = localStorage.getItem("auth_token")

async function loadOrders() {
  const res = await fetch("/api/v1/orders", {
    headers: { Authorization: `Bearer ${token}` }
  })

  const data = await res.json()
  if (data.success) orders.value = data.data
}

onMounted(loadOrders)

// Фильтрация
const filtered = computed(() => {
  let list = [...orders.value]

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(o =>
      JSON.stringify(o).toLowerCase().includes(q)
    )
  }

  if (priority.value !== "all") {
    list = list.filter(o => o.items?.[0]?.priority === priority.value)
  }

  if (status.value !== "all") {
    list = list.filter(o => o.status === status.value)
  }

  if (sort.value === "created_desc") {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else {
    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  return list
})

// Роли
const canCreate = computed(() =>
  ["manager", "engineer"].includes(currentUser.value?.roles?.[0])
)

const canEdit = (p) =>
  currentUser.value?.id === p.userId ||
  currentUser.value?.roles?.includes("manager")

// Форматтеры
const formatDate = (d) =>
  new Date(d).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })

const priorityLabel = (p) => ({
  high: "Высокий",
  medium: "Средний",
  low: "Низкий"
}[p] || "—")

const statusLabel = (s) => ({
  created: "Новый",
  in_progress: "В работе",
  checking: "На проверке",
  done: "Завершён",
  cancelled: "Отменён"
}[s] || "—")

// CSS классы
const priorityClass = (p) => ({
  high: "badge--open",
  medium: "badge--progress",
  low: "badge--new"
}[p])

const statusClass = (s) => ({
  created: "badge--new",
  in_progress: "badge--progress",
  checking: "badge--review",
  done: "badge--done",
  cancelled: "badge--open"
}[s])

// Экспорт CSV
function exportCSV() {
  const rows = filtered.value.map(o => ({
    id: o.id,
    title: o.items?.[0]?.title,
    priority: o.items?.[0]?.priority,
    status: o.status,
    createdAt: o.createdAt
  }))

  const csv = [
    "ID;Название;Приоритет;Статус;Дата",
    ...rows.map(r => `${r.id};${r.title};${r.priority};${r.status};${r.createdAt}`)
  ].join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "orders.csv"
  a.click()

  URL.revokeObjectURL(url)
}
</script>
