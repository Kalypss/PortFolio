<template>
  <div ref="splineContainer" class="spline-container">
    <canvas 
      ref="splineCanvas" 
      class="spline-canvas" 
      :class="{ 'canvas-loaded': isLoaded }"
      v-show="isLoaded"
    ></canvas>
    <div v-if="!isLoaded && !hasError" class="loading-placeholder">
    </div>
    <div v-if="hasError" class="error-placeholder">
      <p>Modèle Spline indisponible</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Refs pour les éléments DOM
const splineContainer = ref(null)
const splineCanvas = ref(null)
const isLoaded = ref(false)
const hasError = ref(false)

// Variables Spline
let splineApp = null

// Initialiser Spline avec le runtime (plus stable)
const initSpline = async () => {
  if (!splineContainer.value || !splineCanvas.value) return

  try {
    console.log('Initialisation du modèle Spline avec @splinetool/runtime...')
    
    // Importer le runtime Spline côté client seulement
    const { Application } = await import('@splinetool/runtime')
    
    // Créer l'application Spline
    splineApp = new Application(splineCanvas.value)
    
    // Charger la scène
    await splineApp.load('https://prod.spline.design/WgY6ZeTDn4e1F-rx/scene.splinecode')
    
    // Ajuster la taille initiale avec les dimensions complètes
    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight
    splineApp.setSize(containerWidth, containerHeight)
    
    // Accéder au renderer pour forcer la transparence
    try {
      const renderer = splineApp._scene?.getRenderer?.() || splineApp.renderer
      if (renderer) {
        // Forcer le fond transparent
        renderer.setClearColor(0x000000, 0)
        renderer.setClearAlpha(0)
        console.log('Transparence du renderer activée')
      }
    } catch (error) {
      console.log('Impossible de modifier le renderer, utilisation du CSS fallback')
    }
    
    console.log('Scène Spline chargée avec succès')
    isLoaded.value = true
  } catch (error) {
    console.error('Erreur lors de l\'initialisation Spline:', error)
    hasError.value = true
  }
}

// Gérer le redimensionnement
const handleResize = () => {
  if (splineApp && splineContainer.value) {
    const container = splineContainer.value
    const containerWidth = container.clientWidth || window.innerWidth
    const containerHeight = container.clientHeight || window.innerHeight
    
    // Spline runtime gère automatiquement le redimensionnement
    splineApp.setSize(containerWidth, containerHeight)
  }
}

// Lifecycle hooks
onMounted(() => {
  // S'assurer qu'on est côté client
  if (process.client) {
    // Vérifier si c'est un appareil mobile - NE PAS charger Spline sur mobile
    const isMobile = window.innerWidth <= 1280 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      console.log('Spline désactivé sur mobile pour optimiser les performances')
      return // Sortir immédiatement sans charger Spline
    }
    
    // Charger Spline seulement sur desktop
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initSpline()
          window.addEventListener('resize', handleResize)
          observer.disconnect()
        }
      }, {
        rootMargin: '200px'
      })
      
      if (splineContainer.value) {
        observer.observe(splineContainer.value)
      }
    }, 1000)
  }
})

onUnmounted(() => {
  // Nettoyer les ressources
  if (splineApp) {
    splineApp.dispose()
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.spline-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* Permettre les interactions avec le contenu au-dessus */
}

.spline-container:active {
  cursor: grabbing;
}

.spline-canvas {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  position: relative;
  z-index: 0;
  /* Forcer la transparence */
  background: transparent !important;
  /* Mode de fusion pour intégration avec le fond de page */
  mix-blend-mode: normal;
}

.spline-canvas.canvas-loaded {
  opacity: 1;
}

.loading-placeholder,
.error-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-placeholder p {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 1380px) {
  .spline-container {
    display: none !important; /* Complètement masqué sur mobile */
  }
}

@media (max-width: 768px) {
  .spline-container {
    display: none !important; /* Complètement masqué sur mobile */
  }
}

@media (max-width: 640px) {
  .spline-container {
    display: none !important; /* Complètement masqué sur petits écrans */
  }
}
</style>
