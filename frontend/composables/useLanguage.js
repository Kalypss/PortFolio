import { ref, computed } from 'vue'

// État global de la langue
const currentLanguage = ref('fr')

// Traductions
const translations = {
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    contact: 'Contact',
    
    // Bento grid
    location: 'Localisation',
    me: 'Moi',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    github: 'GitHub',
    openToWork: 'Ouvert au travail',
    themeToggle: 'Thème',
    changeLanguage: 'Changer de langue',
    lightMode: 'Appuyer ici pour le thème sombre',
    darkMode: 'Appuyer ici pour le thème clair',
    
    // Slider
    slideToChange: 'Glisser pour changer de langue',
    releaseToChange: 'Relâcher pour changer',
    
    // Descriptions générales
    developer: 'Développeur Full-Stack',
    welcomeMessage: 'Bienvenue sur mon portfolio',
    
    // Météo
    cityPlaceholder: 'Entrez une ville...',
    
    // Boutons
    viewProject: 'Voir le projet',
    contactMe: 'Me contacter',
    downloadCV: 'Télécharger CV',
    
    // Status
    availableForWork: 'Disponible pour de nouveaux projets',
    currentlyWorking: 'Actuellement en projet',
    
    // GitHub
    commits: 'Commits',
    repositories: 'Repos',
    viewProfile: 'Voir le profil',
    contributions: 'Contributions cette année',
    githubActivity: 'Activité GitHub'
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    
    // Bento grid
    location: 'Location',
    me: 'Me',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    github: 'GitHub',
    openToWork: 'Open to work',
    themeToggle: 'Theme',
    changeLanguage: 'Change language',
    lightMode: 'Press this tile for the Dark mode',
    darkMode: 'Press this tile for the Light mode',
    
    // Slider
    slideToChange: 'Slide to change language',
    releaseToChange: 'Release to change',
    
    // Descriptions générales
    developer: 'Full-Stack Developer',
    welcomeMessage: 'Welcome to my portfolio',
    
    // Météo
    cityPlaceholder: 'Enter a city...',
    
    // Boutons
    viewProject: 'View project',
    contactMe: 'Contact me',
    downloadCV: 'Download CV',
    
    // Status
    availableForWork: 'Available for new projects',
    currentlyWorking: 'Currently working on projects',
    
    // GitHub
    commits: 'Commits',
    repositories: 'Repos',
    viewProfile: 'View Profile',
    contributions: 'Contributions this year',
    githubActivity: 'GitHub Activity'
  }
}

export const useLanguage = () => {
  // Fonction pour changer la langue
  const setLanguage = (lang) => {
    if (lang === 'fr' || lang === 'en') {
      currentLanguage.value = lang
      // Optionnel : sauvegarder dans localStorage
      localStorage.setItem('preferred-language', lang)
    }
  }

  // Fonction pour obtenir une traduction
  const t = (key) => {
    const translation = translations[currentLanguage.value]?.[key]
    return translation || key
  }

  // Computed pour vérifier si on est en français
  const isFrench = computed(() => currentLanguage.value === 'fr')
  
  // Computed pour vérifier si on est en anglais
  const isEnglish = computed(() => currentLanguage.value === 'en')

  // Initialiser la langue depuis localStorage si disponible
  const initLanguage = () => {
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      currentLanguage.value = savedLang
    }
  }

  return {
    currentLanguage: computed(() => currentLanguage.value),
    setLanguage,
    t,
    isFrench,
    isEnglish,
    initLanguage
  }
}
