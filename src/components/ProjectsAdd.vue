<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useProjects } from '@/composables/useProjects'

const router = useRouter()
const { user, engineers } = useAuth()
const { add, STATUSES } = useProjects()

const form = ref({
  title: '',
  description: '',
  deadline: '',
  priority: 'Средний',
  assignee: '',
  status: 'Новая'
})

function handleSubmit() {
  // директору форма не показывается (read-only) — см. шаблон
  add(form.value)
  router.push('/projects')
}
</script>

<template>
  <div class="container sp-8">
    <h2 class="h2 mb-4">Создать проект</h2>

    <form class="project-form" @submit.prevent="handleSubmit">
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

      <!-- Исполнитель: менеджер может назначить сразу -->
      <div class="form-field" v-if="user?.role === 'manager'">
        <label for="assignee">Исполнитель</label>
        <select id="assignee" v-model="form.assignee" class="select">
          <option value="">— не назначен —</option>
          <option v-for="e in engineers()" :key="e.email" :value="e.email">
            {{ e.name }} ({{ e.email }})
          </option>
        </select>
      </div>

      <!-- Статус: менеджер может выбрать стартовый -->
      <div class="form-field" v-if="user?.role === 'manager'">
        <label for="status">Статус</label>
        <select id="status" v-model="form.status" class="select">
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="row" style="gap:8px">
        <button v-if="user?.role !== 'director'" type="submit" class="btn btn--solid">Создать</button>
        <RouterLink to="/projects" class="btn btn--outline">Отмена</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.project-form { max-width: 560px }
.form-field { margin-bottom: 12px }
</style>
