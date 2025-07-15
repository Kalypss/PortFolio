<template>
  <div class="language-slider-container">
    <div 
      class="slider-track"
      @mousedown="startDrag"
      @touchstart="startDrag"
      ref="sliderTrack"
    >
      <div 
        class="slider-thumb"
        :style="{ 
          transform: `translateX(${thumbPosition}px)`,
          borderRadius: `${thumbBorderRadius}px`
        }"
        ref="sliderThumb"
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <!-- Tige de la flèche -->
          <line 
            x1="4" 
            y1="12" 
            x2="21" 
            y2="12" 
            stroke="currentColor" 
            stroke-width="3" 
            stroke-linecap="round"
          />
          <!-- Pointe de la flèche -->
          <path 
            d="M9 7L4 12L9 17" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <div class="slider-text" :key="textAnimationKey">
        {{ sliderText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

// Utiliser le composable de langue
const { currentLanguage, setLanguage, t } = useLanguage()

// Emits
const emit = defineEmits(['language-change'])

// Reactive data
const isDragging = ref(false)
const thumbPosition = ref(0)
const sliderTrack = ref(null)
const sliderThumb = ref(null)
const maxPosition = ref(200) // Sera calculé dynamiquement
const defaultPosition = ref(0) // Position par défaut (à droite)
const textAnimationKey = ref(0) // Clé pour forcer la re-animation du texte

// Computed
const sliderText = computed(() => {
  const availableDistance = maxPosition.value - 20 // Distance disponible avec le padding
  const pullPercentage = Math.abs(thumbPosition.value) / availableDistance
  
  let newText = ''
  if (pullPercentage < 0.2) {
    newText = currentLanguage.value === 'fr' ? 'Tirer pour changer de langue' : 'Pull to change language'
  } else if (pullPercentage < 0.8) {
    newText = currentLanguage.value === 'fr' ? 'Continuez à tirer...' : 'Keep pulling...'
  } else {
    newText = currentLanguage.value === 'fr' ? 'Relâchez pour changer' : 'Release to change'
  }
  
  return newText
})

// Computed pour le border-radius dynamique (carré vers rond)
const thumbBorderRadius = computed(() => {
  const availableDistance = maxPosition.value - 20 // Distance disponible avec le padding
  const pullPercentage = Math.abs(thumbPosition.value) / availableDistance
  // De 18px (carré arrondi) vers 35px (rond complet - moitié de 70px)
  const minRadius = 18
  const maxRadius = 35
  return minRadius + (pullPercentage * (maxRadius - minRadius))
})

const arrowRotation = computed(() => {
  // Rotation de la flèche basée sur la position (rotation vers la gauche quand on tire)
  const availableDistance = maxPosition.value - 20 // Distance disponible avec le padding
  const pullPercentage = Math.abs(thumbPosition.value) / availableDistance
  return pullPercentage * 30 // Rotation subtile
})

// Methods
const startDrag = (event) => {
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
  
  // Empêcher la sélection de texte
  event.preventDefault()
}

const onDrag = (event) => {
  if (!isDragging.value || !sliderTrack.value) return
  
  const rect = sliderTrack.value.getBoundingClientRect()
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  let newPosition = clientX - rect.left - 35 // 35 = moitié de la largeur du thumb (70px)
  
  // Calculer la position relative au point de départ (droite)
  newPosition = newPosition - defaultPosition.value
  
  // Limiter le mouvement : seulement vers la gauche avec 20px de padding minimum
  const minPosition = -(maxPosition.value - 20) // 20px de padding à gauche
  newPosition = Math.min(0, Math.max(minPosition, newPosition))
  thumbPosition.value = newPosition
}

const stopDrag = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
  
  // Logique de changement de langue : il faut tirer au maximum (85% minimum)
  const availableDistance = maxPosition.value - 20 // Distance disponible avec le padding
  const pullPercentage = Math.abs(thumbPosition.value) / availableDistance
  
  if (pullPercentage >= 0.85) {
    // Changer la langue seulement si on a tiré assez loin
    const newLanguage = currentLanguage.value === 'fr' ? 'en' : 'fr'
    setLanguage(newLanguage)
    emit('language-change', newLanguage)
  }
  
  // Toujours revenir à la position par défaut (droite)
  animateToPosition(0)
}

const animateToPosition = (targetPosition) => {
  const startPosition = thumbPosition.value
  const distance = targetPosition - startPosition
  const duration = 300 // ms
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Fonction d'easing pour une animation plus fluide
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    thumbPosition.value = startPosition + (distance * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

// Lifecycle
onMounted(() => {
  if (sliderTrack.value) {
    maxPosition.value = sliderTrack.value.clientWidth - 90 // 70 = largeur du thumb
    defaultPosition.value = maxPosition.value - 20 // Position par défaut à droite avec padding
  }
  
  // Position initiale toujours à droite (0)
  thumbPosition.value = 0
  
  // Gérer le redimensionnement de la fenêtre
  window.addEventListener('resize', updateMaxPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMaxPosition)
})

const updateMaxPosition = () => {
  if (sliderTrack.value) {
    maxPosition.value = sliderTrack.value.clientWidth - 100
    defaultPosition.value = maxPosition.value - 20
  }
}

// La flèche revient toujours à droite, peu importe la langue
// Watcher pour déclencher l'animation du texte à chaque changement
let previousText = ''
watch(sliderText, (newText) => {
  if (newText !== previousText) {
    textAnimationKey.value++
    previousText = newText
  }
})
</script>

<style scoped>
.language-slider-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 38px;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 5px;
}

.slider-thumb {
  position: absolute;
  right: 20px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 10;
  color: #000000;
  transition: box-shadow 0.2s ease;
}

.slider-thumb:active {
  cursor: grabbing;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

}

.slider-text {
  color: var(--text-primary);
  font-size: 1.3vw;
  font-weight: 500;
  text-align: center;
  z-index: 5;
  pointer-events: none;
  white-space: nowrap;
  position: absolute;
  left: 45%;
  transform: translateX(-50%);
  animation: textSlideUp 0.6s ease-out;
  transition: color 0.3s ease;
}

/* Animation pour le texte - Slide up à chaque changement */
@keyframes textSlideUp {
  0% { 
    opacity: 0; 
    transform: translateX(-50%) translateY(5px);
  }
  100% { 
    opacity: 1; 
    transform: translateX(-50%) translateY(0);
  }
}

.slider-text {
  animation: textSlideUp 0.4s ease-out;
}

/* Responsive */
@media (max-width: 1380px) {
  .slider-thumb {
    width: 50px;
    height: 50px;
  }
  
  .slider-text {
    font-size: 14px;
  }

  .slider-thumb {
  position: absolute;
  right: 10px;
  border-radius: 28px;
  }
}
</style>
