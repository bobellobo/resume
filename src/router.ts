import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProjectView from './views/project/ProjectView.vue'
import ExportView from './components/Export/Export.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          resolve({
            el: to.hash,
            top: 0,
            behavior: 'smooth'
          })
        })
      })
    }

    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: ProjectView
    },
    {
      path: '/export',
      name: 'export',
      component: ExportView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to) => {
  if (to.query.view === 'export') {
    return { name: 'export' }
  }
  return true
})

export default router
