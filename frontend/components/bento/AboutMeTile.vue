<template>
  <div class="about-tile" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Image de fond au hover -->
    <div class="about-background" :class="{ 'visible': isHovered }"></div>
    
    <!-- Overlay pour améliorer la lisibilité -->
    <div class="about-overlay" :class="{ 'visible': isHovered }"></div>
    
    <!-- Contenu -->
    <div class="about-content">
      <!-- Header avec titre en haut à droite -->
      <div class="about-header">
        <h2 class="about-title" :class="{ 'hovered': isHovered }">{{ titleText }}</h2>
      </div>
      
      <!-- Texte principal aligné à gauche -->
      <div class="about-description" :class="{ 'hovered': isHovered }">
        <p>{{ descriptionText }}</p>
        
        <!-- Indicateur cliquable -->
        <div class="click-indicator" :class="{ 'visible': isHovered }">
          <span>{{ clickText }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

// État du hover
const isHovered = ref(false)

// Utiliser le composable de langue
const { currentLanguage } = useLanguage()

// Textes adaptés selon la langue
const titleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'À propos de moi' : 'About Me'
})

const descriptionText = computed(() => {
  return currentLanguage.value === 'fr' 
    ? 'Développeur Full-Stack passionné par la création d\'expériences numériques innovantes et engageantes. Spécialisé dans les technologies web modernes, j\'aime transformer des idées complexes en solutions élégantes et performantes.\n\nAvec une approche centrée sur l\'utilisateur, je conçois des interfaces intuitives qui allient esthétique moderne et fonctionnalité optimale. Mon objectif est de créer des produits digitaux qui marquent et inspirent.'
    : 'Passionate Full-Stack Developer dedicated to creating innovative and engaging digital experiences. Specialized in modern web technologies, I love transforming complex ideas into elegant and performant solutions.\n\nWith a user-centered approach, I design intuitive interfaces that combine modern aesthetics with optimal functionality. My goal is to create digital products that make a lasting impact and inspire.'
})

const clickText = computed(() => {
  return currentLanguage.value === 'fr' ? 'En savoir plus' : 'Learn more'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.about-tile {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 38px;
  background: var(--bg-header);
  transition: all 0.3s ease;
}

.about-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/img/bg2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transform: scale(1.1);
  transition: all 0.4s ease;
  z-index: 1;
}

.about-background.visible {
  opacity: 1;
  transform: scale(1);
}

.about-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;
}

.about-overlay.visible {
  opacity: 1;
}

.about-content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
}

.about-header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.about-title {
  font-family: 'DM Serif Display', sans-serif;
  font-size: 48px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  line-height: 0.9;
  letter-spacing: -2px;
  transition: all 0.3s ease;
  text-align: right;
}

.about-title.hovered {
  color: rgb(255, 255, 255);
}

.about-description {
  flex: 1;
  display: flex;
  align-items: center;
}

.about-description p {
  font-family: 'DM Sans', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
  opacity: 0.8;
  transition: all 0.3s ease;
  text-align: left;
  white-space: pre-line;
}

.about-description.hovered p {
  color: rgb(255, 255, 255);
  opacity: 0.9;
}

/* Indicateur cliquable */
.click-indicator {
  position: absolute;
  bottom: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  color: var(--accent-primary);
  font-weight: 500;
  font-size: 14px;
}

.click-indicator.visible {
  opacity: 1;
  transform: translateY(0);
  color: rgba(255, 255, 255, 0.9);
}

.click-indicator svg {
  transition: transform 0.3s ease;
}

.about-tile:hover .click-indicator svg {
  transform: translateX(4px) translateY(-4px);
}

/* Responsive */
@media (max-width: 1200px) {
  .about-content {
    padding: 28px;
  }
  
  .about-title {
    font-size: 42px;
    letter-spacing: -1.5px;
  }
  
  .about-description p {
    font-size: 15px;
  }
}

@media (max-width: 992px) {
  .about-content {
    padding: 24px;
  }
  
  .about-title {
    font-size: 36px;
    letter-spacing: -1px;
  }
  
  .about-description p {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .about-content {
    padding: 20px;
  }
  
  .about-title {
    font-size: 32px;
    letter-spacing: -0.8px;
  }
  
  .about-description p {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .about-content {
    padding: 18px;
  }
  
  .about-title {
    font-size: 28px;
    letter-spacing: -0.6px;
  }
  
  .about-description p {
    font-size: 16px;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .about-content {
    padding: 16px;
  }
  
  .about-background{
    opacity: 1;
  }

  .about-title {
    font-size: 24px;
    letter-spacing: -0.5px;
  }
  
  .about-description p {
    font-size: 16px;
    line-height: 1.4;
  }
}
</style>
