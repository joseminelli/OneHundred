<template>
  <header class="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 ease-in-out">
    <div
      :class="[
        'animated-border-wrapper rounded-full',
        isScrolled ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/30'
      ]"
    >
      <div
        :class="[
          'relative flex items-center justify-between overflow-hidden rounded-full border border-white/10 bg-gray-900/60 p-2 backdrop-blur-xl transition-all duration-300 ease-in-out',
          isScrolled ? 'px-4' : 'px-6'
        ]"
      >
        <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div class="flex-1">
          <slot name="left" />
        </div>

        <div class="flex-1 text-center">
          <slot name="center" />
        </div>

        <div class="flex flex-1 justify-end">
          <slot name="right" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Estado reativo para saber se a página foi rolada
const isScrolled = ref(false)

const handleScroll = () => {
  // Se o scroll vertical for maior que 20px, ativa o estado 'isScrolled'
  isScrolled.value = window.scrollY > 20
}

// Adiciona o listener quando o componente é montado
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Remove o listener quando o componente é destruído para evitar vazamentos de memória
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* stylelint-disable */
/* Desativamos o Stylelint para este bloco, pois ele usa CSS avançado
   que não segue as regras de ordenação padrão, mas é necessário para o efeito. */

/* Estilo para a textura de fundo da navbar */
.bg-grid-pattern {
  background-image: linear-gradient(rgba(255 255 255 / 5%) 1px, transparent 1px), linear-gradient(90deg, rgba(255 255 255 / 5%) 1px, transparent 1px);
  background-size: 1rem 1rem;
}

/* --- MÁGICA DA BORDA ANIMADA --- */
.animated-border-wrapper {
  position: relative;
  background: #111827;
  padding: 2px;
  border-radius: 9999px;
}

.animated-border-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  padding: 2px;
  background: conic-gradient(from var(--angle), #059669, #0ea5e9, #6366f1, #059669);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate 10s linear infinite;
  opacity: 0.7;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

</style>
