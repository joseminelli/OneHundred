<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-6">
    <div v-for="game in games" :key="game.id">
      <RouterLink :to="`/game/${game.id}`" class="group block relative p-2 border border-white/10 bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-accent/30">

        <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

        <div class="relative z-10 space-y-3">
          <div class="overflow-hidden rounded-lg">
            <img
              :src="getCoverUrl(game.cover?.url)"
              :alt="`Capa do jogo ${game.name}`"
              class="aspect-[3/4] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
          <h3 class="truncate text-base font-semibold text-white transition-colors duration-200 group-hover:text-accent">
            {{ game.name }}
          </h3>
          <p v-if="game.first_release_date" class="text-xs text-gray-400">
            {{ getYear(game.first_release_date) }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue' // Importar computed para usar totalPages
// Define que este componente espera receber uma propriedade 'games' que é um array
defineProps({
  games: {
    type: Array,
    required: true,
  },
})

// Função para formatar a URL da capa vinda da IGDB
const getCoverUrl = (url) => {
  if (!url) {
    // Retorna uma imagem de placeholder caso o jogo não tenha capa
    return 'https://via.placeholder.com/300x400?text=Sem+Capa&bg=27272a&fg=a1a1aa'
  }
  // A API retorna um URL sem 'https:' e com tamanho 'thumb', então nós ajustamos
  return `https:${url.replace('t_thumb', 't_cover_big')}`
}

// Função auxiliar para extrair o ano da data de lançamento
const getYear = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000) // Multiplica por 1000 pois a IGDB retorna em segundos
  return date.getFullYear()
}
</script>
