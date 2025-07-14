

<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage } = useLanguage()

const heroTitle = computed(() => 
  currentLanguage.value === 'fr' 
    ? 'Florian SILVA' 
    : 'Florian SILVA'
)

const heroSubtitle = computed(() => 
  currentLanguage.value === 'fr' 
    ? "Étudiant en informatique."
    : "Computer Science Student."
)

const aboutMeText = computed(() =>
  currentLanguage.value === 'fr'
    ? "Je m'appelle Florian Silva, j'ai 18 ans et je suis actuellement en deuxième année de licence d'informatique à l'Université Picardie Jules Verne d'Amiens. Ma passion pour l'informatique a commencé dès mon plus jeune âge et s'est transformée en une véritable vocation lorsque j'ai écrit mes premières lignes de code à l'adolescence. Ce qui me motive, c'est de construire des applications non seulement fonctionnelles, mais aussi élégantes et robustes. Je porte un intérêt particulier à la qualité du code et à la création d'expériences utilisateur fluides sur tous les appareils, ce qui explique mon attrait pour des technologies comme Docker, qui garantissent consistance et fiabilité."
    : "My name is Florian Silva, I am 18 years old, and I am currently a sophomore in Computer Science at the University of Picardie Jules Verne in Amiens. My passion for computing began at a very young age and grew into a true calling when I wrote my first lines of code as a teenager. What drives me is building applications that are not only functional but also elegant and robust. I have a keen interest in code quality and creating seamless user experiences across all devices, which explains my draw to technologies like Docker that ensure consistency and reliability."
);

const skillsTitle = computed(() => 
  currentLanguage.value === 'fr' ? 'Compétences Techniques' : 'Technical Skills'
)

const skillCategories = computed(() => 
  currentLanguage.value === 'fr' 
    ? [
        {
          name: 'Frontend',
          skills: ['Vue.js', 'Nuxt.js', 'React', 'TypeScript', 'Tailwind CSS', 'SCSS']
        },
        {
          name: 'Backend',
          skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'C/C++', 'Docker']
        },
        {
          name: 'Outils',
          skills: ['Git', 'VS Code', 'Figma', 'Postman', 'Linux']
        }
      ]
    : [
        {
          name: 'Frontend',
          skills: ['Vue.js', 'Nuxt.js', 'React', 'TypeScript', 'Tailwind CSS', 'SCSS']
        },
        {
          name: 'Backend',
          skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'Docker']
        },
        {
          name: 'Tools',
          skills: ['Git', 'VS Code', 'Figma', 'Postman', 'Linux', 'AWS']
        }
      ]
)

const passionTitle = computed(() => 
  currentLanguage.value === 'fr' ? 'Ce qui m\'anime' : 'What Drives Me'
)

const passions = computed(() => 
  currentLanguage.value === 'fr' 
    ? [
        {
          icon: '✨',
          title: 'Code Élégant',
          description: "Créer des solutions propres, performantes et maintenables."
        },
        {
          icon: '📱',
          title: 'UX Universelle',
          description: 'Garantir une expérience parfaite sur tous les supports, du mobile au desktop.'
        },
        {
          icon: '🛠️',
          title: 'Outils Modernes',
          description: "Explorer et maîtriser les technologies qui façonnent le web de demain."
        },
        {
          icon: '🌱',
          title: 'Apprentissage Continu',
          description: 'Rester curieux et me former constamment pour relever de nouveaux défis.'
        }
      ]
    : [
        {
          icon: '✨',
          title: 'Elegant Code',
          description: "Creating clean, efficient, and maintainable solutions."
        },
        {
          icon: '📱',
          title: 'Universal UX',
          description: 'Ensuring a perfect experience on all devices, from mobile to desktop.'
        },
        {
          icon: '🛠️',
          title: 'Modern Tools',
          description: "Exploring and mastering the technologies that shape tomorrow's web."
        },
        {
          icon: '🌱',
          title: 'Continuous Learning',
          description: 'Staying curious and constantly training to take on new challenges.'
        }
      ]
)
</script>

<template>
  <div class="about-modal-content">
    <!-- Section principale -->
    <div class="hero-section">
      <div class="hero-text">
        <h1 class="hero-title">{{ heroTitle }}</h1>
        <p class="hero-subtitle">{{ heroSubtitle }}</p>
      </div>
    </div>

    <!-- About Me Text -->
    <div class="about-me-section">
       <p>{{ aboutMeText }}</p>
    </div>

    <!-- Section compétences -->
    <div class="skills-section">
      <h2 class="section-title">{{ skillsTitle }}</h2>
      <div class="skills-grid">
        <div class="skill-category" v-for="category in skillCategories" :key="category.name">
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="skills-list">
            <span 
              v-for="skill in category.skills" 
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section passion -->
    <div class="passion-section">
      <h2 class="section-title">{{ passionTitle }}</h2>
      <div class="passion-grid">
        <div 
          v-for="passion in passions" 
          :key="passion.title"
          class="passion-card"
        >
          <div class="passion-icon">{{ passion.icon }}</div>
          <h3 class="passion-title">{{ passion.title }}</h3>
          <p class="passion-description">{{ passion.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-modal-content {
  font-family: 'DM Sans', sans-serif;
  color: var(--text-secondary);
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.hero-image {
  flex-shrink: 0;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-primary);
  box-shadow: 0 0 20px rgba(var(--accent-primary-rgb), 0.5);
}

/* Section Titles */
.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--accent-primary);
  border-radius: 2px;
}

.about-me-section {
  margin-bottom: 3rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* Skills Section */
.skills-section {
  margin-bottom: 3rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.skill-category {
  background: rgba(var(--text-primary-rgb), 0.05);
  padding: 1.5rem;
  border-radius: 16px;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  background: var(--accent-primary);
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Experience Section */
.experience-section {
  margin-bottom: 3rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -0.5rem;
  top: 0.25rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: 3px solid var(--bg-secondary);
}

.timeline-content {
  padding-left: 1rem;
}

.timeline-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.timeline-company {
  font-size: 1rem;
  color: var(--accent-primary);
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.timeline-period {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
}

.timeline-description {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* Passion Section */
.passion-section {
  margin-bottom: 2rem;
}

.passion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.passion-card {
  text-align: center;
  background: rgba(var(--text-primary-rgb), 0.05);
  padding: 1.5rem;
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.passion-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.passion-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.passion-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .profile-image {
    width: 90px;
    height: 90px;
  }
  
  .skills-grid,
  .passion-grid {
    grid-template-columns: 1fr;
  }
}
</style>
