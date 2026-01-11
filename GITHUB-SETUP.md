# 🚀 Configuration GitHub pour Hackathon

## 📋 Prérequis

- ✅ Compte GitHub créé
- ✅ Repository Git initialisé (fait)
- ✅ Code committé (fait)

## 🛠️ Étapes pour pousser sur GitHub

### 1. Créer un repository sur GitHub

1. Aller sur [GitHub.com](https://github.com)
2. Cliquer sur **"New repository"** (bouton vert)
3. Remplir :
   - **Repository name** : `hackathon-frontend` ou `hackathon-cfi-ciras`
   - **Description** : `Application frontend Next.js pour gestion de hackathon CFI-CIRAS`
   - **Visibility** : `Public` ou `Private` (selon vos préférences)
4. **NE PAS** cocher "Add a README file" (on en a déjà un)
5. **NE PAS** cocher "Add .gitignore" (on en a déjà un)
6. Cliquer sur **"Create repository"**

### 2. Connecter le repository local à GitHub

Après avoir créé le repository, GitHub vous montre ces commandes :

```bash
# Copier-coller ces commandes dans votre terminal
git remote add origin https://github.com/VOTRE_USERNAME/hackathon-frontend.git
git branch -M main
git push -u origin main
```

**Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub !**

### 3. Vérifications

Après le push, vérifiez sur GitHub que :
- ✅ Tous les fichiers sont présents
- ✅ Le README s'affiche
- ✅ Pas de fichiers sensibles (.env, etc.)

## 🔐 Sécurité

### Fichiers sensibles NON poussés :
- ✅ `.env*` files
- ✅ `node_modules/`
- ✅ `.next/` (build)
- ✅ Logs de développement

### Variables d'environnement à configurer sur Render :
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://votre-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://votre-frontend.onrender.com
```

## 🚀 Déploiement sur Render

### 1. Backend d'abord
1. Créer un service Web sur Render pour le backend NestJS
2. Récupérer l'URL : `https://hackathon-backend.onrender.com`

### 2. Frontend ensuite
1. Créer un service Web sur Render
2. Sélectionner **"Connect GitHub repo"**
3. Choisir votre repository `hackathon-frontend`
4. Configuration :
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm start`
5. Variables d'environnement :
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_API_URL` = URL du backend
   - `NEXT_PUBLIC_APP_URL` = URL du frontend (Render la fournira)

## 🎯 Points importants

- 🔒 **Admin accessible via** : `https://votredomaine.onrender.com/login`
- 📱 **Site public** : `https://votredomaine.onrender.com`
- ⚡ **Build automatique** : Render rebuild à chaque push
- 🔄 **Mises à jour** : `git add . && git commit -m "message" && git push`

## 🆘 Dépannage

### Si push échoue :
```bash
# Vérifier le remote
git remote -v

# Si besoin, changer l'URL
git remote set-url origin https://github.com/USERNAME/REPO.git

# Repousser
git push -u origin main
```

### Si fichiers sensibles poussés par erreur :
```bash
# Supprimer de Git (mais garder localement)
git rm --cached fichier-sensible
git commit -m "Remove sensitive file"
```

---

**Votre projet est maintenant prêt à être poussé sur GitHub ! 🎉**
