<template>
  <div class="card" :class="[`card--${theme}`]">
    <!-- Structure différente selon le thème -->
    
    <!-- Thème dark : image et informations séparées -->
    <template v-if="theme === 'dark'">
      <!-- Image de la card -->
      <div class="card-image">
        <NuxtImg 
          :src="imageUrl || placeholderImage" 
          :alt="`Aperçu du projet ${title}`"
          class="card-image-element"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:100vw md:50vw lg:400px"
        />
      </div>
      
      <!-- Informations en dessous de l'image -->
      <div class="card-informations">
        <div class="card-header">
          <h3 class="card-title">{{ title }}</h3>
          <span class="card-status" :class="`status--${status.toLowerCase().replace(' ', '-')}`">
            <img v-if="getStatusIcon(status)" :src="getStatusIcon(status)" alt="status" class="status-icon" />
            <span v-else class="status-icon-fallback">●</span>
            {{ status }}
          </span>
        </div>
        <p class="card-description">
          {{ description }}
        </p>
        <div class="card-footer">
          <div class="card-techs">
            <span 
              v-for="(tech, index) in technologies" 
              :key="tech" 
              class="tech-tag"
              :class="`tech-tag--${theme}`"
              :style="{ 
                backgroundColor: `rgba(${hexToRgb(techLabelColor)}, 0.4)`, 
                color: techLabelColor 
              }"
            >
              <img v-if="getTechIcon(technologiesIcons[index])" :src="getTechIcon(technologiesIcons[index])" alt="tech" class="tech-icon" />
              <span v-else-if="technologiesIcons[index]" class="tech-icon-fallback">{{ technologiesIcons[index] }}</span>
              {{ tech }}
            </span>
          </div>
          <a 
            :href="link" 
            class="card-more-button"
            :class="`card-more-button--${theme}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            Let's See →
          </a>
        </div>
      </div>
    </template>
    
    <!-- Thème white : image pleine avec overlay gradient blur -->
    <template v-else>
      <!-- Image de la card qui prend toute la place -->
      <div class="card-image">
        <NuxtImg 
          :src="imageUrl || placeholderImage" 
          :alt="`Aperçu du projet ${title}`"
          class="card-image-element"
          loading="lazy"
          format="webp"
          quality="80"
          sizes="sm:100vw md:50vw lg:400px"
        />
      </div>
      
      <!-- Overlay avec gradient blur intégré -->
      <div class="card-overlay">
        <div class="card-informations">
          <div class="card-header">
            <h3 class="card-title">{{ title }}</h3>
            <span class="card-status" :class="`status--${status.toLowerCase().replace(' ', '-')}`">
              <img v-if="getStatusIcon(status)" :src="getStatusIcon(status)" alt="status" class="status-icon" />
              <span v-else class="status-icon-fallback">●</span>
              {{ status }}
            </span>
          </div>
          <p class="card-description">
            {{ description }}
          </p>
          <div class="card-footer">
            <div class="card-techs">
              <span 
                v-for="(tech, index) in technologies" 
                :key="tech" 
                class="tech-tag"
                :class="`tech-tag--${theme}`"
                :style="{ 
                  backgroundColor: `rgba(${hexToRgb(techLabelColor)}, 0.4)`, 
                  color: techLabelColor 
                }"
              >
                <img v-if="getTechIcon(technologiesIcons[index])" :src="getTechIcon(technologiesIcons[index])" alt="tech" class="tech-icon" />
                <span v-else-if="technologiesIcons[index]" class="tech-icon-fallback">{{ technologiesIcons[index] }}</span>
                {{ tech }}
              </span>
            </div>
            <a 
              :href="link" 
              class="card-more-button"
              :class="`card-more-button--${theme}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let's See →
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
    default: '#ffffff' // Couleur par défaut blanche
  },
  imageUrl: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: '#'
  },
  theme:{
    type: String,
    default: 'dark'
  }
});

// Image placeholder si aucune image n'est fournie
const placeholderImage = computed(() => {
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg width="400" height="625" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2d3748"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#a0aec0" text-anchor="middle" dy=".3em">No Image</text>
    </svg>
  `);
});

// Fonction pour obtenir l'icône de statut
const getStatusIcon = (status) => {
  const icons = {
    'In Progress': '/assets/progressicon.png', // Chemin vers votre icône de progress
    'Completed': '/assets/checkicon.png', // Chemin vers votre icône de completed
    'On Hold': null // Pas d'icône pour On Hold, utilise le fallback
  };
  return icons[status];
};

// Fonction pour obtenir l'icône de technologie
const getTechIcon = (icon) => {
  // Si c'est un chemin de fichier (commence par / ou contient .svg, .png, etc.)
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.svg') || icon.includes('.png') || icon.includes('.jpg'))) {
    return icon;
  }
  // Sinon c'est un emoji ou autre, on retourne null pour utiliser le fallback
  return null;
};

// Fonction pour convertir une couleur hex en RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255'; // Fallback en blanc si la conversion échoue
};
</script>

<style scoped>
.card {
  width: 400px;
  height: 625px;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Thème dark */
.card--dark {
  background: #1a1a1a;
}

/* Thème white */
.card--white {
  background: #1a1a1a;
  position: relative;
}

/* Image pour le thème dark - plus petite */
.card--dark .card-image {
  width: 380px;
  height: 380px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #2d3748;
  border-radius: 18px;
  margin-top: 10px;;
}

/* Image pour le thème white - prend toute la card avec marges */
.card--white .card-image {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #1a1a1a;
  border-radius: 18px;
}

/* Informations pour le thème dark - en dessous de l'image */
.card--dark .card-informations {
  padding: 30px 28px 25px 28px;;
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Overlay avec gradient blur pour le thème white */
.card--white .card-overlay {
  position: absolute;
  top: 280px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px 28px 25px 28px;
  border-radius: 0 0 18px 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card--white .card-overlay::before,
.card--white .card-overlay::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

.card--white .card-overlay::before {
  backdrop-filter: blur(1px);
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 25%,
    rgba(0, 0, 0, 1) 100%
  );
}

.card--white .card-overlay::after {
  backdrop-filter: blur(8px);
  mask: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 1) 100%
  );
}

.card--white .card-informations {
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
  gap: 15px;
}

.card-title {
  font-size: 32px;
  font-weight: normal;
  margin: 0;
  letter-spacing: -2px;
  line-height: 1.2;
}

.card-status {
  background: rgba(222, 152, 0, 0.4);
  color: rgba(222, 152, 0);
  padding: 6px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 200;
  white-space: nowrap;
  text-transform: capitalize;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  max-height: 25px;
  gap: 6px;
}

.status-icon {
  width: 15px;
  height: 15px;
}

.status-icon-fallback {
  font-size: 8px;
}

.status--completed {
  background: rgba(16, 185, 129, 0.5);
  color: #10b981;
}

.status--on-hold {
  background: rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

.card-description {
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.card--white .card-description {
  opacity: 0.8;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: auto;
}

.card-techs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.tech-tag {
  background: rgba(255, 255, 255, 0.4); /* Opacité 40% par défaut */
  color: white; /* Couleur par défaut */
  padding: 6px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 200;
  white-space: nowrap;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  max-height: 25px;
  gap: 6px;
}

.tech-tag--white {
  background: rgba(0, 0, 0, 0.4); /* Opacité 40% pour le thème blanc */
  color: #1a1a1a;
}

.tech-icon {
  width: 15px;
  height: 15px;
}

.tech-icon-fallback {
  font-size: 14px;
}

.card-more-button {
  background: transparent;
  border: none;
  color: white;
  padding: 8px 0;
  text-decoration: underline;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-underline-offset: 4px;
}


.card-more-button--white {
  color: #1a1a1a;
}

/* Styles pour les images optimisées */
.card-image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  transition: transform 0.3s ease;
}


/* Responsive Design */
@media (max-width: 1024px) {
  .card {
    width: 100%;
    max-width: 450px;
    height: 550px;
  }
  
  .card--dark .card-image {
    height: 320px;
  }
  
  .card--white .card-overlay {
    top: 220px;
  }
}

@media (max-width: 768px) {
  .card {
    width: 100%;
    max-width: 380px;
    height: 500px;
  }
  
  .card--dark .card-image {
    height: 280px;
    width: 95%;
  }
  
  .card--white .card-overlay {
    top: 180px;
  }
  
  .card--dark .card-informations,
  .card--white .card-overlay {
    padding: 18px;
  }
  
  .card-title {
    font-size: 26px;
  }
  
  .card-description {
    font-size: 15px;
    margin-bottom: 16px;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-more-button {
    align-self: flex-end;
  }
}

@media (max-width: 640px) {
  .card {
    height: 480px;
    max-width: 350px;
  }
  
  .card--dark .card-image {
    height: 260px;
    width: 94%;
  }
  
  .card--white .card-overlay {
    top: 160px;
  }
  
  .card--dark .card-informations,
  .card--white .card-overlay {
    padding: 16px;
  }
  
  .card-title {
    font-size: 24px;
  }
  
  .card-description {
    font-size: 14px;
  }
  
  .tech-tag {
    font-size: 13px;
    padding: 5px;
  }
  
  .card-more-button {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .card {
    height: 450px;
    max-width: 320px;
  }
  
  .card--dark .card-image {
    height: 240px;
    width: 93%;
  }
  
  .card--white .card-overlay {
    top: 140px;
  }
  
  .card--dark .card-informations,
  .card--white .card-overlay {
    padding: 14px;
  }
  
  .card-title {
    font-size: 22px;
  }
  
  .card-description {
    font-size: 13px;
  }
  
  .tech-tag {
    font-size: 12px;
    padding: 4px;
  }
  
  .card-more-button {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  .card {
    height: 420px;
    max-width: 300px;
  }
  
  .card--dark .card-image {
    height: 220px;
    width: 92%;
  }
  
  .card--white .card-overlay {
    top: 120px;
  }
  
  .card--dark .card-informations,
  .card--white .card-overlay {
    padding: 12px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .card-description {
    font-size: 12px;
  }
  
  .tech-tag {
    font-size: 11px;
    padding: 3px;
  }
  
  .card-more-button {
    font-size: 13px;
  }
}
</style>