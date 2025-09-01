<template>
  <div ref="searchWrapper" class="relative group">
    <div
      class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
    />

    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar por nome do jogo..."
        class="block w-full pl-12 pr-12 py-3 border border-white/10 bg-gray-800/50 backdrop-blur-lg rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition duration-300"
        @keyup.enter="handleSearch"
        @input="onInput"
        @keydown.esc="closeSuggestions" />

      <div v-if="loading || isSuggestionsLoading" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <svg class="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <ul v-if="showSuggestions" class="absolute z-10 w-full bg-gray-800/80 backdrop-blur-lg border border-white/10 rounded-xl mt-2 shadow-lg overflow-hidden">
        <li
          v-for="game in suggestions"
          :key="game.id"
          @click="selectSuggestion(game.name)"
          class="px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors duration-200"
        >
          {{ game.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { fetchSuggestions } from '~/api/igdb.js'
import { useClickOutside } from '~/composables/useClickOutside.ts' // Importando nosso novo composable

// --- PROPS E EMITS ---
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['search'])

// --- ESTADO LOCAL ---
const searchWrapper = ref(null) // Ref para o elemento principal
const searchTerm = ref('')
const suggestions = ref([])
const isSuggestionsLoading = ref(false)
const wasSuggestionSelected = ref(false)

// --- ESTADO COMPUTADO ---
// A lista só aparece se tiver sugestões e se uma não tiver acabado de ser selecionada
const showSuggestions = computed(() => suggestions.value.length > 0 && !wasSuggestionSelected.value)

// --- FUNÇÕES ---
const closeSuggestions = () => {
  suggestions.value = []
}

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    closeSuggestions() // Garante que a lista feche ao pressionar Enter
    emit('search', searchTerm.value.trim())
  }
}

const selectSuggestion = (name) => {
  wasSuggestionSelected.value = true // Impede que a lista pisque
  searchTerm.value = name
  handleSearch()
}

// --- LÓGICA DE BUSCA COM DEBOUNCE ---
let debounceTimer
const onInput = () => {
  wasSuggestionSelected.value = false // Reseta ao digitar
  clearTimeout(debounceTimer)
  if (searchTerm.value.length < 3) {
    suggestions.value = []
    return
  }

  debounceTimer = setTimeout(async () => {
    isSuggestionsLoading.value = true
    try {
      suggestions.value = await fetchSuggestions(searchTerm.value)
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error)
      suggestions.value = []
    } finally {
      isSuggestionsLoading.value = false
    }
  }, 300)
}

// --- HOOKS DE COMPORTAMENTO ---
// Usa nosso composable para fechar a lista ao clicar fora
useClickOutside(searchWrapper, () => {
  closeSuggestions()
})
</script>
