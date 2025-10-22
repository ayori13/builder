// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  { path: '/', redirect: '/projects' },

  { path: '/login', name: 'Login', component: () => import('@/components/Login.vue') },

  { path: '/projects', name: 'ProjectsList', component: () => import('@/components/ProjectsList.vue'), meta: { requiresAuth: true } },
  { path: '/projects/add', name: 'ProjectsAdd', component: () => import('@/components/ProjectsAdd.vue'), meta: { requiresAuth: true } },
  { path: '/projects/:id', name: 'ProjectsView', component: () => import('@/components/ProjectsView.vue'), props: true, meta: { requiresAuth: true } },
  { path: '/projects/edit/:id', name: 'ProjectsEdit', component: () => import('@/components/ProjectsEdit.vue'), props: true, meta: { requiresAuth: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div class="muted">Страница не найдена</div>' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && isAuthenticated.value) {
    next({ name: 'ProjectsList' })
  } else {
    next()
  }
})

export default router
