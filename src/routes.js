import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';

// 1. As definições das suas rotas (as "peças")
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/game/:id',
    name: 'GameDetails',
    component: () => import('@/pages/game/[id].vue'),
  },
  {
    path: '/:path(.*)',
    component: NotFound
  },
];

// 2. A construção do roteador (o "motor")
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes, // Usando o array de rotas definido acima
});

// 3. A exportação do roteador pronto
export default router;
