# 🚀 Comment Accéder à l'Application DOJANG

## ⚡ Démarrage Rapide

### 1. Lancer l'Application

```bash
# Installer les dépendances (première fois uniquement)
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible à : **http://localhost:5173**

---

## 🗺️ Routes Disponibles

### Page d'Accueil
- **URL** : `http://localhost:5173/`
- **Action** : Redirige automatiquement vers la démo

### Pages de Présentation (Sans Layout)

#### 1. Démo Showcase
- **URL** : `http://localhost:5173/#/demo`
- **Description** : Présentation professionnelle avec animations
- **Contenu** :
  - Hero section animée
  - 4 disciplines (Kyorugi, Poomsae, Casse, Grades)
  - Innovations majeures
  - Excellence technique

#### 2. Landing Page
- **URL** : `http://localhost:5173/#/landing`
- **Description** : Page de présentation marketing
- **Contenu** : Features, stats, testimonials, CTA

#### 3. Portail Parents
- **Login** : `http://localhost:5173/#/parents/login`
- **Dashboard** : `http://localhost:5173/#/parents/dashboard`

### Application Principale (Avec Layout)

#### Dashboard
- **URL** : `http://localhost:5173/#/app`
- **Description** : Tableau de bord principal

#### Modules Principaux

**Gestion**
- `/competitions` - Compétitions
- `/organizers` - Organisateurs
- `/clubs` - Clubs
- `/referees` - Arbitres

**Athlètes**
- `/athletes` - Athlètes
- `/pesee` - Pesée
- `/tirages` - Tirages

**Compétitions**
- `/live` - Live Scoring
- `/resultats` - Résultats
- `/reclamations` - Réclamations

**Affichage**
- `/tv` - Mode TV
- `/qr` - QR Présences
- `/calendar` - Calendrier

**Rapports**
- `/reports` - Rapports
- `/notifications` - Notifications
- `/export` - Export/Import

**Sponsors**
- `/sponsors` - Sponsors
- `/sponsors/report` - Rapport Sponsors
- `/ceremony-sponsors` - Cérémonie Sponsors

**Workflow**
- `/workflow` - Cycle de Vie
- `/arenas` - Aires de Combat
- `/schedule` - Planning
- `/call` - Appel Athlètes
- `/certificates` - Certificats
- `/report` - Rapport Compétition

**Analytics**
- `/analytics` - Analytics Avancés
- `/ranking` - Classement ELO
- `/gamification` - Gamification
- `/profiles` - Profils Sociaux
- `/training` - Formation

**Disciplines**
- `/poomsae` - Poomsae
- `/casse` - Casse
- `/grades` - Passages de Grades

**Gestion**
- `/management` - Gestion Efficace
- `/admin` - Administration

---

## 🎯 Accès Rapide

### Depuis la Page d'Accueil

1. **Accéder automatiquement à la démo** :
   - Ouvrez `http://localhost:5173/`
   - Vous serez redirigé vers `http://localhost:5173/#/demo`

2. **Accéder directement à l'application** :
   - Ouvrez `http://localhost:5173/#/app`

3. **Accéder à un module spécifique** :
   - Exemple : `http://localhost:5173/#/athletes`
   - Exemple : `http://localhost:5173/#/live`
   - Exemple : `http://localhost:5173/#/poomsae`

---

## 🔍 Navigation dans l'Application

### Barre Latérale
Une fois dans l'application (`/app` ou tout autre module), vous verrez une barre latérale avec tous les modules accessibles.

### Raccourcis Clavier
- `Ctrl+K` : Recherche globale
- `Ctrl+D` : Dashboard
- `Ctrl+A` : Athlètes
- `Ctrl+L` : Live Scoring
- `Ctrl+R` : Résultats

---

## 📱 Exemples d'URLs

### Pages de Présentation
```
http://localhost:5173/#/demo
http://localhost:5173/#/landing
http://localhost:5173/#/parents/login
```

### Application
```
http://localhost:5173/#/app
http://localhost:5173/#/athletes
http://localhost:5173/#/live
http://localhost:5173/#/poomsae
http://localhost:5173/#/casse
http://localhost:5173/#/grades
http://localhost:5173/#/sponsors
http://localhost:5173/#/management
```

---

## 🆘 Dépannage

### L'application ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install

# Vider le cache
npm cache clean --force

# Redémarrer
npm run dev
```

### Erreur de port
```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### Les routes ne fonctionnent pas
- Vérifiez que vous utilisez le HashRouter (URLs avec `#`)
- Exemple correct : `http://localhost:5173/#/demo`
- Exemple incorrect : `http://localhost:5173/demo`

---

## 📊 Statistiques de l'Application

- **127 modules** transformés
- **671 KB** JavaScript (167 KB gzippé)
- **84 KB** CSS (14 KB gzippé)
- **Build réussi** en 5.54s
- **0 erreurs**

---

## 🎉 Prêt à Commencer !

1. Lancez `npm run dev`
2. Ouvrez `http://localhost:5173/`
3. Vous serez redirigé vers la démo
4. Cliquez sur "Accéder à l'Application" pour explorer tous les modules

**Bonne utilisation !** 🥋

---

**Version** : 5.1  
**Statut** : ✅ Production-ready  
**Date** : 2026
