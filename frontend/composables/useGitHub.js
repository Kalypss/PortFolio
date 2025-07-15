import { ref, onMounted } from 'vue'

export function useGitHub(username = 'Kalypss') {
  const githubData = ref({
    totalCommits: 0,
    totalRepos: 0,
    totalStars: 0,
    followers: 0,
    following: 0,
    longestStreak: 0,
    currentStreak: 0,
    contributions: [],
    weeklyActivity: [],
    contributionGrid: [],
    repositories: [],
    isLoading: true,
    error: null,
    lastUpdated: null
  })

  // URL du backend via le proxy Nginx
  const BACKEND_URL = 'api.floriansilva.dev'

  // Fonction principale pour récupérer toutes les données depuis le backend
  const fetchGitHubData = async () => {
    try {
      githubData.value.isLoading = true
      githubData.value.error = null

      console.log(`Récupération des données GitHub pour ${username}...`)

      const response = await fetch(`/api/github/${username}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Mettre à jour les données réactives
      githubData.value = {
        ...githubData.value,
        totalCommits: data.totalCommits || 0,
        totalRepos: data.totalRepos || 0,
        totalStars: data.totalStars || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        contributionGrid: data.contributionGrid || [],
        weeklyActivity: data.weeklyActivity || [],
        contributions: data.monthlyActivity || [],
        repositories: data.repositories || [],
        lastUpdated: data.lastUpdated,
        isLoading: false,
        error: null
      }

      console.log('Données GitHub chargées avec succès:', {
        totalCommits: githubData.value.totalCommits,
        totalRepos: githubData.value.totalRepos,
        currentStreak: githubData.value.currentStreak,
        longestStreak: githubData.value.longestStreak,
        gridSize: githubData.value.contributionGrid.length
      })

    } catch (error) {
      console.error('Erreur lors de la récupération des données GitHub:', error)
      
      // Messages d'erreur spécifiques
      let errorMessage = 'Impossible de charger les données GitHub'
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Serveur backend non disponible. Vérifiez qu\'il est démarré sur le port 3001.'
      } else if (error.message.includes('Token')) {
        errorMessage = 'Token GitHub non configuré ou invalide'
      } else if (error.message.includes('non trouvé')) {
        errorMessage = `Utilisateur ${username} non trouvé sur GitHub`
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Limite de l\'API GitHub atteinte. Réessayez plus tard.'
      } else if (error.message) {
        errorMessage = error.message
      }

      githubData.value = {
        ...githubData.value,
        isLoading: false,
        error: errorMessage
      }
    }
  }

  // Fonction pour obtenir la couleur selon l'intensité (comme GitHub)
  const getContributionColor = (level) => {
    const colors = {
      0: '#ebedf0', // Pas de contributions (gris clair)
      1: '#9be9a8', // Peu de contributions (vert très clair)
      2: '#40c463', // Quelques contributions (vert clair)
      3: '#30a14e', // Beaucoup de contributions (vert moyen)
      4: '#216e39'  // Énormément de contributions (vert foncé)
    }
    return colors[level] || colors[0]
  }

  // Vérifier la santé du backend
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`/health`)
      if (response.ok) {
        const health = await response.json()
        console.log('Backend health:', health)
        return health
      }
    } catch (error) {
      console.warn('Backend non disponible:', error.message)
      return null
    }
  }

  onMounted(async () => {
    // Vérifier d'abord si le backend est disponible
    const health = await checkBackendHealth()
    
    if (!health) {
      githubData.value = {
        ...githubData.value,
        isLoading: false,
        error: 'Serveur backend non disponible. Assurez-vous qu\'il est démarré avec "npm run dev" dans le dossier backend.'
      }
      return
    }

    if (!health.hasGitHubToken) {
      githubData.value = {
        ...githubData.value,
        isLoading: false,
        error: 'Token GitHub non configuré. Consultez le README du backend pour les instructions.'
      }
      return
    }

    // Si tout va bien, récupérer les données
    await fetchGitHubData()
  })

  return {
    githubData,
    getContributionColor,
    refetch: fetchGitHubData,
    checkBackendHealth
  }
}
