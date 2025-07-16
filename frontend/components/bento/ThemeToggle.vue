<template>
  <div class="theme-toggle-container">
    <div 
      class="toggle-track"
      @click="toggleTheme"
      ref="toggleTrack"
      role="button"
      :aria-label="isLightMode ? 'Activer le mode sombre' : 'Activer le mode clair'"
      tabindex="0"
      @keydown.enter="toggleTheme"
      @keydown.space.prevent="toggleTheme"
    >
      <div 
        class="toggle-thumb"
        :class="{ 'light-mode': isLightMode }"
      >
        <!-- Icône retirée -->
      </div>
      
      <div class="toggle-text" :key="textAnimationKey">
        {{ toggleText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import { useTheme } from '@/composables/useTheme'

// Props et émissions
const emit = defineEmits(['theme-change'])

// Utiliser les composables
const { t } = useLanguage()
const { currentTheme, setTheme, isLightMode } = useTheme()

// Reactive data
const toggleTrack = ref(null)
const textAnimationKey = ref(0) // Clé pour forcer la re-animation

// Computed
const toggleText = computed(() => {
  if (isLightMode.value) {
    return t('lightMode') || 'Press this tile for the white mode'
  } else {
    return t('darkMode') || 'Press this tile for the dark mode'
  }
})

// Methods
const toggleTheme = () => {
  const newTheme = isLightMode.value ? 'dark' : 'light'
  setTheme(newTheme)
  emit('theme-change', newTheme)
  // Déclencher la re-animation du texte
  textAnimationKey.value++
}
</script>

<style scoped>
.theme-toggle-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 38px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.toggle-thumb {
  width: 70px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: translateX(0);
}


.icon-container {
  display: flex;
  align-items: center;
  justify-content: left;
  width: 50%;
  height: 50%;
}

  .toggle-text {
    color: var(--text-primary);
    font-size: var(--font-medium);
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    animation: textSlideUp 0.6s ease-out;  
    transition: color 0.3s ease;
}

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

.toggle-text{
   animation: textSlideUp 0.4s ease-out;
}

/* Responsive */
@media (max-width: 1200px) {
  .toggle-text {
    font-size: var(--font-laptop-small);
  }
}

@media (max-width: 768px) {
  .toggle-text {
    font-size: var(--font-tablet-small);
  }
}

@media (max-width: 480px) {
  .toggle-text {
    font-size: var(--font-phone-smaller);
    margin-top: 40px;
  }
}
</style>