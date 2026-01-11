# Déploiement sur Render

## Configuration Frontend

### Variables d'environnement à configurer sur Render :

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://votre-backend-url.onrender.com
NEXT_PUBLIC_APP_URL=https://votre-frontend-url.onrender.com
```

### Étapes de déploiement :

1. **Connecter le repository GitHub** à Render
2. **Créer un nouveau service Web**
3. **Configuration du service :**
   - **Runtime :** Node
   - **Build Command :** `npm install && npm run build`
   - **Start Command :** `npm start`
   - **Root Directory :** `./` (racine du projet)
4. **Ajouter les variables d'environnement** listées ci-dessus
5. **Déployer**

## Configuration Backend

Le backend NestJS doit être déployé séparément sur Render avec :

- **Runtime :** Node
- **Build Command :** `npm install`
- **Start Command :** `npm run start:prod`
- **Variables d'environnement :** Base de données, JWT, etc.

## URLs importantes

- **Frontend :** `https://hackathon-frontend.onrender.com`
- **Backend :** `https://hackathon-backend.onrender.com`
- **Admin :** `https://hackathon-frontend.onrender.com/login`

## Points d'attention

- ✅ **Liens admin supprimés** du frontend public
- ✅ **Page de connexion** accessible via `/login`
- ✅ **Logs nettoyés** pour la production
- ✅ **Build optimisé** pour la production
