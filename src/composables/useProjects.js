import { ref } from 'vue'

const KEY = 'projects'
const projectsRef = ref(load())

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function persist() {
  localStorage.setItem(KEY, JSON.stringify(projectsRef.value))
}
function nextId() {
  return String(Date.now())
}

export function useProjects() {
  // ===== CRUD =====
  function all() {
    return projectsRef
  }
  function byId(id) {
    return projectsRef.value.find(p => p.id === id)
  }
  function add(payload) {
    const item = {
      id: nextId(),
      title: payload.title?.trim() || 'Без названия',
      description: payload.description?.trim() || '',
      deadline: payload.deadline || '',
      priority: payload.priority || 'Средний',
      status: payload.status || 'Новая',      // цикл статусов
      assignee: payload.assignee || '',       // email инженера
      createdAt: new Date().toISOString()
    }
    projectsRef.value.unshift(item)
    persist()
    return item
  }
  function update(id, patch) {
    const idx = projectsRef.value.findIndex(p => p.id === id)
    if (idx === -1) return
    projectsRef.value[idx] = { ...projectsRef.value[idx], ...patch }
    persist()
  }
  function remove(id) {
    projectsRef.value = projectsRef.value.filter(p => p.id !== id)
    persist()
  }

  // ===== Назначение исполнителя =====
  function assign(id, engineerEmail) {
    update(id, { assignee: engineerEmail })
  }

  // ===== Статусы (валидация переходов) =====
  const STATUSES = ['Новая', 'В работе', 'На проверке', 'Закрыта', 'Отменена']
  const TRANSITIONS = {
    'Новая': ['В работе', 'Отменена'],
    'В работе': ['На проверке', 'Отменена'],
    'На проверке': ['Закрыта', 'В работе', 'Отменена'],
    'Закрыта': [],
    'Отменена': []
  }
  function canSetStatus(from, to) {
    return TRANSITIONS[from]?.includes(to)
  }
  function setStatus(id, to) {
    const item = byId(id)
    if (!item) return false
    if (item.status === to) return true
    if (!canSetStatus(item.status, to)) return false
    update(id, { status: to })
    return true
  }

  // ===== Экспорт =====
  function toCSVRows() {
    const header = ['ID','Название','Описание','Дедлайн','Приоритет','Статус','Исполнитель','Создано']
    const rows = projectsRef.value.map(p => [
      p.id, p.title, p.description, p.deadline, p.priority, p.status, p.assignee, p.createdAt
    ])
    return [header, ...rows]
  }

  function downloadBlob(filename, type, data) {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const rows = toCSVRows()
    const csv = rows
      .map(r => r.map(cell => {
        const s = String(cell ?? '')
        if (s.includes('"') || s.includes(';') || s.includes(',') || s.includes('\n'))
          return `"${s.replace(/"/g,'""')}"`
        return s
      }).join(';'))
      .join('\n')
    downloadBlob(`projects_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;', csv)
  }

  async function exportExcel() {
    const rows = toCSVRows()
    const { utils, write } = await import('xlsx')
    const ws = utils.aoa_to_sheet(rows)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Проекты')
    const buf = write(wb, { bookType: 'xlsx', type: 'array' })
    downloadBlob(
      `projects_${new Date().toISOString().slice(0,10)}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buf
    )
  }

  return {
    all, byId, add, update, remove,
    assign, STATUSES, setStatus, canSetStatus,
    exportCSV, exportExcel
  }
}
