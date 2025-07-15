<template>
  <div class="project-tile" @click="scrollToProjects">
    <!-- Image de fond -->
    <div class="project-background"></div>
    
    <!-- Overlay pour améliorer la lisibilité -->
    <div class="project-overlay"></div>
    
    <!-- Contenu textuel réparti -->
    <div class="project-layout">
      <!-- "My top" en haut à gauche -->
      <div class="project-top-left">
        <h2 class="project-title">{{ titleText }}</h2>
      </div>
      
      <!-- Chiffre "10" au centre avec animation -->
      <div class="project-center">
        <div class="number-animation">{{ displayNumber }}</div>
      </div>
      
      <!-- "Projects" en bas à droite -->
      <div class="project-bottom-right">
        <h1 class="project-subtitle">{{ subtitleText }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

// Utiliser le composable de langue
const { currentLanguage } = useLanguage()

// Animation du chiffre
const displayNumber = ref(0)

// Textes adaptés selon la langue
const titleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'Mes meilleurs' : 'My top'
})

const subtitleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'Projets' : 'Projects'
})

// Animation du chiffre de 0 à 10 avec effet d'accélération/décélération
const startNumberAnimation = () => {
  let current = 0
  const totalDuration = 3000 // 3 secondes total
  const startTime = Date.now()
  
  // Fonction d'easing pour accélérer puis ralentir
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }
  
  const updateNumber = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / totalDuration, 1)
    
    // Appliquer l'easing pour obtenir la progression non-linéaire
    const easedProgress = easeInOutCubic(progress)
    const targetNumber = Math.floor(easedProgress * 3) // Changé de 3 à 5 pour correspondre aux 5 projets
    
    if (targetNumber > current) {
      current = targetNumber
      displayNumber.value = current
      
      // Ajouter classe d'animation slide up
      const numberElement = document.querySelector('.number-animation')
      if (numberElement) {
        numberElement.classList.add('slide-up')
        setTimeout(() => {
          numberElement.classList.remove('slide-up')
        }, 300)
      }
    }
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }
  
  requestAnimationFrame(updateNumber)
}

// Fonction pour scroller vers la section projets
const scrollToProjects = () => {
  // Chercher l'élément avec l'ID project-section ou une classe spécifique
  const projectSection = document.getElementById('project-section') || 
                        document.querySelector('.project-section') ||
                        document.querySelector('[data-section="projects"]')
  
  if (projectSection) {
    projectSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    })
  } else {
    // Fallback : scroller vers le bas de la page
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// Démarrer l'animation au montage
onMounted(() => {
  // Délai avant de commencer l'animation
  setTimeout(() => {
    startNumberAnimation()
  }, 500)
})

// Plus besoin de nettoyer l'intervalle car on utilise requestAnimationFrame
onUnmounted(() => {
  // Cleanup si nécessaire
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

.project-tile {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
  transition: transform 0.3s ease;
}



.project-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/img/bg5.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  transition: transform 0.3s ease;
}



.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.project-layout {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding: 24px;
}

.project-top-left {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.project-center {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-bottom-left {
  grid-column: 1;
  grid-row: 3;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.project-bottom-right {
  grid-column: 3;
  grid-row: 3;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.project-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #FFFFFF;
  margin: 0;
  line-height: 1;
  letter-spacing: -0.3px;
}

.project-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  line-height: 1;
  letter-spacing: -0.8px;
}

.number-animation {
  font-family: 'DM Sans', sans-serif;
  font-size: 64px;
  font-weight: 900;
  color: #FFFFFF;
  transition: transform 0.2s ease;
  position: relative;
  letter-spacing: -2px;
  overflow: hidden;
}

.number-animation.slide-up {
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  0% {
    transform: translateY(10px);
    opacity: 0.7;
  }
  50% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .project-layout {
    padding: 20px;
  }
  
  .project-title {
    font-size: 16px;
  }
  
  .project-subtitle {
    font-size: 22px;
  }
  
  .number-animation {
    font-size: 56px;
  }
}

@media (max-width: 992px) {
  .project-layout {
    padding: 18px;
  }
  
  .project-title {
    font-size: 15px;
  }
  
  .project-subtitle {
    font-size: 20px;
  }
  
  .number-animation {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .project-layout {
    padding: 16px;
  }
  
  .project-title {
    font-size: 14px;
  }
  
  .project-subtitle {
    font-size: 18px;
  }
  
  .number-animation {
    font-size: 40px;
  }
}

@media (max-width: 640px) {
  .project-layout {
    padding: 14px;
  }
  
  .project-title {
    font-size: 13px;
    letter-spacing: -0.2px;
  }
  
  .project-subtitle {
    font-size: 20px;
    letter-spacing: -0.6px;
  }
  
  .number-animation {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .project-layout {
    padding: 12px;
  }
  
  .project-title {
    font-size: 18px;
    letter-spacing: -0.1px;
  }
  
  .project-subtitle {
    font-size: 20px;
    letter-spacing: -0.4px;
  }
  
  .number-animation {
    font-size: 36px;
  }
}
</style>
