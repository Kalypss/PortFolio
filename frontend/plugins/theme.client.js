export default defineNuxtPlugin(() => {
  // Initialiser le thème dès que possible
  if (process.client) {
    const initTheme = () => {
      const savedTheme = localStorage.getItem('preferred-theme') || 'dark'
      const root = document.documentElement
      
      const themes = {
        dark: {
          '--bg-primary': '#000000',
          '--bg-secondary': '#1A1A1A',
          '--text-primary': '#FFFFFF',
          '--text-secondary': '#CCCCCC',
          '--border-color': '#333333'
        },
        light: {
          '--bg-primary': '#1A1A1A',
          '--bg-secondary': '#FFFFFF',
          '--text-primary': '#1A1A1A',
          '--text-secondary': '#666666',
          '--border-color': '#E0E0E0'
        }
      }
      
      const themeVariables = themes[savedTheme] || themes.dark
      
      // Appliquer toutes les variables CSS
      Object.entries(themeVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
      
      // Ajouter une classe au body
      document.body.className = `theme-${savedTheme}`
    }
    
    // Initialiser immédiatement si le DOM est prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTheme)
    } else {
      initTheme()
    }
  }
})
