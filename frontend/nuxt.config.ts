// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Fichiers CSS globaux
  css: ['~/assets/css/critical.css', '~/assets/css/main.css'],

  // Configuration pour les bibliothèques côté client
  build: {
    transpile: ['three', '@splinetool/runtime']
  },
  
  // Configuration des modules
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],
  
  // Configuration Tailwind
  tailwindcss: {
    config: {
      darkMode: 'class',
      content: [
        './components/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './app.vue'
      ]
    }
  },

  googleFonts: {
    families: {
      'DM Sans': [300, 400, 500, 600],
      'Inter': [300, 400, 500, 600, 700] // Ajouter Inter si utilisé
    },
    display: 'swap',
    preconnect: true,
    preload: true,
    prefetch: false,
    download: true,
    inject: true
  },

  // Configuration app avec sécurité optimisée
  app: {
    // La configuration head est maintenant dans app.vue pour une meilleure flexibilité
  },

  // Configuration pour optimiser les performances
  nitro: {
    prerender: {
      routes: ['/']
    },
    compressPublicAssets: true,
    minify: true
  },

  // Configuration Vite pour optimiser le build
  vite: {
    define: {
      global: 'globalThis', // Fix pour certaines libraries
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Garder les logs en dev
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('@splinetool') || id.includes('three')) {
              return 'spline-desktop'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      }
    },
    optimizeDeps: {
      include: ['three', '@splinetool/runtime']
    }
  },

  // Configuration SSR
  ssr: true,
  
  // Configuration runtime
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001' || "api.floriansilva.dev"
    }
  },
  
  // Configuration pour améliorer les Core Web Vitals
  experimental: {
    payloadExtraction: false
  },
  
  // Configuration des headers pour optimiser le cache et désactiver CSP
  routeRules: {
    '/': { 
      prerender: true,
      headers: { 
        'cache-control': 's-maxage=31536000',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin'
      }
    },
    '/api/**': { 
      headers: { 'cache-control': 'max-age=300' }
    }
  }
})
