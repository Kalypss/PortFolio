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
        <!-- Icône dynamique basée sur le thème -->
        <div class="icon-container">
          <svg 
            v-if="isLightMode" 
            width="24" 
            height="24" 
            viewBox="0 0 45 44" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Rayons du soleil -->
            <line x1="22.5" y1="2" x2="22.5" y2="8" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="22.5" y1="36" x2="22.5" y2="42" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="43" y1="22" x2="37" y2="22" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="22" x2="2" y2="22" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="36.78" y1="7.22" x2="32.36" y2="11.64" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="12.64" y1="32.36" x2="8.22" y2="36.78" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="36.78" y1="36.78" x2="32.36" y2="32.36" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <line x1="12.64" y1="11.64" x2="8.22" y2="7.22" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
            <!-- Corps du soleil -->
            <circle cx="22.5" cy="22" r="10" fill="#1A1A1A"/>
          </svg>
          
          <svg 
            v-else 
            width="24" 
            height="24" 
            viewBox="0 0 45 44" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="20.5453" cy="23.25" rx="20" ry="20" fill="white"/>
            <ellipse cx="34.5455" cy="10.25" rx="10" ry="10" fill="#1A1A1A"/>
          </svg>
        </div>
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
  padding: 0 15px;
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
  justify-content: center;
  width: 100%;
  height: 100%;
}

.toggle-text {
  color: var(--text-primary);
  font-size: 1.3vw ;
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
@media (max-width: 1380px) {
  .toggle-thumb {
    width: 40px;
    height: 40px;
  }
  
  .toggle-text {
    font-size: 24pxpx;
  }
}

@media (max-width: 768px) {
  .toggle-thumb {
    width: 40px;
    height: 40px;
  }
  
  .toggle-text {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .toggle-track {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    position: relative;
  }

  .toggle-thumb {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 10px;
    left: 10px;
    transform: none;
  }

  .toggle-text {
    font-size: 10px;
    margin-top: 40px;
  }
}
</style>
