<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from 'vue';
import { useTheme } from '~/composables/useTheme';

// SEO et données structurées
useHead({
  title: 'Florian Silva - Développeur Full-Stack Créatif',
  meta: [
    { name: 'description', content: 'Portfolio de Florian Silva, développeur web Full-Stack spécialisé en Vue.js, Nuxt.js et Node.js. Découvrez mes projets innovants et mon approche créative du développement.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Florian Silva',
        'url': 'https://floriansilva.dev',
        'jobTitle': 'Développeur Full-Stack',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Florian Silva'
        },
        'sameAs': [
          'https://github.com/Kalypss',
          'https://www.linkedin.com/in/florian-silva-139ba4374/',
          'https://x.com/K4lyps'
        ]
      })
    }
  ]
});

// Initialiser le thème
const { initTheme } = useTheme();

const firstNameRef = ref(null);
const lastNameRef = ref(null);
const carouselTrack = ref(null);

// Navigation par scroll entre sections (desktop seulement)
const currentSection = ref(0);
const isScrolling = ref(false);
const sections = ['hero-section', 'bento-section', 'projects-section', 'footer-section'];

const scrollToSection = (sectionIndex) => {
  if (isScrolling.value || sectionIndex < 0 || sectionIndex >= sections.length) return;
  
  isScrolling.value = true;
  currentSection.value = sectionIndex;
  
  const sectionClass = sections[sectionIndex];
  const element = document.querySelector(`.${sectionClass}`);
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Réinitialiser le flag après l'animation (temps réduit)
    setTimeout(() => {
      isScrolling.value = false;
    }, 500); // Réduit de 1000ms à 500ms
  } else {
    isScrolling.value = false;
  }
};

const setupSectionScrolling = () => {
  // Seulement sur desktop (pas mobile/tablette)
  if (process.client && window.innerWidth <= 768) return;
  
  let lastScrollTime = 0;
  let scrollDelta = 0;
  let isUserScrolling = false;
  
  const handleWheel = (e) => {
    if (isScrolling.value) {
      return; // Ne pas empêcher le scroll, juste ignorer
    }
    
    const now = Date.now();
    
    // Limiter la fréquence des événements de scroll
    if (now - lastScrollTime < 500) return; // Augmenté de 100ms à 500ms
    
    scrollDelta += e.deltaY;
    
    // Seuil beaucoup plus élevé pour déclencher la navigation
    const threshold = 800; // Augmenté de 150 à 800
    
    // Seulement si l'utilisateur scroll vraiment beaucoup
    if (Math.abs(scrollDelta) > threshold) {
      // Ne pas empêcher le scroll par défaut
      
      if (scrollDelta > 0) {
        // Scroll vers le bas - seulement si on est vraiment à la fin de la section
        if (currentSection.value < sections.length - 1) {
          const currentElement = document.querySelector(`.${sections[currentSection.value]}`);
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementBottom = currentElement.offsetTop + currentElement.offsetHeight;
          
          // Seulement si on est proche de la fin de la section
          if (scrollTop + window.innerHeight >= elementBottom - 100) {
            scrollToSection(currentSection.value + 1);
          }
        }
      } else {
        // Scroll vers le haut - seulement si on est vraiment au début de la section
        if (currentSection.value > 0) {
          const currentElement = document.querySelector(`.${sections[currentSection.value]}`);
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Seulement si on est proche du début de la section
          if (scrollTop <= currentElement.offsetTop + 100) {
            scrollToSection(currentSection.value - 1);
          }
        }
      }
      
      scrollDelta = 0;
      lastScrollTime = now;
    }
    
    // Réinitialiser le delta après un délai plus long
    setTimeout(() => {
      scrollDelta = 0;
    }, 1000); // Augmenté de 200ms à 1000ms
  };
  
  // Observer pour détecter quelle section est visible (plus tolérant)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px', // Réduit de 40% à 20%
    threshold: 0.3 // Augmenté de 0.1 à 0.3
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    if (isScrolling.value) return;
    
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionClass = entry.target.className.split(' ').find(cls => 
          sections.includes(cls)
        );
        if (sectionClass) {
          const index = sections.indexOf(sectionClass);
          if (index !== -1) {
            currentSection.value = index;
          }
        }
      }
    });
  }, observerOptions);
  
  // Observer toutes les sections
  sections.forEach(sectionClass => {
    const element = document.querySelector(`.${sectionClass}`);
    if (element) {
      sectionObserver.observe(element);
    }
  });
  
  // Ajouter l'écouteur de scroll (maintenant en mode passif)
  window.addEventListener('wheel', handleWheel, { passive: true });
  
  // Cleanup
  return () => {
    window.removeEventListener('wheel', handleWheel);
    sectionObserver.disconnect();
  };
};

// Logique du carrousel infini
const currentSlide = ref(0);
const isTransitioning = ref(false);

// Données des projets
const projects = ref([
  {
    id: 1,
    title: "Logon",
    description: {
      fr: "Plateforme e-commerce moderne avec fonctionnalités avancées et une interface utilisateur soignée.",
      en: "Modern e-commerce platform with advanced features and a beautiful UI."
    },
    status: "In Progress",
    technologies: ['Vue.js', 'Nuxt'],
    technologiesIcons: ['/tech-icons/vue.svg', '🚀'],
    techLabelColor: "#4FC08D",
    imageUrl: "/assets/LogOn.png", // Image retirée
    link: "https://github.com/Kalypss/Logon"
  },
  {
    id: 2,
    title: "QR Code Gen",
    description: {
      fr: "Générateur de QR codes personnalisables avec prévisualisation en temps réel.",
      en: "Customizable QR code generator with real-time preview."
    },
    status: "Completed",
    technologies: ['React', 'CSS'],
    technologiesIcons: ['/tech-icons/react.svg', '🎨'],
    techLabelColor: "#F7DF1E",
    imageUrl: "/assets/QRCode.png", // Image retirée
    link: "https://github.com/Kalypss/QRCode-Gen"
  },
  {
    id: 3,
    title: "NotePad",
    description: {
      fr: "Application de prise de notes simple et rapide avec sauvegarde locale et interface minimaliste.",
      en: "Simple and fast note-taking app with local storage and a minimalist interface."
    },
    status: "In Progress",
    technologies: ['React', 'Vite'],
    technologiesIcons: ['/tech-icons/react.svg', '⚡️'],
    techLabelColor: "#61DAFB",
    imageUrl: "/assets/NotePad.png", // Image retirée
    link: "https://github.com/Kalypss/NotePad"
  }
]);

const clonedProjects = ref([]);
const numClones = 2;

onMounted(() => {
  const clonesStart = projects.value.slice(0, numClones).map(p => ({ ...p, id: `clone-start-${p.id}` }));
  const clonesEnd = projects.value.slice(-numClones).map(p => ({ ...p, id: `clone-end-${p.id}` }));
  clonedProjects.value = [...clonesEnd, ...projects.value, ...clonesStart];
  
  nextTick(() => {
    currentSlide.value = numClones;
    updateCarouselPosition(false); // Initial position without transition
  });
});

const goToSlide = (index) => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentSlide.value = index + numClones;
  updateCarouselPosition();
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

const nextSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentSlide.value++;
  updateCarouselPosition();

  if (currentSlide.value >= projects.value.length + numClones) {
    setTimeout(() => {
      isTransitioning.value = false;
      currentSlide.value = numClones;
      updateCarouselPosition(false);
    }, 500);
  } else {
    setTimeout(() => {
      isTransitioning.value = false;
    }, 500);
  }
};

const previousSlide = () => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentSlide.value--;
  updateCarouselPosition();

  if (currentSlide.value < numClones) {
    setTimeout(() => {
      isTransitioning.value = false;
      currentSlide.value = projects.value.length + numClones - 1;
      updateCarouselPosition(false);
    }, 500);
  } else {
    setTimeout(() => {
      isTransitioning.value = false;
    }, 500);
  }
};

const updateCarouselPosition = (transition = true) => {
  if (carouselTrack.value) {
    const slideWidth = carouselTrack.value.children[0].offsetWidth;
    const containerWidth = carouselTrack.value.parentElement.offsetWidth;
    const offset = (containerWidth - slideWidth) / 2;
    const translateX = -currentSlide.value * slideWidth + offset;
    
    carouselTrack.value.style.transition = transition ? 'transform 0.5s ease-out' : 'none';
    carouselTrack.value.style.transform = `translateX(${translateX}px)`;
  }
};

// Touch controls for mobile
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchEndX.value === 0) return;
  const swipeDistance = touchStartX.value - touchEndX.value;
  if (Math.abs(swipeDistance) > 50) { // Swipe threshold
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }
  // Reset values
  touchStartX.value = 0;
  touchEndX.value = 0;
};

// Initialiser les données GitHub avec des valeurs par défaut pour SSR
const githubData = ref({
  totalCommits: 0,
  totalRepos: 0,
  totalStars: 0,
  currentStreak: 0,
  longestStreak: 0,
  contributionGrid: [],
  isLoading: false,
  error: 'Données GitHub non disponibles'
});

// Fonction pour obtenir la couleur des contributions
const getContributionColor = (level) => {
  const colors = {
    0: '#ebedf0',
    1: '#9be9a8',
    2: '#40c463',
    3: '#30a14e',
    4: '#216e39'
  };
  return colors[level] || colors[0];
};

// Fonction de refetch (sera implémentée côté client)
let refetch = () => {
  console.log('Refetch des données GitHub...');
};

// Charger le composable GitHub seulement côté client et sur desktop/xl
const loadGitHubData = async () => {
  // Vérifier si on est côté client et sur desktop xl (1280px+)
  if (process.client && window.innerWidth >= 1280) {
    try {
      const { useGitHub } = await import('~/composables/useGitHub.js');
      const gitHubComposable = useGitHub('Kalypss');
      
      if (gitHubComposable && gitHubComposable.githubData) {
        // Surveiller les changements des données GitHub
        watch(gitHubComposable.githubData, (newData) => {
          if (newData) {
            githubData.value = { ...newData };
          }
        }, { immediate: true, deep: true });
        
        // Mettre à jour la fonction refetch
        if (gitHubComposable.refetch) {
          refetch = gitHubComposable.refetch;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du composable GitHub:', error);
      githubData.value.error = 'Erreur lors du chargement des données GitHub';
    }
  }
};



const scrollToProjects = () => {
  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    projectsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const setupNameHoverEffect = () => {
  // Désactiver l'effet sur mobile pour améliorer les performances
  if (process.client && window.innerWidth <= 768) {
    return;
  }
  
  const firstName = firstNameRef.value;
  const lastName = lastNameRef.value;
  if (!firstName || !lastName) return;

  // Convertir les deux noms en spans
  const allSpans = [];
  
  [firstName, lastName].forEach((element) => {
    const text = element.textContent;
    element.innerHTML = '';
    
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.transition = 'font-weight 0.1s ease';
      span.style.fontWeight = '300';
      allSpans.push(span);
      element.appendChild(span);
    });
  });

  // Variables pour l'optimisation
  let rafId = null;
  let lastMouseX = 0;
  let lastMouseY = 0;
  
  // Fonction optimisée avec requestAnimationFrame
  const updateWeights = () => {
    allSpans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const spanX = spanRect.left + spanRect.width * 0.5;
      const spanY = spanRect.top + spanRect.height * 0.5;
      
      // Calcul optimisé de la distance par rapport à la souris globale
      const dx = lastMouseX - spanX;
      const dy = lastMouseY - spanY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Zone d'influence large pour effet continu
      const maxDistance = 120;
      
      if (distance <= maxDistance) {
        const influence = 1 - (distance / maxDistance);
        const smoothInfluence = Math.pow(influence, 0.7);
        const fontWeight = 300 + (500 * smoothInfluence);
        span.style.fontWeight = Math.round(fontWeight);
      } else {
        span.style.fontWeight = '300';
      }
    });
    rafId = null;
  };

  // Créer une zone globale qui couvre les deux noms
  const nameSection = firstName.parentElement;
  const globalArea = document.createElement('div');
  globalArea.style.position = 'absolute';
  globalArea.style.top = '-80px';
  globalArea.style.left = '-80px';
  globalArea.style.right = '-80px';
  globalArea.style.bottom = '-80px';
  globalArea.style.pointerEvents = 'auto';
  globalArea.style.zIndex = '1';
  
  nameSection.style.position = 'relative';
  nameSection.appendChild(globalArea);

  // Effet de proximité global
  globalArea.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    if (!rafId) {
      rafId = requestAnimationFrame(updateWeights);
    }
  });

  // Retour à la normale
  globalArea.addEventListener('mouseleave', () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    allSpans.forEach((span) => {
      span.style.fontWeight = '300';
    });
  });
};

onMounted(async () => {
  // Initialiser le thème
  initTheme();
  
  // Charger les données GitHub côté client seulement sur desktop
  await loadGitHubData();
  
  // Configurer le scroll par sections (desktop seulement)
  let cleanupScrolling = null;
  if (process.client && window.innerWidth > 768) {
    setTimeout(() => {
      cleanupScrolling = setupSectionScrolling();
    }, 1000);
  }
  // Initialiser l'effet hover directement (optimisé pour mobile)
  setTimeout(() => {
    setupNameHoverEffect();
  }, 100);
  // Cleanup lors du démontage
  onUnmounted(() => {
    if (cleanupScrolling) {
      cleanupScrolling();
    }
  });
});
</script>

<template>
  <!-- Page principale du portfolio -->
  <div class="portfolio-container bg-black font-dm overflow-x-hidden transition-colors duration-300" style="overflow-x:hidden;">
    <div class="mx-auto bg-black">
      <!-- Hero Section avec scroll snap -->
      <section class="hero-section flex w-full items-center justify-center lg:justify-between lg:mx-auto px-4 lg:px-10 md:px-6 sm:px-4 h-[100vh] relative bg-black transition-colors duration-300" style="max-width:1400px;">
        <div class="flex flex-row items-center justify-center lg:justify-between h-[100vh] w-full max-w-7xl opacity-0 translate-y-8 animate-[slideInUp_1s_ease_0.2s_forwards]">
          <!-- Section titre et nom -->
          <div class="flex flex-col items-start justify-center w-full lg:w-auto lg:ml-5 gap-2 lg:gap-1">
            <div class="flex flex-row gap-2 items-baseline self-start lg:ml-1.5 ml-0 relative lg:flex-row lg:gap-5 lg:justify-start md:flex-row md:gap-5 md:justify-start sm:flex-row sm:gap-1">
              <h1 ref="firstNameRef" class="text-[clamp(2rem,8vw,4.5rem)] font-light text-white m-0 tracking-[-2px] leading-none cursor-default lg:text-[clamp(2.5rem,6vw,4.5rem)] md:text-[clamp(2.2rem,7vw,4rem)] sm:text-[clamp(1.8rem,8vw,3rem)] transition-colors duration-300">SILVA</h1>
              <span ref="lastNameRef" class="text-[clamp(2rem,8vw,4.5rem)] font-light text-white m-0 tracking-[-2px] leading-none cursor-default lg:ml-[-10px] ml-[-5px] lg:text-[clamp(2.5rem,6vw,4.5rem)] md:text-[clamp(2.2rem,7vw,4rem)] sm:text-[clamp(1.8rem,8vw,3rem)] transition-colors duration-300">Florian</span>
            </div>
            
            <div class="flex flex-row items-center gap-0 self-start lg:justify-start md:justify-start">
              <img 
                src="/assets/portfolio.svg" 
                alt="Portfolio" 
                class="portfolio-svg w-auto object-contain transition-all duration-300
                       lg:h-24 lg:max-w-[500px]
                       md:h-20 md:max-w-[400px] 
                       sm:h-16 sm:max-w-[320px]
                       h-14 max-w-[280px]"
              />
            </div>
          </div>
          
          <!-- Spline Model 3D - masqué sur tablettes et mobiles pour les performances -->
          <div class="hidden xl:flex items-end justify-end w-full max-w-lg h-full" style="max-width:1580px;">
            <ClientOnly>
              <div style="width:100%;height:100%;max-width:1200px;">
                <LazySplineModel />
              </div>
              <template #fallback>
                <div class="loading-3d flex items-center justify-end w-full h-full text-gray-500">
                  <div class="text-center">
                    <div class="animate-pulse">Modèle 3D</div>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </section>

      <!-- Div de transition avec gradient -->
      <div class="w-full h-[5vh] gradient-transition lg:h-[50vh] md:h-[20vh] sm:h-[10vh]"></div>

      <!-- Section Bento avec scroll snap (ClientOnly pour éviter le mismatch SSR/CSR sur GitHubTile) -->
      <section class="bento-section w-full min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
        <ClientOnly>
          <BentoComponent />
        </ClientOnly>
      </section>

      <!-- Section des projets avec carrousel (toujours après le bento) -->
      

      <!-- Footer -->
      <footer class="footer-section w-full bg-[var(--bg-secondary)] transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 lg:px-10 md:px-6 sm:px-4 py-16 lg:py-20">
          <!-- Footer content -->
          <div class="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 lg:gap-12">
            <!-- Section About -->
            <div class="footer-section-content">
              <h4 class="font-semibold text-lg text-[var(--text-primary)] mb-4 transition-colors duration-300">
                À Propos
              </h4>
              <p class="text-[var(--text-secondary)] text-sm leading-relaxed transition-colors duration-300">
                Développeur Full-Stack passionné par la création d'expériences numériques innovantes. 
                Spécialisé dans les technologies modernes pour transformer vos idées en réalité.
              </p>
            </div>
            
            <!-- Section Links -->
            <div class="footer-section-content">
              <h4 class="font-semibold text-lg text-[var(--text-primary)] mb-4 transition-colors duration-300">
                Navigation
              </h4>
              <ul class="space-y-2">
                <li>
                  <a href="#" @click.prevent="window.scrollTo({ top: 0, behavior: 'smooth' })" class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#project-section" class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm">
                    Projets
                  </a>
                </li>
                <li>
                  <a href="#bento-section" class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm">
                    À Propos
                  </a>
                </li>
                <li>
                  <a href="#footer-section" class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <!-- Section Technologies -->
            <div class="footer-section-content">
              <h4 class="font-semibold text-lg text-[var(--text-primary)] mb-4 transition-colors duration-300">
                Technologies
              </h4>
              <ul class="space-y-2">
                <li class="text-[var(--text-secondary)] text-sm transition-colors duration-300">Vue.js & Nuxt.js</li>
                <li class="text-[var(--text-secondary)] text-sm transition-colors duration-300">React & Next.js</li>
                <li class="text-[var(--text-secondary)] text-sm transition-colors duration-300">Node.js & Python</li>
                <li class="text-[var(--text-secondary)] text-sm transition-colors duration-300">Three.js & GSAP</li>
              </ul>
            </div>
            
            <!-- Section Contact -->
            <div class="footer-section-content">
              <h4 class="font-semibold text-lg text-[var(--text-primary)] mb-4 transition-colors duration-300">
                Contact
              </h4>
              <div class="space-y-3">
                <a 
                  href="mailto:contact@floriansilva.dev" 
                  class="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  dev.silva.florian@gmail.com
                </a>
                
                <div class="flex gap-4 mt-4">
                  <a 
                    href="https://github.com/Kalypss" 
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/florian-silva-139ba4374/" 
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://x.com/K4lyps" 
                    class="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer bottom -->
          <div class="border-t border-[var(--border-color)] mt-12 pt-8 text-center">
            <p class="text-[var(--text-secondary)] text-sm transition-colors duration-300">
              © {{ new Date().getFullYear() }} Florian Silva. Ce site et son contenu sont la propriété intellectuelle de Florian Silva.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Styles customisés pour les animations et effets spéciaux */
@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseStatus {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.animate-pulse-status {
  animation: pulseStatus 2s infinite;
}

/* Gradient de transition qui s'adapte au thème */
.gradient-transition {
  background: linear-gradient(to bottom, #000000, var(--bg-primary));
  transition: background 0.5s ease;
}


/* Assurer que chaque section prend exactement la hauteur de l'écran */
.hero-section,
.bento-section {
  min-height: 100vh;
  max-height: 100vh;
}

.projects-section {
  min-height: 100vh;
  padding-bottom: 2vh;
}

/* Adaptations mobiles pour la section projets */
@media (max-width: 768px) {
  .projects-section {
    height: 100vh; /* Occupe toute la hauteur de l'écran */
    margin-top: 130vh; /* Ajout d'une marge pour pousser le carrousel vers le bas */
    padding: 20px 8px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
  
  .hero-section,
  .bento-section,
  .footer-section {
    height: auto; /* Hauteur automatique pour s'adapter au contenu */
    min-height: 0; /* Réinitialiser la hauteur minimale */
  }
}

.footer-section {
  min-height: 10vh;
}

/* Styles pour le carrousel infini */
.carousel-container {
  position: relative;
}

.carousel-wrapper {
  overflow: hidden;
  border-radius: 20px;
}

.carousel-track {
  display: flex;
  will-change: transform;
}

.carousel-slide {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Adaptations spécifiques pour mobile */
@media (max-width: 768px) {
  .carousel-wrapper {
    overflow: hidden; /* Assure que les autres cartes sont masquées */
  }
  
  .carousel-slide {
    width: 100%; /* Chaque slide prend toute la largeur */
    padding: 0 16px; /* Ajoute un peu d'espace sur les côtés */
  }

  .project-card-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .carousel-wrapper {
    max-width: 320px;
    border-radius: 14px;
  }
  
  .carousel-slide {
    min-height: 450px;
    padding: 0 2px;
  }
  
  .project-card-container {
    max-width: 300px !important;
  }
}

@media (max-width: 360px) {
  .carousel-wrapper {
    max-width: 280px;
  }
  
  .carousel-slide {
    min-height: 420px;
  }
  
  .project-card-container {
    max-width: 260px !important;
  }
}

.project-card-container {
  transition: transform 0.3s ease;
}

/* Indicateurs du carrousel */
.carousel-indicators {
  z-index: 10;
}

.indicator {
  background-color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  padding: 0;
  opacity: 0.3;
}

.indicator.active {
  background-color: var(--accent-primary, #4FC08D);
  transform: scale(1.5);
  opacity: 1;
}

/* Boutons de navigation - sans bordure ni fond */
.carousel-nav {
  background-color: var(--dynamic-bg, rgba(255, 255, 255, 0.7)); /* Fallback pour le blanc */
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dynamic-color, #000000); /* Fallback pour le noir */
  transition: background-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
  z-index: 10;
  opacity: 0.8;
}

.carousel-nav:hover {
  opacity: 1;
}

.carousel-nav:active {
  opacity: 0.6;
}

/* Variables pour le thème */
html[data-theme='dark'] .carousel-nav {
  --dynamic-bg: rgba(255, 255, 255, 0.4);
  --dynamic-color: #000000;
}

html[data-theme='light'] .carousel-nav {
  --dynamic-bg: rgba(0, 0, 0, 0.4);
  --dynamic-color: #ffffff;
}

/* Adaptation mobile pour le carrousel */
@media (max-width: 768px) {
  .carousel-nav {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--text-primary);
    opacity: 0.4;
    backdrop-filter: blur(8px);
  }
  
  .carousel-prev {
    left: 4px !important;
  }
  
  .carousel-next {
    right: 4px !important;
  }
  
  .indicator {
    width: 8px !important;
    height: 8px !important;
  }
  
  .carousel-indicators {
    gap: 6px !important;
    margin-bottom: 16px !important;
  }
  
  /* Assurer que les projets sont visibles */
  .projects-section {
    padding: 20px 8px !important;
    min-height: auto !important;
  }
}

@media (max-width: 480px) {
  .carousel-nav {
    width: 32px;
    height: 32px;
  }
  
  .carousel-prev {
    left: 2px !important;
  }
  
  .carousel-next {
    right: 2px !important;
  }
  
  .indicator {
    width: 6px !important;
    height: 6px !important;
  }
  
  .carousel-indicators {
    gap: 4px !important;
    margin-bottom: 12px !important;
  }
}

/* Styles pour le footer */
.footer-section {
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.footer-section-content h4 {
  position: relative;
}

.footer-section-content h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--accent-primary, #4FC08D);
  border-radius: 1px;
}

/* Animation d'entrée pour le footer */
.footer-section {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimisations mobile pour les animations */
@media (max-width: 768px) {
  .portfolio-container {
    scroll-snap-type: none !important; /* Désactiver complètement le scroll snap sur mobile */
    scroll-behavior: auto; /* Scroll naturel sur mobile */
  }
  
  /* Supprimer le scroll snap align sur mobile */
  .hero-section,
  .bento-section,
  .projects-section,
  .footer-section {
    scroll-snap-align: none !important;
    scroll-snap-stop: normal !important;
    min-height: auto !important;
  }
  
  /* Améliorer la visibilité du bento sur mobile */
  .bento-section {
    scroll-margin-top: -5vh; /* Compensation pour le gradient très réduit sur mobile */
  }
  
  /* Simplifier les animations slideInUp sur mobile */
  [class*="animate-[slideInUp"] {
    animation-duration: 0.4s !important;
    animation-timing-function: ease !important;
  }
  
  /* Optimiser les transitions de couleurs */
  .transition-colors {
    transition-duration: 0.2s !important;
  }
}

/* Styles spécifiques pour la section des projets */
.projects-section {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Effet de parallaxe subtil pour les projets */
@media (min-width: 1024px) {
  .projects-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(79, 192, 141, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }
}

/* Styles pour le SVG portfolio responsive */
.portfolio-svg {
  filter: brightness(1.1) contrast(1.05);
  transition: all 0.3s ease;
  flex-shrink: 0; /* Empêche le rétrécissement */
}


/* Responsive breakpoints spécifiques pour le SVG */
@media (max-width: 480px) {
  .portfolio-svg {
    height: 3rem !important; /* 48px - augmenté */
    max-width: 240px !important;
  }
}

@media (max-width: 360px) {
  .portfolio-svg {
    height: 2.5rem !important; /* 40px - augmenté */
    max-width: 200px !important;
  }
}

/* Medium screens - améliorer la taille */
@media (min-width: 768px) and (max-width: 1023px) {
  .portfolio-svg {
    height: 5rem !important; /* 80px */
    max-width: 450px !important;
  }
}

/* Large screens - augmenter la taille */
@media (min-width: 1280px) {
  .portfolio-svg {
    height: 6rem !important; /* 96px */
    max-width: 600px !important;
  }
}

/* Extra large screens */
@media (min-width: 1536px) {
  .portfolio-svg {
    height: 7rem !important; /* 112px */
    max-width: 700px !important;
  }
}
/* Empêche tout scroll horizontal sur la page, même lors des scroll snap ou wheel events */
:global(html), :global(body) {
  overflow-x: hidden !important;
  width: 100vw;
  max-width: 100vw;
  position: relative;
}
</style>
