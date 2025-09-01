import { createApp } from 'vue';
import App from '@/app.vue';

import router from '@/routes.js';

// Importa seus estilos
import '@/assets/styles/fonts.css';
import '@/assets/styles/main.css';
import '@/assets/styles/tailwind.css';

const app = createApp(App);

// Usa o roteador na aplicação
app.use(router);

app.mount('#app');
