<template>
  <div 
    class="open-to-work-container"
    @mouseenter="isHovered = true" 
    @mouseleave="isHovered = false"
  >
    <!-- Background image qui apparaît au hover -->
    <div 
      class="work-background"
      :class="{ 'visible': isHovered }"
    ></div>
    
    <!-- Overlay gradient --> 
    <div class="work-overlay" :class="{ 'visible': isHovered }"></div>
    
    <!-- Point vert pulsant -->
    <div class="status-indicator">
      <div class="pulse-ring"></div>
      <div class="status-dot"></div>
    </div>
    
    <!-- Texte principal -->
    <div class="content">
      <h3 class="title">{{ titleText }}</h3>
      <h3 class="subtitle">{{ subtitleText }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

// Utiliser le composable de langue
const { currentLanguage } = useLanguage()

// État du hover
const isHovered = ref(false)

const openLinkedinProfile = () => {
  window.open('https://www.linkedin.com/in/florian-silva-139ba4374/', '_blank', 'noopener,noreferrer')
}

// Textes adaptés selon la langue
const titleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'Ouvert au' : 'Open to'
})

const subtitleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'travail' : 'work'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

.open-to-work-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}


/* Background image */
.work-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/img/OpenToWork.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.work-background.visible {
  opacity: 0.9;
}

/* Overlay gradient */
.work-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.work-overlay.visible {
  opacity: 1;
}

/* Animation subtile au hover */
.open-to-work-container:hover .status-dot {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
}

.open-to-work-container:hover .pulse-ring {
  animation-duration: 1s;
}

.status-indicator {
  position: relative;
  z-index: 3;
  top: 0;
  right: 0;
  margin-left: auto;
  margin-bottom: auto;
  width: 24px;
  height: 24px;
}

.status-dot {
  width: 16px;
  height: 16px;
  background: #53ff8d;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 2;
  transition: all 0.3s ease;
}

.pulse-ring {
  width: 24px;
  height: 24px;
  border: 4px solid #22c55e;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  animation: pulse-animation 1.3s infinite;
  opacity: 0.4;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Contenu textuel */
.content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0;
}

.title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 1.6rem;
  margin: 0;
  line-height: 0.9;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.subtitle {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.8rem;
  margin: 0;
  margin-top: -0.1rem;
  line-height: 0.9;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

/* Effet hover sur le texte */
.open-to-work-container:hover .title,
.open-to-work-container:hover .subtitle {
  color: white;
}

/* Animation subtile au hover */
.open-to-work-container:hover .status-dot {
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
}

.open-to-work-container:hover .pulse-ring {
  animation-duration: 1s;
}

/* Point de statut avec animation pulse */

/* Responsive */
@media (max-width: 1380px) {
  .title {
    font-size: 1.2rem;
  }
  
  .open-to-work-container{
      padding: 15px;
  }

  .content{
    padding-left: 10px;
    padding-bottom: 5px;
  }

  .subtitle {
    font-size: 1.4rem;
  }
  
  .status-indicator {
    width: 20px;
    height: 20px;
    
  }
  
  .status-dot {
    width: 14px;
    height: 14px;
  }
  
  .pulse-ring {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 768px) {
  .open-to-work-container {
    padding: 15px;
  }
  
  .title {
    font-size: 1.1rem;
  }
  
  .subtitle {
    font-size: 1.3rem;
  }
  
  .status-indicator {
    top: 15px;
    right: 15px;
    width: 16px;
    height: 16px;
  }
  
  .status-dot {
    width: 10px;
    height: 10px;
    top: 3px;
    left: 3px;
  }
  
  .pulse-ring {
    width: 16px;
    height: 16px;
  }

  .work-background {
    opacity: 0.8;
  }
}

/* Adaptation pour le thème clair - supprimé car on retire l'effet hover */
</style>
