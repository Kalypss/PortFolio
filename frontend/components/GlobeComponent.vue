<template>
  <div class="globe-container-wrapper flex-col items-center w-[400px] hidden lg:flex">
    <div 
      class="globe-container relative w-[300px] h-[300px] rounded-full overflow-hidden cursor-pointer transition-all duration-500"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleGlobeClick"
    >
      <!-- Points fixes sur les intersections -->
      <div 
        v-for="(point, index) in fixedPoints" 
        :key="`fixed-${index}`"
        class="absolute w-1 h-1 bg-[var(--text-header)] rounded-full z-10 transition-all duration-500 ease-in-out"
        :class="{ 
          'animate-pulse-scale': point.hasAnimation && !showQuestionMark && animationsActive,
          'question-mark-point': showQuestionMark && point.isQuestionMarkPoint
        }"
        :style="{
          left: (showQuestionMark && point.isQuestionMarkPoint && point.questionMarkPosition ? 
                 point.questionMarkPosition.x - 2 : point.x - 2) + 'px',
          top: (showQuestionMark && point.isQuestionMarkPoint && point.questionMarkPosition ? 
                point.questionMarkPosition.y - 2 : point.y - 2) + 'px',
          animationDelay: point.animationDelay + 'ms',
          opacity: showQuestionMark ? (point.isQuestionMarkPoint ? 1 : 0.2) : 1,
          transform: showQuestionMark && point.isQuestionMarkPoint ? 'scale(2)' : 'scale(1)'
        }"
      ></div>
    </div>
      
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

// Configuration
const CONTAINER_SIZE = 300 // 300px de diamètre
const RADIUS_STEP = 18 // Tous les 20px

// Configuration pour l'effet de typing
const translations = {
  fr: {
    message: "N'hésitez pas à changer la langue, ou le thème.",
    settings: "Paramètres",
    language: "Langue",
    theme: "Thème",
    cancel: "Annuler",
    apply: "Appliquer"
  },
  en: {
    message: "Feel free to change the language or theme.",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    cancel: "Cancel",
    apply: "Apply"
  },
  es: {
    message: "No dudes en cambiar el idioma o el tema.",
    settings: "Configuración",
    language: "Idioma",
    theme: "Tema",
    cancel: "Cancelar",
    apply: "Aplicar"
  },
  de: {
    message: "Zögern Sie nicht, die Sprache oder das Design zu ändern.",
    settings: "Einstellungen",
    language: "Sprache",
    theme: "Design",
    cancel: "Abbrechen",
    apply: "Anwenden"
  }
}

const currentText = computed(() => translations[selectedLanguage.value]?.message || translations.fr.message)
const displayedText = ref('')
const isTyping = ref(false)

// États réactifs pour l'interaction
const showQuestionMark = ref(false)
const showMessage = ref(false)
const showModal = ref(false)
const animationsActive = ref(true)

// États pour les paramètres
const selectedLanguage = ref('fr')
const selectedTheme = ref('light')

// Configuration des langues et thèmes
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

const themes = [
  { value: 'light', name: 'Clair', icon: '☀️' },
  { value: 'dark', name: 'Sombre', icon: '🌙' }
]

// Génération des points fixes sur les intersections
const fixedPoints = ref([])

// Points pour former un point d'interrogation
const questionMarkPoints = ref([])

const generateQuestionMarkPoints = () => {
  const center = CONTAINER_SIZE / 2
  const points = []
  
  // Point d'interrogation simplifié avec positions relatives précises
  // Utiliser les positions des points du globe existants plutôt que de créer de nouveaux points
  
  // Définir les positions relatives pour former un "?" par rapport au centre
  const questionMarkPattern = [
    // Partie haute courbe du ?
    { x: -20, y: -40 },  // haut gauche
    { x: -10, y: -50 },  // haut centre
    { x: 0, y: -50 },    // haut centre droit
    { x: 10, y: -50 },   // haut droit
    { x: 20, y: -40 },   // côté droit haut
    { x: 20, y: -30 },   // côté droit milieu
    { x: 10, y: -20 },   // courbe vers le centre
    { x: 0, y: -10 },    // centre
    { x: 0, y: 0 },      // milieu
    { x: 0, y: 10 },     // bas de la ligne
    
    // Point isolé en bas
    { x: 0, y: 30 }      // point final
  ]
  
  // Convertir les positions relatives en positions absolues
  questionMarkPattern.forEach(pattern => {
    points.push({
      x: center + pattern.x,
      y: center + pattern.y
    })
  })
  
  return points
}

// Version simplifiée pour débug - on peut ajuster manuellement les positions
const createSimpleQuestionMark = () => {
  const center = CONTAINER_SIZE / 2
  
  // Positions manuelles pour un point d'interrogation simple
  const positions = [
    // Ligne du haut du ?
    { x: center - 15, y: center - 30 },
    { x: center - 5, y: center - 40 },
    { x: center + 5, y: center - 40 },
    { x: center + 15, y: center - 34 },
    
    // Côté droit
    { x: center + 15, y: center - 25 },
    { x: center + 10, y: center - 15 },
    
    // Vers le centre
    { x: center, y: center - 5 },
    { x: center, y: center + 5 },
    
    // Point isolé
    { x: center, y: center + 35 }
  ]
  
  return positions
}

const generateFixedPoints = () => {
  const points = []
  const center = CONTAINER_SIZE / 2
  
  // Point central
  points.push({ 
    x: center, 
    y: center,
    hasAnimation: Math.random() < 0.1, // 10% de chance d'avoir une animation
    animationDelay: Math.random() * 5000, // Délai aléatoire entre 0 et 50 secondes
    isQuestionMarkPoint: false
  })
  
  // Points sur les cercles concentriques avec progression régulière
  let radiusIndex = 1
  for (let radius = RADIUS_STEP; radius <= CONTAINER_SIZE / 2; radius += RADIUS_STEP) {
    const pointsOnThisRadius = radiusIndex * 6 // 6, 12, 18, 24, 30, 36, 42...
    const angleStep = 360 / pointsOnThisRadius
    
    for (let i = 0; i < pointsOnThisRadius; i++) {
      const angle = i * angleStep
      const angleRad = (angle * Math.PI) / 180
      const x = center + Math.cos(angleRad) * radius
      const y = center + Math.sin(angleRad) * radius
      points.push({ 
        x, 
        y,
        hasAnimation: Math.random() < 0.05, // 25% de chance d'avoir une animation
        animationDelay: Math.random() * 5000, // Délai aléatoire entre 0 et 4 secondes
        isQuestionMarkPoint: false
      })
    }
    
    radiusIndex++
  }
  
  return points
}

// Calculer quels points du globe sont les plus proches des points du point d'interrogation
const updateQuestionMarkMapping = () => {
  const qmPoints = questionMarkPoints.value
  
  // Réinitialiser tous les points
  fixedPoints.value.forEach(point => {
    point.isQuestionMarkPoint = false
    point.questionMarkPosition = null
  })
  
  // Pour chaque point du pattern du point d'interrogation, trouver le point du globe le plus proche
  qmPoints.forEach(qmPoint => {
    let closestGlobePoint = null
    let minDistance = Infinity
    
    fixedPoints.value.forEach(globePoint => {
      const distance = Math.sqrt(
        Math.pow(globePoint.x - qmPoint.x, 2) + Math.pow(globePoint.y - qmPoint.y, 2)
      )
      if (distance < minDistance && !globePoint.isQuestionMarkPoint) {
        minDistance = distance
        closestGlobePoint = globePoint
      }
    })
    
    // Si on trouve un point assez proche (moins de 25px), on l'associe
    if (closestGlobePoint && minDistance < 25) {
      closestGlobePoint.isQuestionMarkPoint = true
      closestGlobePoint.questionMarkPosition = qmPoint
    }
  })
}

// Fonction de debug pour voir les points du point d'interrogation (optionnel)
const debugQuestionMark = () => {
  console.log('Points du point d\'interrogation:', questionMarkPoints.value)
  console.log('Points du globe mappés:', fixedPoints.value.filter(p => p.isQuestionMarkPoint))
}

// Fonctions pour l'interaction avec le globe
const handleGlobeClick = () => {
  if (!showMessage.value) {
    showMessage.value = true
    startTyping()
  }
}

// Fonctions pour le modal
const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const applySettings = () => {
  // Émettre un événement pour informer le parent des nouveaux paramètres
  const settings = {
    language: selectedLanguage.value,
    theme: selectedTheme.value
  }
  
  // Si vous voulez persister les paramètres
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('portfolio-settings', JSON.stringify(settings))
  }
  
  // Appliquer le thème immédiatement
  applyTheme(selectedTheme.value)
  
  // Fermer le modal
  closeModal()
  
  // Optionnel: afficher une notification de succès
  console.log('Paramètres appliqués:', settings)
}

const applyTheme = (theme) => {
  const html = document.documentElement
  
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// Charger les paramètres sauvegardés
const loadSavedSettings = () => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('portfolio-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        selectedLanguage.value = settings.language || 'fr'
        selectedTheme.value = settings.theme || 'light'
        applyTheme(selectedTheme.value)
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e)
      }
    }
  }
}

// Fonction pour l'effet de typing
const startTyping = (text = null) => {
  const textToType = text || currentText.value
  displayedText.value = ''
  isTyping.value = true
  let currentIndex = 0
  
  const typeNextChar = () => {
    if (currentIndex < textToType.length) {
      displayedText.value += textToType[currentIndex]
      currentIndex++
      
      // Délai variable pour un effet plus naturel
      const delay = textToType[currentIndex - 1] === ' ' ? 10 : 80 + Math.random() * 40
      
      setTimeout(typeNextChar, delay)
    } else {
      isTyping.value = false
    }
  }
  
  // Délai initial avant de commencer à taper
  setTimeout(typeNextChar, 300)
}

// Watcher pour relancer le typing quand la langue change
watch(selectedLanguage, (newLang) => {
  if (showMessage.value) {
    startTyping()
  }
})

// Fonctions de gestion des événements de hover
const handleMouseEnter = () => {
  showQuestionMark.value = true
  animationsActive.value = false
}

const handleMouseLeave = () => {
  showQuestionMark.value = false
  animationsActive.value = true
}

onMounted(() => {
  // Charger les paramètres sauvegardés
  loadSavedSettings()
  
  // Générer les points du point d'interrogation
  questionMarkPoints.value = createSimpleQuestionMark()
  
  // Générer seulement les points fixes
  fixedPoints.value = generateFixedPoints()
  
  // Calculer la correspondance avec le point d'interrogation
  updateQuestionMarkMapping()
  
  // Debug (à supprimer plus tard)
  debugQuestionMark()
})
</script>

<style scoped>
/* Animation de pulsation avec doublement de taille */
@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.8;
  }
}

.animate-pulse-scale {
  animation: pulse-scale 1s ease-in-out infinite;
}

/* Styles pour l'effet de typing */
.typing-char {
  opacity: 0;
  animation: fadeIn 0.1s ease-in forwards;
}

.typing-cursor {
  color: var(--text-primary);
  font-size: 0.8em;
  margin-left: 2px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Styles pour le morphing des points */
.question-mark-point {
  transform: scale(2) !important;
  background-color: var(--text-header) !important;
}

/* Transition fluide pour le globe container */
.globe-container {
  border: 2px solid transparent;
}

/* Animation pour l'apparition du modal */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>



