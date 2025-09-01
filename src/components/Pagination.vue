<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 mt-12 text-white">
    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
      class="px-4 py-2 border border-white/10 bg-gray-800/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent hover:border-accent transition-colors">
      Anterior
    </button>
    <span class="font-semibold">Página {{ currentPage }} de {{ totalPages }}</span>
    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
      class="px-4 py-2 border border-white/10 bg-gray-800/50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent hover:border-accent transition-colors">
      Próxima
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(['page-change']);

const changePage = (page) => {
  // Apenas emite o evento, não faz mais nada
  if (page > 0 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>
