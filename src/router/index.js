import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  { path: '/', redirect: '/projects' },

  { path: '/login', name: 'LoginPage', component: () => import('../components/LoginPage.vue') },

  { path: '/projects', name: 'ProjectsList', component: () => import('../components/ProjectsList.vue'), meta: { requiresAuth: true } },
  { path: '/projects/add', name: 'ProjectsAdd', component: () => import('../components/ProjectsAdd.vue'), meta: { requiresAuth: true } },
  { path: '/projects/:id', name: 'ProjectsView', component: () => import('../components/ProjectsView.vue'), props: true, meta: { requiresAuth: true } },
  { path: '/projects/edit/:id', name: 'ProjectsEdit', component: () => import('../components/ProjectsEdit.vue'), props: true, meta: { requiresAuth: true } },

  { path: '/reports', name: 'ReportsPage', component: () => import('../components/ReportsPage.vue'), meta: { requiresAuth: true } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: { template: '<div class="container sp-8 muted">Страница не найдена</div>' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
router.beforeEach((to, from, next) => {
  const { user } = useAuth()
  if (!user.value && to.path !== '/login') next('/login')
  else if (user.value && to.path === '/login') next('/projects')
  else next()
})

export default router
