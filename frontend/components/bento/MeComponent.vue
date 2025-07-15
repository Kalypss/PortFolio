<template>
  <div class="me-tile">
    <!-- Image de profil prenant 3/4 de la hauteur -->
    <div class="profile-image-container">
      <img 
        src="/img/me.png" 
        alt="Florian SILVA" 
        class="profile-image"
      />
    </div>
    
    <!-- Contenu textuel en bas à gauche -->
    <div class="me-content">
      <h2 class="greeting">{{ greetingText }}</h2>
      <h1 class="name">{{ nameText }}</h1>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

// Utiliser le composable de langue
const { currentLanguage } = useLanguage()

// Textes adaptés selon la langue
const greetingText = computed(() => {
  return currentLanguage.value === 'fr' ? "PortFolio" : "PortFolio"
})

const nameText = computed(() => {
  return currentLanguage.value === 'fr' ? "2025" : "2025"
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

.me-tile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.profile-image-container {
  height: 90%;
  width: 100%;
  transform: scale(1.05);
  overflow: hidden;
  position: relative;
}

.profile-image-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to bottom, transparent 0%, rgba(15, 15, 15, 0.3) 30%, rgba(15, 15, 15, 0.8) 70%, #0F0F0F 100%);
  pointer-events: none;
  z-index: 2;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.3s ease;
}

.me-content {
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding: 16px 20px;
  background: #0F0F0F;
  gap: 0;
}

.greeting {
  font-family: 'DM Serif Display', serif;
  font-size: 2vw;
  font-weight: 400;
  color: #FFFFFF;
  margin: 0;
  line-height: 0.2;

}

.name {
  font-family: 'DM Sans', serif;
  font-size: 4vw;
  font-weight: 400;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -2px;
}

/* Responsive */
@media (max-width: 1380px) {
  .me-content {
    padding: 6px 10px;
    justify-content: center;
    align-items: center;
  }
  
  .profile-image-container {
    height: 100%;
    width: 100%;
    transform: scale(1);
    overflow: hidden;
    position: relative;
  }
  .greeting {
  font-family: 'DM Serif Display', serif;
  font-size: 4vw;

}

.name {
  font-family: 'DM Sans', serif;
  font-size: 8vw;
}
}

@media (max-width: 640px) {
  .me-content {
    padding: 8px 12px;
  }
  
  .greeting {
    font-size: 8vw;
  }
  
  .name {
    font-size: 18vw;
    letter-spacing: -2px;
    font-weight: 400;

  }
}

@media (max-width: 480px) {
  .me-content {
    padding: 6px 10px;
    justify-content: center;
    align-items: center;
  }
  
  .profile-image-container {
    height: 100%;
    width: 100%;
    transform: scale(1);
    overflow: hidden;
    position: relative;
  }
}
</style>
