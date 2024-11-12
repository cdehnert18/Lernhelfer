import { createRouter, createWebHistory } from 'vue-router'
import TimerView from '@/views/TimerView.vue'
import LernView from '@/views/LernView.vue'
import PruefungView from '@/views/PruefungView.vue'
import HinzufuegenView from '@/views/HinzufuegenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'timer',
      component: TimerView,
    },
    {
      path: '/learn',
      name: 'learn',
      component: LernView,
    },
    {
      path: '/pruefung',
      name: 'pruefung',
      component: PruefungView,
    },
    {
      path: '/add',
      name: 'hinzufuegen',
      component: HinzufuegenView,
    },
  ],
})

export default router
