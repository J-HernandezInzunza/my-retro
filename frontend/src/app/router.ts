import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../slices/landing-page/views/HomeView.vue'

const MainLayout = () => import('../shared/ui/MainLayout.vue')
const OnboardingView = () => import('../slices/user-onboarding/components/OnboardingView.vue')
const ParticipantView = () => import('../slices/retro-participation/ui/views/ParticipantView.vue')
const TeamDashboardView = () => import('../slices/team-management/views/TeamDashboardView.vue')
const RetroSessionsView = () => import('../slices/retro-session/views/RetroSessionsView.vue')

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
          component: ParticipantView,
        },
        {
          path: '/onboarding',
          name: 'onboarding',
          component: OnboardingView,
        },
        {
          path: '/team',
          name: 'team-dashboard',
          component: TeamDashboardView,
        },
        {
          path: '/retro-sessions',
          name: 'retro-sessions',
          component: RetroSessionsView,
        },
      ],
    },
  ],
})

export default router
