<template>
  <div class="min-h-screen bg-gray-900 pt-32 text-gray-200">
    <main class="container mx-auto p-4 md:p-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
          Explore o Universo dos Jogos
        </h2>
        <p class="mb-8 text-gray-400">
          Encontre qualquer jogo e adicione à sua lista de completionist.
        </p>
      </div>

      <div class="mx-auto mt-12 max-w-2xl">
        <SearchInput
          :loading="loading"
          @search="handleNewSearch"
        />
      </div>

      <div class="mt-8">
        <div v-if="loading" class="text-center text-gray-400">
          <p>Buscando jogos...</p>
        </div>

        <template v-else-if="results.length > 0">
          <GameGrid :games="results" />
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="changePage"
          />
        </template>

        <div v-else-if="searched" class="text-center text-gray-400">
          <p>Nenhum resultado encontrado. Tente um termo de busca diferente.</p>
        </div>

        <div v-if="error" class="mt-4 text-center text-red-400">
          <p>Ocorreu um erro: {{ error }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchGames } from '~/api/igdb.js'

// Componentes (o template deve auto-importar, mas se não, descomente as linhas abaixo)
import SearchInput from '~/components/SearchInput.vue'
import GameGrid from '~/components/GameGrid.vue'
import Pagination from '~/components/Pagination.vue'

// --- SETUP DO ROUTER ---
const route = useRoute() // Para LER a URL atual
const router = useRouter() // Para MODIFICAR a URL

// --- ESTADO DO COMPONENTE ---
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const error = ref(null)
const totalCount = ref(0)
const itemsPerPage = 12 // Define quantos jogos mostrar por página

// --- ESTADO DERIVADO (Calculado a partir de outros estados) ---
// A página atual e o termo de busca agora vêm da URL
const currentPage = computed(() => Number(route.query.page) || 1)
const currentSearchTerm = computed(() => route.query.q || '')
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage))

// --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---

// Função que ATUALIZA A URL quando uma nova busca é feita
const handleNewSearch = (searchTerm) => {
  router.push({ query: { q: searchTerm, page: 1 } })
}

// Função que ATUALIZA A URL quando a página muda
const changePage = (newPage) => {
  // Mantém o termo de busca atual na URL e apenas muda a página
  router.push({ query: { q: currentSearchTerm.value, page: newPage } })
}

// --- EFEITO REATIVO (O "cérebro" da página) ---
// Esta função "assiste" a URL e dispara a busca sempre que ela muda.
watchEffect(async () => {
  const searchTerm = currentSearchTerm.value
  const page = currentPage.value

  if (searchTerm) {
    loading.value = true
    error.value = null

    try {
      const offset = (page - 1) * itemsPerPage
      const response = await searchGames(searchTerm, itemsPerPage, offset)
      results.value = response.games
      totalCount.value = response.totalCount
    } catch (err) {
      error.value = err.message
      results.value = []
      totalCount.value = 0
    } finally {
      loading.value = false
      searched.value = true // Marca que uma busca foi concluída
    }
  } else {
    // Se não houver termo de busca na URL, limpa o estado da página
    results.value = []
    totalCount.value = 0
    searched.value = false
  }
})
</script>
