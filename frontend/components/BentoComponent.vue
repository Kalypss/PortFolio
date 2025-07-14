<template>
  <div class="bento-section" id="bento-section">
    <div class="bento-container h-full relative z-10">

      <div class="bento-grid" ref="bentoGrid">
      
        <div id="top-tile" class="tile tile-span-10-1 tile-animate" data-delay="0">
          <TopTile />
        </div>
      
        <div id="about-tile" class="tile tile-span-4-5 tile-animate clickable-tile" data-delay="200" @click="openModal">
          <AboutMeTile />
        </div>
      
        <div id="me-tile" class="tile tile-span-2-5 tile-animate" data-delay="250">
          <MeComponent />
        </div>
      
        <div id="linkedin-tile" class="tile tile-span-2-2 tile-animate" data-delay="300">
          <SocialTile 
            platform="linkedin"
            description="Florian SILVA"
            backgroundImageUrl="./img/bg1.png"
            social-link="https://www.linkedin.com/in/florian-silva-139ba4374/"
          />
        </div>
      
        <div id="twitter-tile" class="tile tile-span-2-2 tile-animate" data-delay="350">
          <SocialTile 
            platform="twitter"
            backgroundImageUrl="./img/bg2.png"
            description="K4lyps"
            social-link="https://x.com/K4lyps"
          />
        </div>
      
        <div id="contact-tile" class="tile tile-span-4-3 tile-animate" data-delay="400">
          <ContactTile />
        </div>
      
        <div id="github-tile" class="tile tile-span-4-2 tile-animate" data-delay="450">
          <GitHubTile />
        </div>
      
        <div id="project-tile" class="tile tile-span-2-2 tile-animate" data-delay="500">
          <ProjectComponent />
        </div>
      
        <div id="theme-toggle-tile" class="tile tile-span-3-1 tile-animate" data-delay="550">
          <ThemeToggle 
            v-model="currentTheme" 
            @theme-change="handleThemeChange"
          />
        </div>
      
        <div id="open-to-work-tile" class="tile tile-span-1-2 open-to-work-tile tile-animate" data-delay="600">
          <OpenToWork />
        </div>
      
        <div id="change-language-tile" class="tile tile-span-3-1 tile-animate" data-delay="650">
          <LanguageSlider 
            v-model="currentLanguage" 
            @language-change="handleLanguageChange"
          />
        </div>
      
      </div>
    </div>

    <!-- Modal About Me -->
    <ModalComponent 
      :is-open="isModalOpen" 
      :title="modalTitle"
      @close="closeModal"
    >
      <AboutMeModalContent />
    </ModalComponent>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue'
import LanguageSlider from './bento/LanguageSlider.vue'
import ThemeToggle from './bento/ThemeToggle.vue'
import OpenToWork from './bento/OpenToWork.vue'
import TopTile from './bento/TopTile.vue'
import GitHubTile from './bento/GitHubTile.vue'
import SocialTile from './bento/SocialTile.vue'
import MeComponent from './bento/MeComponent.vue'
import ProjectComponent from './bento/ProjectComponent.vue'
import ContactTile from './bento/ContactTile.vue'
import AboutMeTile from './bento/AboutMeTile.vue'
import ModalComponent from './bento/ModalComponent.vue'
import AboutMeModalContent from './bento/AboutMeModalContent.vue'
import { useLanguage } from '@/composables/useLanguage' 
import { useTheme } from '@/composables/useTheme'

// Refs
const bentoGrid = ref(null)
let observer = null

// État du modal
const isModalOpen = ref(false)

// Utiliser le composable de langue
const { currentLanguage, setLanguage, t, initLanguage } = useLanguage()

// Utiliser le composable de thème
const { currentTheme, setTheme, initTheme } = useTheme()

// Fonctions du modal
const openModal = () => {
  isModalOpen.value = true
  // Empêcher le scroll du body
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  // Rétablir le scroll du body
  document.body.style.overflow = ''
}

// Titre du modal selon la langue
const modalTitle = computed(() => {
  return currentLanguage.value === 'fr' ? 'À propos de moi' : 'About Me'
})

// Animation des tiles au scroll
const setupScrollAnimations = () => {
  if (!bentoGrid.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tiles = entry.target.querySelectorAll('.tile-animate')
          tiles.forEach((tile, index) => {
            const delay = parseInt(tile.dataset.delay) || 0
            setTimeout(() => {
              tile.classList.add('tile-visible')
            }, delay)
          })
          // Déconnecter l'observer une fois l'animation déclenchée
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1, // Déclenche quand 10% de la section est visible
      rootMargin: '-100px 0px -100px 0px' // Déclenche plus près du centre de l'écran
    }
  )

  observer.observe(bentoGrid.value)
}


// Gérer le changement de langue
const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage)
}

// Gérer le changement de thème
const handleThemeChange = (newTheme) => {
  setTheme(newTheme)
}

// Initialiser au montage du composant
onMounted(async () => {
  initLanguage()
  initTheme()
  
  await nextTick()
  setupScrollAnimations()
})

// Nettoyer au démontage
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  // Rétablir le scroll du body
  document.body.style.overflow = ''
  // Optionnel : retirer le scroll snap si nécessaire
})
</script>

<style scoped>
.bento-section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.bento-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  transition: background 0.3s ease;
}

.bento-grid {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 30px;
  padding: 30px;
  margin: 0;
}

.tile {
  background: var(--bg-secondary);
  border-radius: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

/* Animation des tiles */
.tile-animate {
  opacity: 0;
  transform: translateY(40px) scale(0.92);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
}

.tile-animate.tile-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Tiles cliquables */
.clickable-tile {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}



/* Améliorations pour les performances */
.tile {
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.tile p {
  color: var(--text-primary);
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* Grille spans */
.tile-span-10-1 { grid-column: span 10; grid-row: span 1; }
.tile-span-4-1 { grid-column: span 4; grid-row: span 1; }
.tile-span-2-5 { grid-column: span 2; grid-row: span 5; }
.tile-span-2-2 { grid-column: span 2; grid-row: span 2; }
.tile-span-4-5 { grid-column: span 4; grid-row: span 5; }
.tile-span-4-3 { grid-column: span 4; grid-row: span 3; }
.tile-span-4-2 { grid-column: span 4; grid-row: span 2; }
.tile-span-3-1 { grid-column: span 3; grid-row: span 1; }
.tile-span-1-2 { grid-column: span 1; grid-row: span 2; }

/* Style spécial pour les tiles sociales */
#linkedin-tile,
#twitter-tile {
  padding: 0;
  overflow: hidden;
}

/* Style spécial pour la tile Open to work */
.open-to-work-tile {
  padding: 0;
  overflow: hidden;
}

.open-to-work-tile .tile {
  padding: 0;
}

/* Style spécial pour la tile GitHub */
#github-tile {
  padding: 0;
  overflow: hidden;
}

/* Style spécial pour la tile Me */
#me-tile {
  padding: 0;
  overflow: hidden;
}

/* Style spécial pour la tile Project */
#project-tile {
  padding: 0;
  overflow: hidden;
}

/* Style spécial pour la tile Contact */
#contact-tile {
  padding: 0;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 1200px) {
  .bento-grid {
    gap: 25px;
    padding: 25px;
  }
}

@media (max-width: 992px) {
  .bento-grid {
    gap: 22px;
    padding: 22px;
  }
  
  .tile p {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .bento-container {
    height: auto;
    padding: 10px 0;
  }
  
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    gap: 15px;
    padding: 15px;
    height: auto;
  }
  
  .tile {
    min-height: 80px;
  }
  
  .tile p {
    font-size: 14px;
  }
  
  /* Redistribution des tiles pour mobile */
  #top-tile { grid-column: span 4; grid-row: span 1; }
  #me-tile { grid-column: span 4; grid-row: span 2; }
  #linkedin-tile { grid-column: span 2; grid-row: span 2; }
  #twitter-tile { grid-column: span 2; grid-row: span 2; }
  #about-tile { grid-column: span 4; grid-row: span 3; }
  #github-tile { grid-column: span 4; grid-row: span 2; }
  #contact-tile { grid-column: span 4; grid-row: span 2; }
  #project-tile { grid-column: span 4; grid-row: span 2; }
  #theme-toggle-tile { grid-column: span 3; grid-row: span 1; }
  #open-to-work-tile { grid-column: span 1; grid-row: span 2; }
  #change-language-tile { grid-column: span 3; grid-row: span 1; }
}

@media (max-width: 640px) {
  .bento-grid {
    gap: 12px;
    padding: 12px;
  }
  
  .tile {
    min-height: 70px;
    border-radius: 28px;
  }
  
  .tile p {
    font-size: 13px;
  }
  
  /* Layout encore plus compact pour petits mobiles */
  #top-tile { grid-column: span 4; grid-row: span 1; }
  #me-tile { grid-column: span 4; grid-row: span 2; }
  #linkedin-tile { grid-column: span 2; grid-row: span 2; }
  #twitter-tile { grid-column: span 2; grid-row: span 2; }
  #about-tile { grid-column: span 4; grid-row: span 3; }
  #github-tile { grid-column: span 4; grid-row: span 2; }
  #contact-tile { grid-column: span 4; grid-row: span 2; }
  #project-tile { grid-column: span 4; grid-row: span 2; }
  #theme-toggle-tile { grid-column: span 2; grid-row: span 1; }
  #open-to-work-tile { grid-column: span 2; grid-row: span 1; }
  #change-language-tile { grid-column: span 4; grid-row: span 1; }
}

@media (max-width: 480px) {
  .bento-container {
    padding: 5px 0;
  }
  
  .bento-grid {
    gap: 10px;
    padding: 10px;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tile {
    min-height: 60px;
    border-radius: 24px;
  }
  
  .tile p {
    font-size: 12px;
    font-weight: 400;
  }
  
  /* Layout très compact pour très petits écrans */
  #top-tile { grid-column: span 2; grid-row: span 1; }
  #me-tile { grid-column: span 2; grid-row: span 2; }
  #linkedin-tile { grid-column: span 1; grid-row: span 2; }
  #twitter-tile { grid-column: span 1; grid-row: span 2; }
  #about-tile { grid-column: span 2; grid-row: span 3; }
  #github-tile { grid-column: span 2; grid-row: span 2; }
  #contact-tile { grid-column: span 2; grid-row: span 2; }
  #project-tile { grid-column: span 2; grid-row: span 2; }
  #theme-toggle-tile { grid-column: span 1; grid-row: span 1; }
  #open-to-work-tile { grid-column: span 1; grid-row: span 1; }
  #change-language-tile { grid-column: span 2; grid-row: span 1; }
}
</style>