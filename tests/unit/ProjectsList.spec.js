import { mount, flushPromises } from '@vue/test-utils'
import ProjectsList from '@/components/ProjectsList.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { vi } from 'vitest'

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

describe('ProjectsList.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    const sampleProjects = [
      { id: '1', title: 'Test Project 1', description: 'Desc1', deadline: '2025-12-31', done: false, priority: 'Высокий' },
      { id: '2', title: 'Test Project 2', description: 'Desc2', deadline: '', done: true, priority: 'Низкий' }
    ]
    localStorage.setItem('projects', JSON.stringify(sampleProjects))
  })

  it('Отображает список проектов из localStorage', async () => {
    const wrapper = mount(ProjectsList, {
      global: {
        plugins: [router],
        stubs: ['RouterLink'],
        mocks: {
          user: { role: 'manager' }
        }
      }
    })
    await flushPromises() // дождаться mounted и реактивных обновлений
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(wrapper.text()).toContain('Test Project 1')
    expect(wrapper.text()).toContain('Test Project 2')
  })

  it('Удаляет проект при клике на кнопку удаления', async () => {
    window.confirm = vi.fn(() => true)
    const wrapper = mount(ProjectsList, {
      global: {
        plugins: [router],
        stubs: ['RouterLink'],
        mocks: {
          user: { role: 'manager' }
        }
      }
    })
    await flushPromises()
    const deleteBtn = wrapper.find('button.delete-btn')
    expect(deleteBtn.exists()).toBe(true)
    await deleteBtn.trigger('click')
    await flushPromises()

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(1)
  })
})
