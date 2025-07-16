<template>
  <div class="github-tile" @click="openGitHubProfile">
    <!-- Header avec titre et stats -->
    <div class="github-header">
      <div class="title-section">
        <h3 class="github-title">Github 2025</h3>
      </div>
      <div class="username-section">
        <div class="username-box">
          @Kalypss
        </div>
      </div>
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-number">{{ githubData.totalCommits || 240 }}</span>
          <span class="stat-label">Commits</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ githubData.totalRepos || 7 }}</span>
          <span class="stat-label">Repos</span>
        </div>
      </div>
    </div>

    <!-- Grille de contributions avec légende -->
    <div class="contributions-section">
      <!-- Header avec titre et légende alignés -->
      <div class="contribution-header">
        <div class="contributions-title">
          {{ t('contributions') }}
        </div>
      </div>
      <div class="contributions-legend-absolute">
        <span class="legend-text">{{ currentLanguage === 'fr' ? 'Moins' : 'Less' }}</span>
        <div class="legend-squares">
          <div 
            v-for="level in 5" 
            :key="level"
            class="legend-square"
            :style="{ backgroundColor: getContributionColor(level - 1) }"
          ></div>
        </div>
        <span class="legend-text">{{ currentLanguage === 'fr' ? 'Plus' : 'More' }}</span>
      </div>
      
      <!-- Grille de contributions avec labels des jours -->
      <div class="contribution-container">
        <!-- Grille de contributions -->
        <div class="contribution-grid">
          <div 
            v-for="(day, index) in displayGrid" 
            :key="index"
            class="contribution-day"
            :style="{ backgroundColor: getContributionColor(day?.level || 0) }"
            :title="getTooltipText(day)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useGitHub } from '@/composables/useGitHub'
import { useLanguage } from '@/composables/useLanguage'
import { useTheme } from '@/composables/useTheme'

// Composables
const { githubData, refetch } = useGitHub('Kalypss')
const { t, currentLanguage } = useLanguage()
const { currentTheme } = useTheme()

// Données de test pour visualiser le cadrillage
const generateTestGrid = () => {
  const grid = []
  const totalDays = 365 // 365 jours de l'année
  
  for (let i = 0; i < totalDays; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (totalDays - i))
    
    // Générer un niveau aléatoire de contributions (0-4)
    const level = Math.floor(Math.random() * 5)
    const count = level === 0 ? 0 : Math.floor(Math.random() * 10) + level
    
    grid.push({
      date: date.toISOString().split('T')[0],
      count: count,
      level: level
    })
  }
  
  return grid
}

// Si pas de données ou pas assez de données, compléter avec les données de test
const displayGrid = computed(() => {
  let grid = []
  
  if (githubData.value.contributionGrid && githubData.value.contributionGrid.length > 0) {
    // Vérifier si les données sont aplaties ou en nested arrays
    const rawGrid = githubData.value.contributionGrid
    
    // Si le premier élément est un array, alors on a une structure nested
    if (Array.isArray(rawGrid[0])) {
      console.log('Backend data is nested, flattening...')
      grid = rawGrid.flat()
    } else {
      console.log('Backend data is already flat')
      grid = [...rawGrid]
    }
    
    console.log('Données GitHub reçues:', grid.length, 'éléments')
    console.log('Premier élément:', grid[0])
    console.log('Dernier élément:', grid[grid.length - 1])
  }
  
  // S'assurer qu'on a exactement 365 éléments (365 jours de l'année)
  const targetLength = 365
  
  if (grid.length < targetLength) {
    // Compléter avec des données de test
    const testGrid = generateTestGrid()
    const missingCount = targetLength - grid.length
    grid = [...grid, ...testGrid.slice(0, missingCount)]
    console.log(`Complété avec ${missingCount} éléments de test`)
  }
  
  // Tronquer si trop d'éléments
  const finalGrid = grid.slice(0, targetLength)
  console.log('Grid finale:', finalGrid.length, 'éléments')
  return finalGrid
})

// Fonction pour formater le tooltip
const getTooltipText = (day) => {
  const date = day?.date || 'Date inconnue'
  const count = day?.count !== undefined ? day.count : 0
  const contributionText = count === 1 ? 'contribution' : 'contributions'
  return `${date}: ${count} ${contributionText}`
}

// Fonction pour obtenir la couleur des contributions selon le thème
const getContributionColor = (level) => {
  const safeLevel = level !== undefined && level !== null ? level : 0
  const isDark = currentTheme.value === 'dark'
  
  if (isDark) {
    const colors = {
      0: '#222222',    // Pas de contributions (gris très sombre)
      1: '#0e4429',    // Peu de contributions (vert très sombre)
      2: '#006d32',    // Quelques contributions (vert sombre)
      3: '#26a641',    // Beaucoup de contributions (vert moyen)
      4: '#39d353'     // Énormément de contributions (vert clair)
    }
    return colors[safeLevel] || colors[0]
  } else {
    const colors = {
      0: '#ebedf0',    // Pas de contributions (gris clair)
      1: '#9be9a8',    // Peu de contributions (vert très clair)
      2: '#40c463',    // Quelques contributions (vert clair)
      3: '#30a14e',    // Beaucoup de contributions (vert moyen)
      4: '#216e39'     // Énormément de contributions (vert foncé)
    }
    return colors[safeLevel] || colors[0]
  }
}

// Fonction pour ouvrir le profil GitHub
const openGitHubProfile = () => {
  window.open('https://github.com/Kalypss', '_blank', 'noopener,noreferrer')
}

// Initialisation au montage
onMounted(() => {
  // Le composable useGitHub gère déjà l'initialisation automatique
  // Optionnel : on peut forcer un refetch si nécessaire
  // refetch()
})
</script>

<style scoped>
.github-tile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: var(--text-primary);
  position: relative;
  gap: 16px;
  cursor: pointer;
}


/* Header avec titre et stats */
.github-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0px 10px;
}

.title-section {
  flex: 1;
}

.username-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2px;
}

  .username-box {
    font-size: var(--font-medium);
    font-weight: 800;
    color: var(--text-primary);
    transition: all 0.3s ease;
    cursor: pointer;
}

.username-box:hover {
  text-decoration: underline;
}

  .github-title {
    font-size: var(--font-big);
    font-weight: 600;
    margin-left: 10px;
    letter-spacing: -2px;
    color: var(--text-primary);
}

.stats-section {
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: flex-end;
  justify-content: flex-end;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: right;
}

  .stat-number {
    font-size: var(--font-big);
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
}

  .stat-label {
    font-size: var(--font-smaller);
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: capitalize;
    letter-spacing: -0.5px;
}

/* Header contributions avec titre et légende */
.contribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  width: 90%;
}

/* Titre contributions */
  .contributions-title {
    font-size: var(--font-smaller);
    color: var(--text-primary);
    margin: 0;
    font-weight: 500;
    
}

/* Section contributions */
.contributions-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  position: relative;
  margin-top: 0px;
}

.contributions-legend-absolute {
  position: absolute;
  top: 0;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 4; /* Ensure it's above the grid */
}

.contribution-container {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}


.contribution-grid {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 2px;
  width: 100%;
  max-width: 90%; /* Added max-width */
}

.contribution-day {
  border-radius: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-width: 3px;
  min-height: 3px;
  aspect-ratio: 1 / 1;
}

  .legend-text {
    font-size: var(--font-smaller);
    font-weight: 500;
    color: var(--text-primary);
}

.legend-squares {
  display: flex;
  gap: 2px;
}

.legend-square {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .github-tile {
    gap: 14px;
  }
  .github-title {
    font-size: var(--font-laptop-big);
  }
  .stat-number {
    font-size: var(--font-laptop-big);
  }
  .username-box {
    font-size: var(--font-laptop-medium);
  }
  .stat-label {
    font-size: var(--font-laptop-smaller);
  }
  .contributions-title {
    font-size: var(--font-laptop-smaller);
  }
  .legend-text {
    font-size: var(--font-laptop-smaller);
  }
}

@media (max-width: 768px) {
  .github-tile {
    padding: 16px;
    gap: 12px;
  }
  .github-title {
    font-size: var(--font-tablet-big);
    margin-left: 8px;
  }
  .username-box {
    font-size: var(--font-tablet-small);
    padding: 6px 12px;
    border-radius: 16px;
  }
  .stats-section {
    gap: 16px;
  }
  .stat-number {
    font-size: var(--font-tablet-big);
  }
  .stat-label {
    font-size: var(--font-tablet-smaller);
  }
  .contribution-header {
    margin-bottom: 10px;
  }
  .contribution-container {
    gap: 6px;
  }
  .day-label {
    height: calc((70px - 10px) / 7);
    font-size: 7px;
    width: 18px;
  }
  .contribution-grid {
    gap: 1px;
  }
  .contributions-section {
    padding: 0 15px;
  }
  .contributions-legend {
    gap: 4px;
  }
  .legend-text {
    font-size: var(--font-tablet-smaller);
  }
  .legend-square {
    width: 7px;
    height: 7px;
  }
}

@media (max-width: 480px) {
  .github-tile {
    padding: 12px;
    gap: 8px;
    letter-spacing: 0px;
  }
  .github-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .title-section,
  .username-section,
  .stats-section {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .title-section {
    justify-content: flex-start;
    letter-spacing: 0px;
    font-weight: 300;
  }
  .username-section {
    justify-content: center;
  }
  .stats-section {
    justify-content: flex-end;
    gap: 6px;
  }
  .github-title {
    font-size: var(--font-phone-big);
    margin-left: 0;
    font-weight: 600;
    letter-spacing: -1px;
  }
  .username-box {
    font-size: var(--font-phone-small);
    padding: 3px 6px;
    border-radius: 10px;
  }
  .stat-item {
    align-items: center;
    text-align: center;
  }
  .stat-number {
    font-size: var(--font-phone-medium);
  }
  .stat-label {
    font-size: var(--font-phone-smaller);
  }
  .contributions-title {
    font-size: var(--font-phone-smaller);
  }
  .contribution-grid {
  }
  .day-label {
    height: calc((50px - 8px) / 7);
    font-size: 5px;
    width: 14px;
  }
  .legend-text {
    font-size: var(--font-phone-smaller);
  }
  .legend-square {
    width: 5px;
    height: 5px;
  }
  .contributions-section {
    padding: 0 8px;
  }
}
</style>
