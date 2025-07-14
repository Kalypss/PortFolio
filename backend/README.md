# Portfolio Backend

Backend API pour récupérer les vraies données de contributions GitHub via l'API GraphQL.

## Configuration

### 1. Créer un Personal Access Token GitHub

1. Allez sur [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Cliquez sur "Generate new token" > "Generate new token (classic)"
3. Donnez un nom à votre token (ex: "Portfolio API")
4. Sélectionnez la permission : `read:user` (cochez cette case)
5. Cliquez sur "Generate token"
6. **IMPORTANT** : Copiez le token immédiatement (vous ne pourrez plus le voir après)

### 2. Configurer le token

1. Ouvrez le fichier `.env` dans le dossier backend
2. Remplacez `your_github_token_here` par votre token GitHub :
   ```
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```

### 3. Démarrer le serveur

```bash
cd backend
npm install
npm run dev
```

Le serveur sera disponible sur `http://localhost:3001`

## API Endpoints

### GET `/api/github/:username`

Récupère les données de contribution pour un utilisateur GitHub.

**Exemple :**
```
GET http://localhost:3001/api/github/Achig4tsu
```

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

### GET `/health`

Vérifie le statut du serveur.

## Sécurité

- Le token GitHub est stocké côté serveur et n'est jamais exposé au client
- Les requêtes sont limitées par les limites de l'API GitHub (5000 requêtes/heure avec token)
- CORS configuré pour autoriser les requêtes du frontend
