// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Fichiers CSS globaux
  css: ['~/assets/css/critical.css', '~/assets/css/main.css'],

  // Configuration pour les bibliothèques côté client
  build: {
    transpile: ['three', '@splinetool/runtime'],
  },

  // Configuration des modules
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/sitemap',
  ],

  // Configuration du sitemap
  sitemap: {
    hostname: 'https://floriansilva.dev',
    gzip: true,
    routes: ['/'],
  },

  // Configuration Tailwind
  tailwindcss: {
    config: {
      darkMode: 'class',
      content: [
        './components/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './app.vue',
      ],
    },
  },

  googleFonts: {
    families: {
      'DM Sans': [300, 400, 500, 600],
      'Inter': [300, 400, 500, 600, 700],
    },
    display: 'swap',
    preconnect: true,
    preload: true,
    prefetch: false,
    download: true,
    inject: true,
  },

  // Configuration app avec SEO
  app: {
    head: {
      title: 'Florian Silva - Développeur Full-Stack & Créatif',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "Portfolio de Florian Silva, développeur Full-Stack passionné par la création d'expériences web innovantes et performantes. Découvrez mes projets, compétences et mon univers créatif." },
        { name: 'keywords', content: 'Florian Silva, développeur web, full-stack, Vue.js, Nuxt.js, Node.js, développeur créatif, portfolio, développeur front-end, développeur back-end' },
        { name: 'author', content: 'Florian Silva' },
        // Open Graph / Facebook
        { hid: 'og:title', property: 'og:title', content: 'Florian Silva - Développeur Full-Stack & Créatif' },
        { hid: 'og:description', property: 'og:description', content: "Découvrez le portfolio de Florian Silva, un développeur passionné qui transforme les idées en expériences numériques mémorables." },
        { hid: 'og:image', property: 'og:image', content: 'https://floriansilva.dev/social/og-image.png' },
        { hid: 'og:url', property: 'og:url', content: 'https://floriansilva.dev' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        // Twitter Card
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: 'Florian Silva - Développeur Full-Stack & Créatif' },
        { hid: 'twitter:description', name: 'twitter:description', content: "Découvrez le portfolio de Florian Silva, un développeur passionné qui transforme les idées en expériences numériques mémorables." },
        { hid: 'twitter:image', name: 'twitter:image', content: 'https://floriansilva.dev/social/summary_large_image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
        { rel: 'canonical', href: 'https://floriansilva.dev' },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },

  // Configuration pour optimiser les performances
  nitro: {
    prerender: {
      routes: ['/'],
    },
    compressPublicAssets: true,
    minify: true,
  },

  // Configuration Vite pour optimiser le build
  vite: {
    define: {
      global: 'globalThis',
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('@splinetool') || id.includes('three')) {
              return 'spline-desktop';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ['three', '@splinetool/runtime'],
    },
  },

  // Configuration SSR
  ssr: true,

  // Configuration runtime
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  },

  // Configuration pour améliorer les Core Web Vitals
  experimental: {
    payloadExtraction: false,
  },

  // Configuration des headers pour optimiser le cache et la sécurité
  routeRules: {
    '/': {
      prerender: true,
      headers: {
        'cache-control': 's-maxage=31536000',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    },
    '/api/**': {
      headers: { 'cache-control': 'max-age=300' },
    },
  },
});