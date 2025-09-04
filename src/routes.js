import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import GameDetailsPage from '@/pages/GameDetailsPage.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/game/:id',
    name: 'GameDetails',
    component: GameDetailsPage,
  },
  {
    path: '/:path(.*)',
    component: NotFound
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.onError((error, to) => {
  if (/Failed to fetch dynamically imported module/.test(error.message)) {

    if (!sessionStorage.getItem('reloadAttempted')) {
      sessionStorage.setItem('reloadAttempted', 'true');
      window.location.href = to.fullPath;
    } else {
      sessionStorage.removeItem('reloadAttempted');
      console.error("Falha ao carregar o módulo mesmo após o reload.", error);
    }
  }
});

router.isReady().then(() => {
  sessionStorage.removeItem('reloadAttempted');
});


export default router;
