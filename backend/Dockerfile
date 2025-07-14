# Utiliser l'image Node.js officielle
FROM node:18-alpine

# Installer wget pour les healthchecks
RUN apk add --no-cache wget

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du code source
COPY . .

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Changer la propriété des fichiers
RUN chown -R backend:nodejs /app

# Changer vers l'utilisateur non-root
USER backend

# Exposer le port
EXPOSE 3001

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3001
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Commande de démarrage
CMD ["npm", "start"]
