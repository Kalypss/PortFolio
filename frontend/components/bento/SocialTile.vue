<template>
  <div 
    class="social-tile" 
    @mouseenter="isHovered = true" 
    @mouseleave="isHovered = false"
  >
    <!-- Background image qui apparaît au hover -->
    <div 
      class="social-background"
      :class="{ 'visible': isHovered }"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
    
    <!-- Overlay gradient -->
    <div class="social-overlay" :class="{ 'visible': isHovered }"></div>
    
    <!-- Contenu de la tile -->
    <div class="social-content">
      <!-- Logo du réseau social en haut à gauche -->
      <div class="social-logo">
        <!-- LinkedIn SVG -->
        <svg v-if="platform === 'linkedin'" class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        
        <!-- Twitter/X SVG -->
        <svg v-else-if="platform === 'twitter'" class="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        
        <!-- Fallback générique -->
        <div v-else class="logo-fallback">{{ platform.charAt(0).toUpperCase() }}</div>
      </div>
      
      <!-- Description alignée à gauche sous le logo -->
      <p class="social-description">{{ description }}</p>
      
      <!-- Bouton Follow en bas à droite -->
      <button class="follow-button" @click="openSocialLink">
        Follow +
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  platform: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  backgroundImageUrl: {
    type: String,
    default: ''
  },
  socialLink: {
    type: String,
    required: true
  }
})

const isHovered = ref(false)
const { currentTheme } = useTheme()

// Image de background avec fallback vers une image aléatoire
const backgroundImage = computed(() => {
  if (props.backgroundImageUrl) {
    return props.backgroundImageUrl
  }
  
  // Utiliser une image aléatoire depuis Picsum (comme dans ProjectCard)
  const seed = props.platform.toLowerCase()
  return `https://picsum.photos/seed/${seed}/400/300`
})

// Fonction pour ouvrir le lien du réseau social
const openSocialLink = () => {
  window.open(props.socialLink, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.social-tile {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Background image */
.social-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.social-background.visible {
  opacity: 1;
}

/* Overlay gradient */
.social-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.social-overlay.visible {
  opacity: 1;
}

/* Contenu */
.social-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  padding: 30px;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease;
}

/* Logo en haut à gauche */
.social-logo {
  align-self: flex-start;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}



.logo-image {
  width: 45px;
  height: 45px;
  object-fit: contain;
  filter: brightness(0) invert(1); /* Rendre le logo blanc */
  transition: filter 0.3s ease;
}

/* SVG Logo adaptatif au thème */
.logo-svg {
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}

/* Couleur du SVG selon le thème */
.logo-svg path {
  fill: var(--text-primary);
  transition: fill 0.3s ease;
}

.social-tile:hover .logo-svg path {
  fill: white;
}

/* Fallback pour logos inconnus */
.logo-fallback {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.social-tile:hover .logo-fallback {
  background: white;
  color: var(--bg-primary);
}

/* Description alignée à gauche sous le logo */
.social-description {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  text-align: left;
  margin-bottom: auto;
  max-width: 80%;
  transition: color 0.3s ease;
}

.social-tile:hover .social-description {
  color: white;
}

/* Bouton Follow en bas à droite */
.follow-button {
  align-self: flex-end;
  margin-top: auto;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 10px 20px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.follow-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
  transform: translateY(-1px);
}

.social-tile:hover .follow-button {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.social-tile:hover .logo-image {
  filter: brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Responsive */
@media (max-width: 1200px) {
  .social-content {
    padding: 18px;
  }
  
  .logo-image,
  .logo-svg,
  .logo-fallback {
    width: 40px;
    height: 40px;
  }
  
  .logo-fallback {
    font-size: 18px;
  }
  
  .social-description {
    font-size: 15px;
  }
  
  .follow-button {
    padding: 9px 18px;
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .social-content {
    padding: 16px;
  }
  
  .logo-image,
  .logo-svg,
  .logo-fallback {
    width: 36px;
    height: 36px;
  }
  
  .logo-fallback {
    font-size: 16px;
  }
  
  .social-description {
    font-size: 14px;
  }
  
  .follow-button {
    padding: 8px 16px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .social-content {
    padding: 14px;
  }
  
  .logo-image,
  .logo-svg,
  .logo-fallback {
    width: 32px;
    height: 32px;
  }
  
  .logo-fallback {
    font-size: 14px;
  }
   .social-background {
    opacity: 0.9;
    
  }
  
  .social-description {
    font-size: 13px;
  }
  
  .follow-button {
    padding: 7px 14px;
    font-size: 11px;
  }
}

@media (max-width: 640px) {
  .social-content {
    padding: 12px;
  }
  
  .logo-image,
  .logo-svg,
  .logo-fallback {
    width: 28px;
    height: 28px;
  }
  
  .logo-fallback {
    font-size: 12px;
  }
  
  .social-description {
    font-size: 12px;
    max-width: 90%;
  }
  
  .follow-button {
    padding: 6px 12px;
    font-size: 10px;
    border-radius: 20px;
  }
  
  /* Afficher l'image de fond par défaut sur mobile */
  .social-background {
    opacity: 0.9;
  }
  
  .social-overlay {
    opacity: 1;
  }
  
  /* Ajuster les couleurs pour la visibilité sur fond d'image */
  .social-description {
    color: white;
  }
  
  .logo-svg path {
    fill: white;
  }
  
  
  .logo-fallback {
    background: white;
    color: var(--bg-primary);
  }
  
  .follow-button {
    color: white;
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

@media (max-width: 480px) {
  .social-content {
    padding: 14px;
  }

  .social-tile{
    border-radius: 20px;
  }
  
  .logo-image,
  .logo-svg,
  .logo-fallback {
    width: 24px;
    height: 24px;
  }
  
  .logo-fallback {
    font-size: 10px;
    border-radius: 6px;
  }
  
  .social-description {
    font-size: 16px;
    max-width: 95%;
    line-height: 1.2;
    margin-bottom: 10px;
  }
  
  .follow-button {
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 16px;
  }
  
  /* Conserver l'affichage de l'image sur très petits écrans */
  .social-background {
    opacity: 0.9;
    
  }
  
  .social-overlay {
    opacity: 1;
  }
  
  .social-description {
    color: white;
  }
  
  .logo-svg path {
    fill: white;
  }
  
  .logo-fallback {
    background: white;
    color: var(--bg-primary);
  }
  
  .follow-button {
    color: white;
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
}
</style>
