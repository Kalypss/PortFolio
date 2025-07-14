# Utiliser l'image Node.js pour construire l'application
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Construire l'application pour la production (static generation)
RUN npm run generate

# Image de production avec Nginx
FROM nginx:alpine AS production

# Copier les fichiers générés statiquement depuis l'étape builder
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
