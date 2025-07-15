import { ref, reactive } from 'vue'

export const useWeather = () => {
  const weatherData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const currentCity = ref('')


  const BACKEND_URL = 'api.floriansilva.dev'


  const fetchWeather = async (city) => {
    if (!city || city.trim() === '') {
      error.value = 'Veuillez entrer une ville'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch(`https://${BACKEND_URL}/api/weather/${encodeURIComponent(city)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la récupération des données météo')
      }

      const data = await response.json()
      weatherData.value = data
      currentCity.value = city
      
    } catch (err) {
      console.error('Erreur météo:', err)
      error.value = err.message
      weatherData.value = null
    } finally {
      isLoading.value = false
    }
  }

  const clearWeather = () => {
    weatherData.value = null
    currentCity.value = ''
    error.value = null
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })
  }

  return {
    weatherData,
    isLoading,
    error,
    currentCity,
    fetchWeather,
    clearWeather,
    getCurrentTime,
    getCurrentDate
  }
}
