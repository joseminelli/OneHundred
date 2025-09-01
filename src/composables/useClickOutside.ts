import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(target, callback) {
  if (!target) return

  const listener = (event) => {
    // Se o clique for no elemento alvo ou em um de seus filhos, não faça nada
    if (event.target === target.value || event.composedPath().includes(target.value)) {
      return
    }
    // Se o clique for fora, execute a função de callback
    callback()
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })

  onUnmounted(() => {
    window.removeEventListener('click', listener)
  })
}
