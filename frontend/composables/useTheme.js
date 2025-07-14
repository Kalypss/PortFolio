import { ref, computed } from 'vue'

// État global du thème (sera réactif à travers toute l'application)
const currentTheme = ref('dark')

// Variables CSS pour les thèmes
const themes = {
  dark: {
    '--bg-primary': '#000000',
    '--bg-secondary': '#1A1A1A',
    '--text-primary': '#FFFFFF',
    '--text-primary-rgb': '255, 255, 255',
    '--text-secondary': '#CCCCCC',
    '--border-color': '#333333',
    '--accent-primary': '#4FC08D',
    '--weather-icon-filter': 'brightness(0) invert(1)' // Noir vers blanc
  },
  light: {
    '--bg-primary': '#FFFFFF',
    '--bg-secondary': '#F5F5F5',
    '--text-primary': '#1A1A1A',
    '--text-primary-rgb': '26, 26, 26',
    '--text-secondary': '#666666',
    '--text-header': '#1A1A1A',
    '--border-color': '#E0E0E0',
    '--accent-primary': '#4FC08D',
    '--weather-icon-filter': 'brightness(0)' // Reste noir
  }
}

export const useTheme = () => {
  // Fonction pour changer le thème
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      currentTheme.value = theme
      applyTheme(theme)
      // Sauvegarder dans localStorage seulement côté client
      if (process.client && localStorage) {
        localStorage.setItem('preferred-theme', theme)
      }
    }
  }

  // Appliquer le thème au document
  const applyTheme = (theme) => {
    if (process.client && document) {
      const root = document.documentElement
      const themeVariables = themes[theme]
      
      // Appliquer toutes les variables CSS
      Object.entries(themeVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
      
      // Ajouter une classe au body pour des styles spécifiques si nécessaire
      document.body.className = `theme-${theme}`
    }
  }

  // Computed pour vérifier si on est en mode clair
  const isLightMode = computed(() => currentTheme.value === 'light')
  
  // Computed pour vérifier si on est en mode sombre
  const isDarkMode = computed(() => currentTheme.value === 'dark')

  // Initialiser le thème depuis localStorage
  const initTheme = () => {
    if (process.client && localStorage) {
      const savedTheme = localStorage.getItem('preferred-theme')
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme)
      } else {
        setTheme('dark') // Thème par défaut
      }
    } else {
      // Côté serveur, utiliser le thème par défaut
      currentTheme.value = 'dark'
    }
  }

  return {
    currentTheme: computed(() => currentTheme.value),
    setTheme,
    isLightMode,
    isDarkMode,
    initTheme
  }
}
