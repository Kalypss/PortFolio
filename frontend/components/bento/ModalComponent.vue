<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Modal'
  }
})

// Emits
const emits = defineEmits(['close'])

// Refs
const modalRef = ref(null)

// Fermer le modal
const closeModal = () => {
  emits('close')
}

// Fermer au clic sur l'overlay
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Fermer avec la touche Escape
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Gérer les événements clavier
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div 
          ref="modalRef"
          class="modal-container"
          @click.stop
        >
          <!-- Header du modal -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button 
              class="modal-close-btn"
              @click="closeModal"
              aria-label="Fermer le modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Contenu du modal -->
          <div class="modal-content">
            <slot>
              <p>Contenu du modal par défaut</p>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(var(--text-primary-rgb), 0.5);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  width: 90vw;
  max-width: 960px;
  height: 85vh;
  max-height: 700px;
  border-radius: 38px; /* Match bento tiles */
  background: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(var(--text-primary-rgb), 0.05);
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgba(var(--text-primary-rgb), 0.1);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.modal-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary) transparent;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--accent-primary);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
  filter: brightness(1.2);
}

/* New Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(50px) scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    width: 95vw;
    height: 90vh;
    border-radius: 28px;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-content {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    width: 100%;
    height: 95vh;
    border-radius: 24px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-content {
    padding: 20px;
  }
}
</style>