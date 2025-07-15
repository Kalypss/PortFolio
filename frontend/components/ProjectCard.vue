<template>
  <div class="card" :class="[`card--${theme}`]">
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
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <span class="card-status" :class="`status--${status.toLowerCase().replace(' ', '-')}`">
          <img v-if="getStatusIcon(status)" :src="getStatusIcon(status)" alt="status" class="status-icon" />
          <span v-else class="status-icon-fallback">●</span>
          {{ status }}
        </span>
      </div>
      <p class="card-description">{{ translatedDescription }}</p>
      <div class="card-footer">
        <div class="card-techs">
          <span v-for="(tech, index) in technologies" :key="tech" class="tech-tag">
            <img v-if="getTechIcon(technologiesIcons[index])" :src="getTechIcon(technologiesIcons[index])" alt="tech" class="tech-icon" />
            <span v-else-if="technologiesIcons[index]" class="tech-icon-fallback">{{ technologiesIcons[index] }}</span>
            {{ tech }}
          </span>
        </div>
        <a :href="link" class="card-more-button" target="_blank" rel="noopener noreferrer">
          {{ buttonText }} →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLanguage } from '~/composables/useLanguage.js';
import { useTheme } from '~/composables/useTheme.js';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: Object, // Changé en Object pour les traductions
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
  }
});

const { currentLanguage, t } = useLanguage();
const { currentTheme: theme } = useTheme(); // Correction ici

// Description traduite
const translatedDescription = computed(() => {
  return props.description[currentLanguage.value] || props.description.en;
});

// Texte du bouton traduit
const buttonText = computed(() => t('viewProject'));

// Image placeholder si aucune image n'est fournie
const placeholderImage = computed(() => {
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg width="400" height="625" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2d3748"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#a0aec0" text-anchor="middle" dy=".3em">No Image</text>
    </svg>
  `);
});

// Fonctions utilitaires (icônes, couleurs)
const getStatusIcon = (status) => {
  const icons = {
    'In Progress': '/assets/progressicon.png',
    'Completed': '/assets/checkicon.png',
    'On Hold': null
  };
  return icons[status];
};

const getTechIcon = (icon) => {
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.includes('.svg') || icon.includes('.png') || icon.includes('.jpg'))) {
    return icon;
  }
  return null;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
};
</script>

<style scoped>
.card {
  width: 400px;
  height: 625px;
  border-radius: 28px;
  overflow: hidden;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

/* --- Thèmes --- */
.card--dark {
  background: #1a1a1a;
}

.card--light {
  background: #d8d8d8;
  border: 1px solid #e0e0e0;
}

.tech-icon{
  width: 14px;
  height: 14px;
}

.card-image {
  width: 380px;
  height: 380px;
  border-radius: 18px;
  overflow: hidden;
  background-color: #2d3748; /* Placeholder background */
}

.card-image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 20px 28px 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;
}

.card-description {
  font-size: 18px;
  line-height: 1.3;
  letter-spacing: -0.5px;
  flex-grow: 1;
  transition: color 0.3s ease;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
}

.card-techs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-tag {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card-more-button {
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.2s ease;
}

.card-status {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  width: 15px;
  height: 15px;
}

/* --- Couleurs par thème --- */

/* Dark Theme */
.card--dark .card-title { color: white; }
.card--dark .card-description { color: rgba(255, 255, 255, 0.7); }
.card--dark .tech-tag { background: rgba(255, 255, 255, 0.1); color: white; }
.card--dark .card-more-button { color: white; }

/* Light Theme */
.card--light .card-title { color: #1a1a1a; }
.card--light .card-description { color: #666666; }
.card--light .tech-tag { background: #f0f0f0; color: #333333; border: 1px solid #e0e0e0; }
.card--light .card-more-button { color: #1a1a1a; }

/* Status (indépendant du thème) */
.status--completed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status--in-progress { background: rgba(222, 152, 0, 0.2); color: #de9800; }
.status--on-hold { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

/* --- Responsive --- */
@media (max-width: 480px) {
  .card { width: 100%; max-width: 320px; height: 480px; }
  .card-image { width: calc(100% - 20px); height: 260px; }
  .card-title { font-size: 24px; }
  .card-description { font-size: 15px; }
}
</style>