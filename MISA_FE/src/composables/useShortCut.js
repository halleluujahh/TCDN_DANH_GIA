import { onMounted, onUnmounted } from 'vue'

export function useShortCut(combo, handler) {
  function onKeydown(e) {
    switch (combo) {
      case 'esc':
        // ESC
        if (e.key.toLowerCase() === 'escape') {
          e.preventDefault()
          handler()
        }
        return
      case 'ctrl+s':
        // Ctrl + Shift + S
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 's') {
          e.preventDefault()
          handler()
        }
        return
      case 'ctrl+shift+s':
        // Ctrl + S (phải đặt SAU ctrl+shift+s)
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
          e.preventDefault()
          handler()
        }
        return
      default:
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
