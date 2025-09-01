<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <div v-if="gameDetails?.screenshots" class="absolute top-0 left-0 w-full h-96 overflow-hidden">
      <img :src="getScreenshotUrl(gameDetails.screenshots[0].url, '1080p')" class="w-full h-full object-cover blur-md scale-110 opacity-30" />
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
    </div>

    <main class="relative container mx-auto p-4 md:p-8 pt-24">
      <RouterLink to="/" class="inline-flex items-center text-gray-300 hover:text-accent transition-colors duration-200 mb-8">
        <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Voltar para a busca
      </RouterLink>

      <div v-if="loading" class="text-center text-2xl">Carregando detalhes...</div>
      <div v-if="error" class="text-center text-red-400">{{ error }}</div>

      <div v-if="gameDetails">
        <header class="flex flex-col md:flex-row items-start gap-8">
          <img :src="getCoverUrl(gameDetails.cover?.url)" :alt="gameDetails.name" class="w-48 md:w-64 rounded-lg shadow-2xl flex-shrink-0" />
          <div class="flex flex-col gap-4">
            <p class="text-gray-400">{{ getYear(gameDetails.first_release_date) }}</p>
            <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">{{ gameDetails.name }}</h1>
            <div class="flex flex-wrap gap-2">
              <span v-for="p in gameDetails.platforms" :key="p.id" class="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full">{{ p.name }}</span>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div class="lg:col-span-2 space-y-8">
            <InfoCard title="Resumo">
              <p class="text-gray-300 leading-relaxed">{{ gameDetails.summary || 'Não há resumo disponível.' }}</p>
            </InfoCard>

            <InfoCard title="Galeria" v-if="gameDetails.screenshots?.length > 1">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a v-for="ss in gameDetails.screenshots.slice(1, 7)" :key="ss.id" :href="getScreenshotUrl(ss.url, '1080p')" target="_blank" class="overflow-hidden rounded-lg">
                  <img :src="getScreenshotUrl(ss.url, 'screenshot_med')" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </a>
              </div>
            </InfoCard>
          </div>

          <div class="space-y-6">
            <InfoCard title="Detalhes">
              <DetailItem label="Desenvolvedora" :value="getCompany(gameDetails.involved_companies, 'developer')" />
              <DetailItem label="Publicadora" :value="getCompany(gameDetails.involved_companies, 'publisher')" />
              <DetailItem label="Motor Gráfico" :value="gameDetails.game_engines?.[0]?.name" />
            </InfoCard>
            <InfoCard title="Gêneros">
              <div class="flex flex-wrap gap-2">
                <span v-for="g in gameDetails.genres" :key="g.id" class="px-2 py-1 bg-gray-700 text-sm rounded">{{ g.name }}</span>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchGameDetailsById } from '~/api/igdb.js'

// Componentes locais para reutilização (poderiam ser arquivos separados)
const InfoCard = (props, { slots }) => h('div', { class: 'bg-gray-800/50 backdrop-blur-lg rounded-xl border border-white/10 p-6' }, [
  h('h2', { class: 'text-xl font-bold text-white mb-4' }, props.title),
  slots.default(),
]);
const DetailItem = ({ label, value }) => value ? h('div', { class: 'flex justify-between border-b border-white/10 py-2' }, [
  h('span', { class: 'text-gray-400' }, label),
  h('span', { class: 'text-white font-semibold' }, value),
]) : null;

const route = useRoute()
const gameDetails = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const gameId = Number(route.params.id)
    gameDetails.value = await fetchGameDetailsById(gameId)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// --- Funções Auxiliares ---
const getCoverUrl = (url) => url ? `https:${url.replace('t_thumb', 't_cover_big')}` : ''
const getScreenshotUrl = (url, size = 'screenshot_big') => url ? `https:${url.replace('t_thumb', `t_${size}`)}` : ''
const getYear = (timestamp) => timestamp ? new Date(timestamp * 1000).getFullYear() : 'N/A'

const getCompany = (companies, type) => {
  if (!companies) return 'N/A'
  const company = companies.find(c => c[type])
  return company?.company?.name || 'N/A'
}
</script>
