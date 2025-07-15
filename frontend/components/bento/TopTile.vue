<template>
  <div class="top-tile">
    <!-- Partie gauche: Heure -->
    <div class="top-tile-left">
      <div class="time-container">
        <svg class="time-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>
    
    <!-- Partie centre: Météo ou input ville -->
    <div class="top-tile-center">
      <!-- Input pour saisir une ville (affiché quand pas de météo) -->
      <div v-if="!weatherData" class="city-input-container">
        <form @submit.prevent="handleCitySubmit" class="city-form">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input 
            v-model="cityInput" 
            type="text" 
            :placeholder="t('cityPlaceholder') || 'Entrez une ville...'"
            class="city-input"
            :disabled="isLoadingWeather"
          />
          <button type="submit" class="city-submit" :disabled="isLoadingWeather">
            <svg v-if="isLoadingWeather" class="loading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
              <path d="m12 5 7 7-7 7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </form>
        <p v-if="weatherError" class="weather-error">{{ weatherError }}</p>
      </div>
      
      <!-- Affichage météo -->
      <div v-else class="weather-display">
        <img 
          :src="`https://api.floriansilva.dev/weather-icons/${weatherData.current.icon}`" 
          :alt="weatherData.current.condition"
          class="weather-icon"
        />
        <div class="weather-info">
          <span class="weather-temp">{{ weatherData.current.temperature }}°</span>
          <span class="weather-condition">{{ weatherData.current.condition }}</span>
          <span class="weather-location">{{ weatherData.location.name }}</span>
        </div>
        <button @click="clearWeatherData" class="weather-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Partie droite: Date -->
    <div class="top-tile-right">
      <div class="date-container">
        <span class="current-date">{{ currentDate }}</span>
        <svg class="date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useWeather } from '@/composables/useWeather'
import { useLanguage } from '@/composables/useLanguage'

// Utiliser les composables
const { weatherData, isLoading: isLoadingWeather, error: weatherError, fetchWeather, clearWeather } = useWeather()
const { currentLanguage, t } = useLanguage()

// Variables pour l'heure et la date
const currentTime = ref('')
const currentDate = ref('')
const cityInput = ref('')

// Computed pour obtenir la locale actuelle
const currentLocale = computed(() => {
  return currentLanguage.value === 'en' ? 'en-US' : 'fr-FR'
})

// Mettre à jour l'heure et la date selon la langue
const updateDateTime = () => {
  const now = new Date()
  const locale = currentLocale.value
  
  currentTime.value = now.toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  
  currentDate.value = now.toLocaleDateString(locale, { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
}

// Watcher pour mettre à jour la date/heure quand la langue change
watch(currentLanguage, () => {
  updateDateTime()
})

// Intervalle pour mettre à jour l'heure
let timeInterval = null

// Gérer la soumission de la ville
const handleCitySubmit = async () => {
  if (cityInput.value.trim()) {
    await fetchWeather(cityInput.value.trim())
    if (weatherData.value) {
      cityInput.value = ''
    }
  }
}

// Effacer les données météo
const clearWeatherData = () => {
  clearWeather()
}

// Initialiser au montage du composant
onMounted(() => {
  updateDateTime()
  
  // Mettre à jour l'heure chaque seconde
  timeInterval = setInterval(updateDateTime, 1000)
})

// Nettoyer l'intervalle au démontage
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* Styles pour la top-tile */
.top-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 38px;
  width: 100%;
  height: 100%;
}

.top-tile-left, .top-tile-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.top-tile-left {
  justify-content: flex-start;
}

.top-tile-right {
  justify-content: flex-end;
}

.top-tile-center {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Conteneurs pour l'heure et la date avec icônes */
.time-container, .date-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.time-icon, .date-icon {
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.current-time {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -1px;
}

.current-date {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
  letter-spacing: -1px;
}

/* Styles pour l'input ville amélioré */
.city-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.city-form {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.city-form:focus-within {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.search-icon {
  color: var(--text-primary);
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.city-form:focus-within {
  color: #667eea;
}

.city-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
  width: 220px;
}

.city-input::placeholder {
  color: var(--text-primary);
  font-weight: 400;
}

.city-submit {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.city-submit:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.city-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.weather-error {
  font-size: 12px;
  color: #ff4444;
  margin: 0;
  padding: 4px 8px;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
}

/* Styles pour l'affichage météo amélioré */
.weather-display {
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 25px;
  padding: 12px 20px;
  transition: all 0.3s ease;
}

.weather-icon {
  width: 36px;
  height: 36px;
  filter: var(--weather-icon-filter);
  transition: filter 0.3s ease;
  flex-shrink: 0;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.weather-temp {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 40px;
  flex-shrink: 0;
}

.weather-condition {
  font-size: 18px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.weather-location {
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.weather-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.weather-close:hover {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
}

/* Responsive */
@media (max-width: 768px) {
  .top-tile {
    padding: 0 16px;
  }
  
  .time-container, .date-container {
    gap: 6px;
  }
  
  .time-icon, .date-icon {
    width: 16px;
    height: 16px;
  }
  
  .current-time {
    font-size: 16px;
  }
  
  .current-date {
    font-size: 16px;
  }
  
  .city-input {
    width: 140px;
    font-size: 14px;
  }
  
  .weather-temp, .weather-condition, .weather-location {
    font-size: 15px;
  }
  
  .weather-icon {
    width: 30px;
    height: 30px;
  }
  
  .weather-display {
    padding: 8px 12px;
    gap: 10px;
  }
  
  .weather-info {
    gap: 10px;
  }
  
  .city-form {
    padding: 8px 12px;
    border-radius: 12px;
  }
  
  .weather-close {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 600px) {
  .top-tile {
    padding: 0 12px;
  }
  
  .current-time {
    font-size: 14px;
  }
  
  .current-date {
    font-size: 14px;
  }
  
  .time-container, .date-container {
    gap: 4px;
  }
  
  .time-icon, .date-icon {
    width: 14px;
    height: 14px;
  }
  
  .city-input {
    width: 120px;
    font-size: 13px;
  }
  
  .weather-temp, .weather-condition, .weather-location {
    font-size: 14px;
  }
  
  .weather-icon {
    width: 28px;
    height: 28px;
  }
  
  .weather-display {
    padding: 6px 10px;
    gap: 8px;
  }
  
  .weather-info {
    gap: 8px;
  }
  
  .city-form {
    padding: 6px 10px;
    gap: 8px;
  }
  
  .weather-close {
    width: 26px;
    height: 26px;
  }
}

@media (max-width: 480px) {
  .top-tile {
    padding: 0 8px;
    /* Maintenir le layout horizontal : heure à gauche, input au centre, date à droite */
  }
  
  .top-tile-left, .top-tile-right {
    flex: 0.8;
  }
  
  .top-tile-center {
    flex: 1.4;
  }
  
  .current-time {
    font-size: 12px;
  }
  
  .current-date {
    font-size: 12px;
    text-align: right;
  }
  
  .time-container, .date-container {
    display: flex;
    gap: 3px;
    justify-content: center;
  }
  
  .time-icon, .date-icon {
    width: 12px;
    height: 12px;
  }
  
  .city-input {
    width: 100px;
    font-size: 12px;
  }
  
  .weather-temp {
    font-size: 13px;
  }
  
  .weather-condition, .weather-location {
    font-size: 12px;
  }
  
  .weather-icon {
    width: 24px;
    height: 24px;
  }
  
  .weather-display {
    padding: 4px 8px;
    gap: 6px;
    border-radius: 15px;
  }
  
  .weather-info {
    gap: 6px;
  }
  
  .city-form {
    padding: 4px 8px;
    gap: 6px;
    border-radius: 10px;
  }
  
  .weather-close {
    width: 22px;
    height: 22px;
  }
  
  .search-icon {
    width: 12px;
    height: 12px;
  }
  
  .city-submit {
    padding: 2px;
  }
  
  .city-submit svg {
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 360px) {
  .top-tile {
    padding: 0 6px;
  }
  
  .current-time, .current-date {
    font-size: 11px;
  }
  
  .city-input {
    width: 80px;
    font-size: 11px;
  }
  
  .weather-temp {
    font-size: 12px;
  }
  
  .weather-condition, .weather-location {
    font-size: 11px;
  }
  
  .weather-icon {
    width: 20px;
    height: 20px;
  }
  
  .weather-display {
    padding: 3px 6px;
    gap: 4px;
  }
  
  .weather-info {
    gap: 4px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .weather-temp {
    font-size: 12px;
    min-width: auto;
  }
  
  .weather-condition {
    font-size: 11px;
    max-width: 60px;
  }
  
  .weather-location {
    font-size: 11px;
    max-width: 60px;
  }
  
  .city-form {
    padding: 3px 6px;
    gap: 4px;
  }
  
  .weather-close {
    width: 20px;
    height: 20px;
  }
}
</style>
