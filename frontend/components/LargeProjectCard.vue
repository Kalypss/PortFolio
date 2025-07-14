<template>
  <div 
    ref="cardElement"
    class="large-project-card"
    :class="{ 
      'card-visible': isVisible,
      'card-xlarge': isXLarge
    }"
  >
    <!-- Image de fond -->
    <div class="card-background" :style="{ backgroundImage: `url(${imageUrl || placeholderImage})` }"></div>
    
    <!-- Overlay avec gradient -->
    <div class="card-overlay"></div>
    
    <!-- Contenu de la card -->
    <div class="card-content">
      <!-- Header avec statut -->
      <div class="card-header">
        <span class="card-status" :class="`status--${status.toLowerCase().replace(' ', '-')}`">
          <img v-if="getStatusIcon(status)" :src="getStatusIcon(status)" alt="status" class="status-icon" />
          <span v-else class="status-icon-fallback">●</span>
          {{ status }}
        </span>
      </div>
      
      <!-- Corps principal -->
      <div class="card-body">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-description">{{ description }}</p>
        
        <!-- Technologies -->
        <div class="card-technologies">
          <span 
            v-for="(tech, index) in technologies" 
            :key="tech" 
            class="tech-badge"
            :style="{ 
              backgroundColor: `rgba(${hexToRgb(techLabelColor)}, 0.15)`,
              borderColor: techLabelColor,
              color: techLabelColor 
            }"
          >
            <img v-if="getTechIcon(technologiesIcons[index])" :src="getTechIcon(technologiesIcons[index])" alt="tech" class="tech-icon" />
            <span v-else-if="technologiesIcons[index]" class="tech-icon-fallback">{{ technologiesIcons[index] }}</span>
            {{ tech }}
          </span>
        </div>
      </div>
      
      <!-- Footer avec bouton -->
      <div class="card-footer">
        <a 
          :href="link" 
          class="card-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Voir le projet</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'In Progress',
    validator: value => ['In Progress', 'Completed', 'On Hold'].includes(value)
  },
  technologiesIcons: {
    type: Array,
    default: () => []
  },
  technologies: {
    type: Array,
    default: () => []
  },
  techLabelColor: {
    type: String,
    default: '#ffffff'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: '#'
  },
  isXLarge: {
    type: Boolean,
    default: false
  }
})

const cardElement = ref(null)
const isVisible = ref(false)

// Image placeholder si aucune image n'est fournie
const placeholderImage = computed(() => {
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2d3748"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="32" fill="#a0aec0" text-anchor="middle" dy=".3em">Project Image</text>
    </svg>
  `)
})

// Fonction pour obtenir l'icône de statut
const getStatusIcon = (status) => {
  const icons = {
    'In Progress': '/icons/progressicon.png',
    'Completed': '/icons/checkicon.png',
    'On Hold': null
  }
  return icons[status]
}

// Fonction pour obtenir l'icône de technologie
const getTechIcon = (icon) => {
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.svg') || icon.includes('.png') || icon.includes('.jpg'))) {
    return icon
  }
  return null
}

// Fonction pour convertir une couleur hex en RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255'
}

// Observer pour l'animation au scroll
let observer = null

const setupScrollObserver = () => {
  if (!cardElement.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Délai pour créer un effet séquentiel
          setTimeout(() => {
            isVisible.value = true
          }, 100)
        }
      })
    },
    {
      threshold: 0.2, // Se déclenche quand 20% de la card est visible
      rootMargin: '0px 0px -100px 0px' // Déclenche un peu avant que la card soit complètement visible
    }
  )

  observer.observe(cardElement.value)
}

onMounted(() => {
  setupScrollObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.large-project-card {
  width: 100%;
  max-width: 800px;
  height: 500px;
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  cursor: pointer;
  background: #1a1a1a;
  
  /* Animation initiale - card cachée */
  opacity: 0;
  transform: perspective(1000px) rotateX(45deg) translateY(100px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Ombre dynamique */
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Version XL - 2 fois plus grande */
.large-project-card.card-xlarge {
  max-width: 1600px;
  height: 1000px;
}

.large-project-card.card-visible {
  /* Animation de révélation - card visible avec effet 3D */
  opacity: 1;
  transform: perspective(1000px) rotateX(0deg) translateY(0px);
  
  /* Ombre plus prononcée quand visible */
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 12px 35px rgba(0, 0, 0, 0.3);
}

.large-project-card:hover {
  /* Effet au hover - légère rotation et élévation */
  transform: perspective(1000px) rotateX(-2deg) translateY(-10px) scale(1.02);
  
  /* Ombre encore plus prononcée au hover */
  box-shadow: 
    0 40px 100px rgba(0, 0, 0, 0.5),
    0 16px 45px rgba(0, 0, 0, 0.4);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.6s ease;
  z-index: 1;
}

.large-project-card:hover .card-background {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 2;
}

.card-content {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  color: white;
}

/* Padding plus grand pour les XL cards */
.large-project-card.card-xlarge .card-content {
  padding: 80px;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  backdrop-filter: blur(10px);
}

.status--in-progress {
  background: rgba(222, 152, 0, 0.2);
  color: #de9800;
  border: 1px solid rgba(222, 152, 0, 0.3);
}

.status--completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status--on-hold {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-icon {
  width: 16px;
  height: 16px;
}

.status-icon-fallback {
  font-size: 10px;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

/* Espacement plus grand pour les XL cards */
.large-project-card.card-xlarge .card-body {
  gap: 48px;
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  letter-spacing: -2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Titre plus grand pour les XL cards */
.large-project-card.card-xlarge .card-title {
  font-size: 96px;
  letter-spacing: -4px;
}

.card-description {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
  max-width: 600px;
}

/* Description plus grande pour les XL cards */
.large-project-card.card-xlarge .card-description {
  font-size: 36px;
  max-width: 1200px;
}

.card-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* Badges plus grands pour les XL cards */
.large-project-card.card-xlarge .tech-badge {
  padding: 16px 32px;
  font-size: 28px;
  border-radius: 32px;
  gap: 16px;
}

.tech-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tech-icon {
  width: 16px;
  height: 16px;
}

/* Icônes plus grandes pour les XL cards */
.large-project-card.card-xlarge .tech-icon {
  width: 32px;
  height: 32px;
}

.tech-icon-fallback {
  font-size: 14px;
}

/* Fallback plus grand pour les XL cards */
.large-project-card.card-xlarge .tech-icon-fallback {
  font-size: 28px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.card-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

/* Bouton plus grand pour les XL cards */
.large-project-card.card-xlarge .card-button {
  padding: 32px 64px;
  font-size: 32px;
  border-radius: 48px;
  gap: 24px;
}

.card-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-button svg {
  transition: transform 0.3s ease;
}

.card-button:hover svg {
  transform: translateX(4px) translateY(-4px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .large-project-card {
    max-width: 700px;
    height: 450px;
  }
  
  .card-content {
    padding: 32px;
  }
  
  .card-title {
    font-size: 40px;
  }
  
  .card-description {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .large-project-card {
    max-width: 100%;
    height: 400px;
    margin: 0 16px;
  }
  
  .card-content {
    padding: 24px;
  }
  
  .card-title {
    font-size: 32px;
  }
  
  .card-description {
    font-size: 15px;
  }
  
  .card-button {
    padding: 12px 24px;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .large-project-card {
    height: 350px;
    border-radius: 24px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-title {
    font-size: 28px;
    letter-spacing: -1px;
  }
  
  .card-description {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .card-technologies {
    gap: 8px;
  }
  
  .tech-badge {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .card-button {
    padding: 10px 20px;
    font-size: 13px;
    border-radius: 20px;
  }
}

@media (max-width: 480px) {
  .large-project-card {
    height: 320px;
    margin: 0 12px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .card-body {
    gap: 16px;
  }
  
  .card-title {
    font-size: 24px;
  }
  
  .card-description {
    font-size: 13px;
  }
  
  /* Simplifier sur très petits écrans */
  .large-project-card:hover {
    transform: perspective(1000px) rotateX(0deg) translateY(-5px) scale(1.01);
  }
}
</style>
