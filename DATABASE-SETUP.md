# 🗄️ Configuration Base de Données - Hackathon

## 📋 Données Nécessaires

### 1. **Hackathon Actif**
```sql
-- Créer un hackathon
INSERT INTO hackathon (id, nom, description, dateDebut, dateFin, dateLimiteInscription, status, registrationGoal, currentRegistrations)
VALUES (
  'b2c3d4e5-f6a7-4890-b123-456789012345',
  'Hackathon Développement Web 2026',
  'Innover. Créer. Collaborer. Un week-end. Des possibilités infinies.',
  '2026-01-12T06:00:00.000Z',  -- Date de début
  '2026-01-20T14:00:00.000Z',  -- Date de fin
  '2026-01-15T22:59:00.000Z',  -- Limite inscriptions
  'ONGOING',                   -- Status
  300,                         -- Objectif inscriptions
  0                            -- Compteur actuel
);
```

### 2. **Administrateur**
```sql
-- Créer un compte admin (mot de passe à hasher)
INSERT INTO user (id, email, nom, prenom, role, createdAt, updatedAt)
VALUES (
  'admin-uuid-here',
  'admin@hackathon.com',
  'Admin',
  'CFI-CIRAS',
  'ADMIN',
  NOW(),
  NOW()
);
```

### 3. **Paramètres de l'Événement**
Ces paramètres sont stockés dans le localStorage du navigateur, mais peuvent être initialisés :

```javascript
// Dans le navigateur (Console développeur)
localStorage.setItem('eventSettings', JSON.stringify({
  eventName: 'Hackathon CFI-CIRAS',
  eventDate: '2026-01-12T06:00',
  registrationsOpen: true,
  registrationGoal: 300,
  currentRegistrations: 0,
  countdownEnabled: true,
  prizes: {
    first: '150 000 FCFA',
    second: '100 000 FCFA',
    third: '50 000 FCFA'
  }
}));
```

## 🚀 Démarrage Rapide

### Option 1: Base de Données Vide
Si vous voulez commencer avec une base vide :
1. Déployer le backend
2. Créer manuellement l'admin via l'API
3. Créer le hackathon via l'interface admin

### Option 2: Base de Données Pré-remplie
Pour avoir des données de démonstration :
1. Exécuter les scripts SQL ci-dessus
2. Ajuster les UUID selon votre schéma
3. Vérifier les relations foreign key

## 🔧 Variables d'Environnement Backend

```bash
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/hackathon_db"

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="24h"

# Serveur
PORT=3001
NODE_ENV=production

# CORS
FRONTEND_URL="https://hackathon-frontend.onrender.com"
```

## 📊 Tables Principales

### **hackathon**
- `id` (UUID, Primary Key)
- `nom` (VARCHAR)
- `description` (TEXT)
- `dateDebut` (TIMESTAMP)
- `dateFin` (TIMESTAMP)
- `dateLimiteInscription` (TIMESTAMP)
- `status` (ENUM: 'UPCOMING', 'ONGOING', 'PAST')
- `registrationGoal` (INTEGER)
- `currentRegistrations` (INTEGER)

### **user**
- `id` (UUID, Primary Key)
- `email` (VARCHAR, UNIQUE)
- `nom` (VARCHAR)
- `prenom` (VARCHAR)
- `role` (ENUM: 'USER', 'ADMIN')
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### **inscription**
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → user.id)
- `hackathonId` (UUID, Foreign Key → hackathon.id)
- `statut` (ENUM: 'EN_ATTENTE', 'VALIDE', 'REFUSE')
- `promo` (VARCHAR)
- `createdAt` (TIMESTAMP)

### **resultats**
- `id` (UUID, Primary Key)
- `hackathonId` (UUID, Foreign Key → hackathon.id)
- `premierPlace` (VARCHAR)
- `deuxiemePlace` (VARCHAR)
- `troisiemePlace` (VARCHAR)
- `podiumPublie` (BOOLEAN)
- `preselectionnes` (JSON)
- `preselectionsPubliees` (BOOLEAN)

## 🎯 Données de Test

### Utilisateurs de test :
```sql
-- Quelques utilisateurs de test
INSERT INTO user (email, nom, prenom, role) VALUES
('test1@example.com', 'Dupont', 'Jean', 'USER'),
('test2@example.com', 'Martin', 'Marie', 'USER'),
('test3@example.com', 'Dubois', 'Pierre', 'USER');
```

### Inscriptions de test :
```sql
-- Inscriptions pour le hackathon
INSERT INTO inscription (userId, hackathonId, statut, promo) VALUES
('user-id-1', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'VALIDE', 'LIC2'),
('user-id-2', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'VALIDE', 'LIC1'),
('user-id-3', 'b2c3d4e5-f6a7-4890-b123-456789012345', 'EN_ATTENTE', 'LIC3');
```

## 🔍 Vérifications Post-Déploiement

Après déploiement, vérifier :
- ✅ Connexion admin fonctionne (`/login`)
- ✅ Hackathon s'affiche correctement
- ✅ Countdown fonctionne
- ✅ API répond correctement
- ✅ Base de données accessible

## 🆘 Dépannage

### Problème : "Hackathon not found"
**Solution** : Créer un hackathon via l'API ou l'interface admin

### Problème : "No admin user"
**Solution** : Créer un utilisateur avec role='ADMIN'

### Problème : "CORS error"
**Solution** : Vérifier `FRONTEND_URL` dans les variables d'environnement

---

**Base de données configurée = Application fonctionnelle ! 🎯**
