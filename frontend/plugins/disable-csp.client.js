// Plugin pour désactiver les restrictions CSP côté client
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Supprimer les meta CSP s'ils existent
    const cspMetas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]')
    cspMetas.forEach(meta => meta.remove())
    
    // Désactiver les warnings referrer policy dans la console
    const originalWarn = console.warn
    console.warn = function(...args) {
      if (args.some(arg => 
        typeof arg === 'string' && 
        (arg.includes('Referrer Policy') || arg.includes('Content-Security-Policy'))
      )) {
        return // Ignorer ces warnings
      }
      originalWarn.apply(console, args)
    }
    
    console.log('🔓 CSP désactivé pour le développement')
  }
})
