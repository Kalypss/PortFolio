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

# Nettoyer les node_modules et réinstaller seulement la production
RUN rm -rf node_modules && npm ci --omit=dev --ignore-scripts

# Image de production
FROM node:20-alpine AS production

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers construits et les dépendances optimisées
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# Changer les permissions des fichiers
RUN chown -R nuxt:nodejs /app

USER nuxt

# Exposer le port 3000
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Démarrer l'application Nuxt en mode production
CMD ["node", ".output/server/index.mjs"]
