import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../shared/ui/MainLayout.vue'
import HomeView from '../slices/landing-page/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/participant',
          name: 'participant',
          component: () => import('../slices/retro-participation/ui/views/ParticipantView.vue'),
        },
      ],
    },
  ],
})

export default router
