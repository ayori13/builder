// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"

import LoginPage from "@/components/LoginPage.vue"
import ProjectsList from "@/components/ProjectsList.vue"
import ProjectsAdd from "@/components/ProjectsAdd.vue"
import ProjectsEdit from "@/components/ProjectsEdit.vue"
import ProjectsView from "@/components/ProjectsView.vue"
import ReportsPage from "@/components/ReportsPage.vue"

import { currentUser, initAuthFromStorage } from "@/composables/useAuth"

initAuthFromStorage()

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { onlyGuests: true }
  },
  {
    path: "/",
    redirect: "/projects"
  },
  {
    path: "/projects",
    name: "ProjectsList",
    component: ProjectsList,
    meta: { requiresAuth: true }
  },
  {
    path: "/projects/add",
    name: "ProjectsAdd",
    component: ProjectsAdd,
    meta: {
      requiresAuth: true,
      roles: ["engineer", "manager"] // кто может создавать
    }
  },
  {
    path: "/projects/:id",
    name: "ProjectsView",
    component: ProjectsView,
    meta: { requiresAuth: true }
  },
  {
    path: "/projects/:id/edit",
    name: "ProjectsEdit",
    component: ProjectsEdit,
    meta: {
      requiresAuth: true,
      roles: ["engineer", "manager"]
    }
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsPage,
    meta: {
      requiresAuth: true,
      roles: ["manager", "director"]
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// глобальный гвард
router.beforeEach((to, from, next) => {
  const isAuth = !!currentUser.value

  if (to.meta.requiresAuth && !isAuth) {
    return next({
      name: "Login",
      query: { redirect: to.fullPath }
    })
  }

  if (to.meta.onlyGuests && isAuth) {
    return next({ name: "ProjectsList" })
  }

  if (to.meta.roles && to.meta.roles.length) {
    const roles = currentUser.value?.roles || []
    const allowed = to.meta.roles.some((r) => roles.includes(r))
    if (!allowed) {
      return next({ name: "ProjectsList" })
    }
  }

  next()
})

export default router
