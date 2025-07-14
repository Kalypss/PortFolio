<template>
  <div class="contact-tile" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Image de fond au hover -->
    <div class="contact-background" :class="{ 'visible': isHovered }"></div>
    
    <!-- Overlay pour améliorer la lisibilité -->
    <div class="contact-overlay" :class="{ 'visible': isHovered }"></div>
    
    <!-- Contenu -->
    <div class="contact-content" >
      <!-- Titre principal -->
      <div class="contact-header">
        <h2 class="contact-title" :class="{ 'hovered': isHovered }">{{ titleText }}</h2>
        <h1 class="contact-subtitle" :class="{ 'hovered': isHovered }">{{ subtitleText }}</h1>
      </div>
      
      <!-- Email avec animation -->
      <a href="mailto:contact@floriansilva.dev" class="contact-email" :class="{ 'hovered': isHovered }">
        <!-- Icône mail à gauche -->
      <svg class="mail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      
      <span class="email-text">dev.silva.florian@gmail.com</span>
      
      <!-- Flèche qui apparaît au hover -->
      <svg class="arrow-icon" :class="{ 'visible': isHovered }" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </a>
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
  return currentLanguage.value === 'fr' ? 'Vous avez une idée ?' : 'You Get An Idea ?'
})

const subtitleText = computed(() => {
  return currentLanguage.value === 'fr' ? 'Je la réalise.' : 'I Make It Real.'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.contact-tile {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 38px;
  background: var(--bg-header);
  transition: all 0.3s ease;
}

.contact-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/img/bg6.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transform: scale(1.1);
  transition: all 0.4s ease;
  z-index: 1;
}

.contact-background.visible {
  opacity: 1;
  transform: scale(1);
}


.contact-content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  align-items: center;
}

.contact-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
}

.contact-title {
  font-family: 'DM Serif Display', sans-serif;
  font-size: 30px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.1;
  letter-spacing: -2px;
  opacity: 0.9;
}

.contact-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 50px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
  letter-spacing: -3px;
}

.contact-title.hovered,
.contact-subtitle.hovered {
  color: rgb(255, 255, 255);
}

.contact-email {
  background: var(--text-primary);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  text-decoration: none;
}

.contact-email.hovered {
  background: rgba(255, 255, 255, 0.4);
}

.mail-icon {
  color: var(--bg-primary);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.arrow-icon {
  color: var(--bg-primary);
  opacity: 0;
  transform: translate(-8px, 8px);
  transition: all 0.3s ease;
  position: absolute;
  top: 14px;
  right: 8px;
  flex-shrink: 0;
}

.arrow-icon.visible {
  opacity: 1;
  transform: translate(0, 0);
}

.email-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--bg-primary);
  letter-spacing: -0.5px;
  flex: 1;
  text-align: center;
  margin-right: 10px;
}

/* Responsive */
@media (max-width: 1200px) {
  .contact-content {
    padding: 28px;
  }
  
  .contact-title {
    font-size: 36px;
    letter-spacing: -0.7px;
  }
  
  .contact-subtitle {
    font-size: 36px;
    letter-spacing: -0.7px;
  }
  
  .email-text {
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .contact-content {
    padding: 24px;
  }
  
  .contact-title {
    font-size: 32px;
    letter-spacing: -0.6px;
  }
  
  .contact-subtitle {
    font-size: 32px;
    letter-spacing: -0.6px;
  }
  
  .contact-email {
    padding: 14px 18px;
    gap: 6px;
  }
  
  .mail-icon {
    width: 18px;
    height: 18px;
  }
  
  .arrow-icon {
    width: 14px;
    height: 14px;
    top: 6px;
    right: 6px;
  }
  
  .email-text {
    font-size: 12px;
  }
}

@media (max-width: 768px) {

  .contact-content {
    padding: 10px;
  }
  
  .contact-title {
    font-size: 28px;
    letter-spacing: -0.5px;
    color: var(--bg-primary);

  }
  
  .contact-subtitle {
    font-size: 36px;
    letter-spacing: -0.5px;
    color: var(--bg-primary);
  }
  
  .contact-email {
    padding: 12px 16px;
    gap: 6px;
  }
  
  .mail-icon {
    width: 16px;
    height: 16px;
  }
  
  .arrow-icon {
    width: 12px;
    height: 12px;
    top: 5px;
    right: 5px;
  }
  
  .email-text {
    font-size: 12px;
  }

  .contact-background {
  opacity: 1;
  }

  .contact-header {
  margin-top: 30px;
  margin-bottom: 30px;
  }

  .arrow-icon {
  opacity: 1;
  transform: translate(-8px, 8px);
  }
}

@media (max-width: 640px) {
  .contact-content {
    padding: 18px;
  }
  
  .contact-title {
    font-size: 24px;
    letter-spacing: -0.4px;
    color: white;

  }
  
  .contact-subtitle {
    font-size: 24px;
    letter-spacing: -0.4px;
    color: white;
  }
  
  .contact-email {
    padding: 12px 14px;
    gap: 5px;
  }
  
  .mail-icon {
    width: 14px;
    height: 14px;
  }
  
  .arrow-icon {
    width: 11px;
    height: 11px;
    top: 4px;
    right: 4px;
  }
  
  .email-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .contact-content {
    padding: 16px;
  }
  
  .contact-title {
    font-size: 20px;
    letter-spacing: -0.3px;
    color: white;

  }
  
  .contact-subtitle {
    font-size: 20px;
    letter-spacing: -0.3px;
    color: white;
  }
  
  .contact-email {
    padding: 10px 12px;
    gap: 4px;
  }
  
  .mail-icon {
    width: 12px;
    height: 12px;
  }
  
  .arrow-icon {
    width: 10px;
    height: 10px;
    top: 3px;
    right: 3px;
  }
  
  .email-text {
    font-size: 10px;
  }
}
</style>
