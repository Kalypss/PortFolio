<template>
  <Html lang="fr">
    <Head>
      <Title>Silva Florian - Portfolio Développeur Full Stack</Title>
      
      <!-- Métadonnées de base -->
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="description" content="Portfolio 2025 de Silva Florian, étudiant en informatique et  développeur full stack spécialisé en Vue.js, Nuxt.js, TypeScript et technologies modernes. Découvrez mes projets et compétences." />
      <Meta name="keywords" content="développeur, full stack, Vue.js, Nuxt.js, TypeScript, JavaScript, portfolio, Silva Florian" />
      <Meta name="author" content="Silva Florian" />
      <Meta name="referrer" content="strict-origin-when-cross-origin" />
      
      <!-- Open Graph / Facebook -->
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content="Silva Florian - Portfolio Développeur Full Stack" />
      <Meta property="og:description" content="Portfolio de Silva Florian, développeur full stack spécialisé en Vue.js, Nuxt.js et technologies modernes." />
      <Meta property="og:image" content="/social/og-image.png" />
      <Meta property="og:url" content="https://portfolio.gofindr.fr" />
      <Meta property="og:site_name" content="Portfolio Silva Florian" />
      
      <!-- Twitter -->
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@K4lyps" />
      <Meta name="twitter:creator" content="@K4lyps" />
      <Meta name="twitter:title" content="Silva Florian - Portfolio Développeur Full Stack" />
      <Meta name="twitter:description" content="Portfolio de Silva Florian, développeur full stack spécialisé en Vue.js, Nuxt.js et technologies modernes." />
      <Meta name="twitter:image" content="/social/twitter-card.png" />
      
      <!-- Preconnect pour optimiser les performances - conditionnels -->
      <Link rel="dns-prefetch" href="https://api.github.com" />
            
      <!-- Optimisations mobiles -->
      <Meta name="format-detection" content="telephone=no" />
      <Meta name="mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      <!-- Favicon et icônes d'application -->
      <Link rel="icon" type="image/x-icon" href="/icons/favicons/favicon.ico" />
      <Link rel="apple-touch-icon" sizes="57x57" href="/icons/apple/apple-icon-57x57.png" />
      <Link rel="apple-touch-icon" sizes="60x60" href="/icons/apple/apple-icon-60x60.png" />
      <Link rel="apple-touch-icon" sizes="72x72" href="/icons/apple/apple-icon-72x72.png" />
      <Link rel="apple-touch-icon" sizes="76x76" href="/icons/apple/apple-icon-76x76.png" />
      <Link rel="apple-touch-icon" sizes="114x114" href="/icons/apple/apple-icon-114x114.png" />
      <Link rel="apple-touch-icon" sizes="120x120" href="/icons/apple/apple-icon-120x120.png" />
      <Link rel="apple-touch-icon" sizes="144x144" href="/icons/apple/apple-icon-144x144.png" />
      <Link rel="apple-touch-icon" sizes="152x152" href="/icons/apple/apple-icon-152x152.png" />
      <Link rel="apple-touch-icon" sizes="180x180" href="/icons/apple/apple-icon-180x180.png" />
      <Link rel="icon" type="image/png" sizes="192x192" href="/icons/android/android-icon-192x192.png" />
      <Link rel="icon" type="image/png" sizes="32x32" href="/icons/favicons/favicon-32x32.png" />
      <Link rel="icon" type="image/png" sizes="96x96" href="/icons/favicons/favicon-96x96.png" />
      <Link rel="icon" type="image/png" sizes="16x16" href="/icons/favicons/favicon-16x16.png" />
      <Link rel="manifest" href="/manifest.json" />
      
      <!-- Métadonnées pour applications mobiles -->
      <Meta name="msapplication-TileColor" content="#ffffff" />
      <Meta name="msapplication-TileImage" content="/icons/favicons/ms-icon-144x144.png" />
      <Meta name="theme-color" content="#ffffff" />
    </Head>
    
    <Body>
      <div class="min-h-screen transition-colors duration-300" :class="{ 'bg-white text-gray-900': true, 'dark:bg-slate-900 dark:text-slate-100': true }">
        <NuxtPage />
      </div>
    </Body>
  </Html>
</template>

<script setup>
import { onMounted } from 'vue'

// Initialisation du thème au chargement de l'app
onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('portfolio-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e)
      }
    }
  }
})
</script>


<style scoped>

html {
  scroll-behavior: smooth;
}

/* Réduction des animations sur appareils à faible performance */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Optimisation pour mobiles */
@media (max-width: 768px) {
  * {
    will-change: auto !important;
  }
  
  /* Réduire drastiquement les animations sur mobile */
  [class*="animate-"],
  .transition-colors,
  .transition-all {
    animation-duration: 0.1s !important;
    animation-delay: 0s !important;
    transition-duration: 0.1s !important;
  }
  
  /* Optimiser le rendu des transforms */
  .transform {
    transform: none !important;
  }
  
  /* Simplifier les dégradés et effets complexes sur mobile */
  .bg-gradient-to-r,
  .bg-gradient-to-b,
  .bg-gradient-to-l,
  .bg-gradient-to-t {
    background: var(--bg-primary) !important;
  }
}

</style>