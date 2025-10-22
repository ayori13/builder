import { mount, flushPromises } from '@vue/test-utils'
import ProjectsAdd from '@/components/ProjectsAdd.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({ history: createWebHistory(), routes: [] })

describe('ProjectsAdd.vue', () => {
  it('Создает проект при сабмите формы', async () => {
    localStorage.clear()
    const wrapper = mount(ProjectsAdd, {
      global: {
        plugins: [router],
        stubs: ['RouterLink']
      }
    })
    await wrapper.find('input#title').setValue('New Project')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    const projects = JSON.parse(localStorage.getItem('projects'))
    expect(projects.length).toBe(1)
    expect(projects[0].title).toBe('New Project')
  })
})
