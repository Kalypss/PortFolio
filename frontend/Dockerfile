# Image Node.js pour l'application Nuxt en production
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Démarrer l'application Nuxt
CMD ["npm", "run", "preview"]
