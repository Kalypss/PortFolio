# 🌟 Portfolio - Folio

> Portfolio moderne et interactif développé avec Nuxt.js et Vue 3, intégrant des données GitHub en temps réel et une interface météo intelligente.

![Portfolio Preview](./frontend/public/social/og-image.png)

## ✨ Aperçu

Folio est un portfolio personnel moderne qui présente vos projets GitHub de manière élégante avec une interface Bento design. L'application intègre des données en temps réel et offre une expérience utilisateur fluide avec support multilingue et thème adaptatif.

## 🚀 Fonctionnalités

- **🎨 Design Moderne** : Interface Bento avec animations fluides
- **📱 Responsive** : Adaptation parfaite sur tous les appareils  
- **🌙 Thème Adaptatif** : Mode sombre/clair avec transition fluide
- **🌍 Multilingue** : Support français/anglais
- **📊 GitHub Intégration** : Données de profil et repositories en temps réel
- **🌤️ Météo** : Informations météo locales avec cache intelligent
- **⚡ Performance** : Optimisé avec Nuxt.js et mise en cache Redis
- **🔒 Sécurisé** : Middleware de sécurité et rate limiting

## 🛠️ Technologies

### Frontend
- **Nuxt.js 3** - Framework Vue.js full-stack
- **Vue 3** - Framework JavaScript réactif
- **TailwindCSS** - Framework CSS utility-first
- **Three.js** - Bibliothèque 3D pour les animations
- **Spline** - Outil de modélisation 3D

### Backend  
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **Redis** - Base de données en mémoire pour le cache
- **GitHub API** - Intégration des données GitHub
- **WeatherAPI** - Service météorologique

## 📁 Structure du Projet

```
Folio/
├── 📱 frontend/                   # Application Nuxt.js
│   ├── 🎨 components/            # Composants Vue réutilisables
│   │   └── bento/               # Composants du design Bento
│   ├── 🔧 composables/          # Logique métier réutilisable
│   ├── 📄 pages/                # Pages de l'application
│   ├── 🎭 assets/               # Ressources statiques (CSS, images)
│   └── 🌐 public/               # Fichiers publics
│
├── 🔧 backend/                   # API Node.js/Express
│   ├── 🛡️ middleware/           # Middleware Express
│   ├── 🏪 services/             # Services métier
│   └── 📊 public/               # Ressources publiques API
│
└── 🐳 docker-compose.yml        # Orchestration Docker
```

## ⚡ Installation & Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Docker & Docker Compose (optionnel)

### 🔧 Installation Locale

1. **Cloner le repository**
```bash
git clone https://github.com/Kalypss/PortFolio.git
cd PortFolio
```

2. **Configuration Backend**
```bash
cd backend
npm install

# Créer le fichier .env
cat > .env << EOF
GITHUB_TOKEN=your_github_token_here
WEATHER_API_KEY=your_weather_api_key
PORT=3001
EOF
```

3. **Configuration Frontend**
```bash
cd ../frontend
npm install
```

4. **Démarrage**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

🌐 Accédez à l'application : `http://localhost:3000`

### 🐳 Installation Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier le statut
docker-compose ps
```

## 🔑 Configuration

### GitHub Token
1. Allez sur [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Créez un Personal Access Token avec les permissions `read:user`
3. Ajoutez le token dans `backend/.env`

### Weather API Key
1. Créez un compte sur [WeatherAPI](https://www.weatherapi.com/)
2. Récupérez votre clé API
3. Ajoutez la clé dans `backend/.env`

## 🎯 Utilisation

### Personnalisation du Portfolio

1. **Informations personnelles** : Modifiez `frontend/components/bento/AboutMeTile.vue`
2. **Projets** : Configurez votre username GitHub dans `frontend/composables/useGitHub.js`
3. **Réseaux sociaux** : Personnalisez `frontend/components/bento/SocialTile.vue`
4. **Thème** : Adaptez les couleurs dans `frontend/tailwind.config.js`

### Déploiement

#### Vercel (Recommandé pour le Frontend)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
cd frontend && vercel
```

#### Railway (Recommandé pour le Backend)
```bash
# Push vers Railway
railway login
railway link
railway up
```

## 📊 API Endpoints

### Backend API (`http://localhost:3001`)

- `GET /health` - Statut de l'API
- `GET /api/github/user/:username` - Profil GitHub
- `GET /api/github/repos/:username` - Repositories GitHub  
- `GET /api/weather/:city` - Données météo avec cache
- `GET /api/stats` - Statistiques de l'API

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Florian Silva**
- GitHub: [@Kalypss](https://github.com/Kalypss)
- Portfolio: [Votre Portfolio](https://your-portfolio-url.com)

---

⭐ N'hésitez pas à donner une étoile si ce projet vous a aidé !

- ✅ **Vraie grille de contributions** (cases vertes comme sur GitHub)
- ✅ **Stats authentiques** : commits, repos, stars, streaks
- ✅ **Données en temps réel** via API GraphQL GitHub
- ✅ **Sécurisé** : token GitHub côté serveur uniquement

## 🛠️ Architecture

### Backend (Node.js + Express)
- API REST qui consomme l'API GraphQL GitHub
- Gestion sécurisée du token GitHub
- CORS configuré pour le frontend
- Gestion d'erreurs et rate limiting

### Frontend (Nuxt.js + Vue 3)
- Interface responsive (mobile/tablette/desktop)
- Composable Vue pour les données GitHub
- Grille de contributions interactive
- Bento UI moderne

## 📡 API Endpoints

### `GET /api/github/:username`
Récupère toutes les données GitHub pour un utilisateur.

**Réponse :**
```json
{
  "username": "Achig4tsu",
  "totalCommits": 245,
  "totalRepos": 12,
  "totalStars": 15,
  "currentStreak": 3,
  "longestStreak": 23,
  "contributionGrid": [...],
  "weeklyActivity": [...],
  "monthlyActivity": [...]
}
```

### `GET /health`
Vérifie le statut du serveur et la configuration du token.

## 🔧 Développement

**Démarrer les deux serveurs en parallèle :**

Terminal 1 (Backend) :
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend) :
```bash
cd frontend && npm run dev
```

## 🐛 Dépannage

### Erreur "Serveur backend non disponible"
- Vérifiez que le backend est démarré (`npm run dev` dans le dossier backend)
- Vérifiez le port 3001

### Erreur "Token GitHub non configuré"
- Créez un token sur GitHub avec la permission `read:user`
- Ajoutez-le dans `backend/.env`

### Erreur "Rate limit exceeded"
- Attendez 1 heure ou utilisez un token avec une limite plus élevée
- Les comptes GitHub authentifiés ont 5000 requêtes/heure

## 📝 Notes Techniques

- Le token GitHub reste sécurisé côté serveur
- Les données sont mises en cache côté client
- La grille de contributions est générée selon les standards GitHub
- Support responsive complet (mobile, tablette, desktop)

## 🎨 Fonctionnalités du Portfolio

- **Responsive Design** : Adapté à tous les écrans
- **Globe 3D** : Masqué automatiquement sur mobile
- **Bento UI** : Grille moderne avec animations
- **Effets hover** : Animation du nom au survol
- **Grille GitHub** : Vraies contributions avec tooltip
- **Stats temps réel** : Commits, repos, stars, streaks

---

**Prêt à voir vos vraies contributions GitHub en action ! 🎉**
