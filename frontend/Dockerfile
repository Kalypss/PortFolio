# Multi-stage build pour optimiser la taille de l'image
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json
COPY package.json ./

# Générer package-lock.json et installer toutes les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Image de production
FROM node:20-alpine AS production

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et le package-lock.json généré
COPY --from=builder /app/package*.json ./

# Installer seulement les dépendances de production
RUN npm ci --omit=dev && npm cache clean --force

# Copier les fichiers construits depuis l'étape builder
COPY --from=builder /app/.output ./.output

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001
USER nuxt

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Démarrer l'application Nuxt en mode production
CMD ["node", ".output/server/index.mjs"]
