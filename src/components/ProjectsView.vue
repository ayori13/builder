<template>
  <div class="container sp-8" v-if="project">
    <h2 class="h2 mb-4">Просмотр дефекта / проекта</h2>

    <div class="card card--surface p-4">
      <h3 class="h3 mb-2">{{ project.items?.[0]?.title }}</h3>

      <p class="muted mb-4">{{ project.items?.[0]?.description }}</p>

      <div class="mb-3">
        <strong>Приоритет:</strong>
        <span :class="['badge', priorityClass(project.items?.[0]?.priority)]">
          {{ priorityLabel(project.items?.[0]?.priority) }}
        </span>
      </div>

      <div class="mb-3">
        <strong>Статус:</strong>
        <span :class="['badge', statusClass(project.status)]">
          {{ statusLabel(project.status) }}
        </span>
      </div>

      <div class="mb-3">
        <strong>Создан:</strong> {{ formatDate(project.createdAt) }}
      </div>

      <div class="mb-3" v-if="project.updatedAt">
        <strong>Обновлён:</strong> {{ formatDate(project.updatedAt) }}
      </div>

      <!-- Управление -->
      <div class="actions mt-6">

        <!-- Редактировать -->
        <button
          v-if="canEdit"
          class="btn btn--outline"
          @click="$router.push(`/projects/${project.id}/edit`)"
        >
          Редактировать
        </button>

        <!-- Обновление статуса -->
        <select
          v-if="canEdit"
          v-model="newStatus"
          class="input"
          style="max-width:180px;"
        >
          <option value="created">Новый</option>
          <option value="in_progress">В работе</option>
          <option value="checking">На проверке</option>
          <option value="done">Завершён</option>
          <option value="cancelled">Отменён</option>
        </select>

        <button
          v-if="canEdit"
          class="btn btn--solid"
          @click="updateStatus"
        >
          Применить
        </button>

        <!-- Удалить — только свой -->
        <button
          v-if="canDelete"
          class="btn btn--danger"
          @click="deleteProject"
        >
          Удалить
        </button>

        <button class="btn btn--outline" @click="$router.push('/projects')">
          Назад
        </button>
      </div>
    </div>
  </div>

  <div v-else class="container sp-8">
    <p class="muted">Загрузка...</p>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import { currentUser } from "@/composables/useAuth"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const project = ref(null)
const newStatus = ref("created")

const token = localStorage.getItem("auth_token")

async function loadProject() {
  const res = await fetch(`/api/v1/orders/${route.params.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()

  if (!data.success) {
    router.push("/projects")
  } else {
    project.value = data.data
    newStatus.value = data.data.status
  }
}

onMounted(loadProject)

async function updateStatus() {
  const res = await fetch(`/api/v1/orders/${project.value.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus.value })
  })

  const data = await res.json()
  if (data.success) {
    project.value = data.data
  }
}

async function deleteProject() {
  const ok = confirm("Удалить запись?")
  if (!ok) return

  const res = await fetch(`/api/v1/orders/${project.value.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })

  const data = await res.json()

  if (data.success) {
    router.push("/projects")
  }
}

const canEdit = computed(() =>
  currentUser.value?.roles?.includes("manager") ||
  currentUser.value?.id === project.value?.userId
)

const canDelete = computed(() =>
  currentUser.value?.id === project.value?.userId
)

// Форматирование и классы
const formatDate = d =>
  new Date(d).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })

const priorityLabel = p => ({ high: "Высокий", medium: "Средний", low: "Низкий" }[p] || "—")
const statusLabel = s => ({
  created: "Новый",
  in_progress: "В работе",
  checking: "На проверке",
  done: "Завершён",
  cancelled: "Отменён"
}[s] || "—")

const priorityClass = p => ({ high: "badge--open", medium: "badge--progress", low: "badge--new" }[p])
const statusClass = s => ({
  created: "badge--new",
  in_progress: "badge--progress",
  checking: "badge--review",
  done: "badge--done",
  cancelled: "badge--open"
}[s])
</script>
