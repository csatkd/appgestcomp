# 🚀 Guide d'Accès à l'Application DOJANG

## 📍 Comment Accéder à l'Application

### 1. Démarrer l'Application

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible à : **http://localhost:5173**

---

## 🗺️ Structure des Routes

### Page d'Accueil
- **URL** : `http://localhost:5173/`
- **Description** : Page d'accueil avec présentation de l'application
- **Actions** :
  - Bouton "Voir la Démo" → Redirige vers `/demo`
  - Bouton "Accéder à l'Application" → Redirige vers `/app`

### Pages Sans Layout (Présentation)

#### 1. Landing Page
- **URL** : `http://localhost:5173/#/landing`
- **Description** : Page de présentation marketing
- **Contenu** : Hero, Features, Stats, Testimonials, CTA

#### 2. Demo Showcase ✨
- **URL** : `http://localhost:5173/#/demo`
- **Description** : Démonstration professionnelle avec animations
- **Contenu** :
  - Hero Section avec compteurs animés
  - Section des 4 disciplines (Kyorugi, Poomsae, Casse, Grades)
  - Section Innovations (Gamification, Analytics, etc.)
  - Section Excellence Technique
  - Section CTA

#### 3. Portail Parents
- **Login** : `http://localhost:5173/#/parents/login`
- **Dashboard** : `http://localhost:5173/#/parents/dashboard`
- **Description** : Espace dédié aux parents pour suivre leurs enfants

---

### Application Principale (Avec Layout)

#### Dashboard
- **URL** : `http://localhost:5173/#/app`
- **Description** : Tableau de bord principal avec drag & drop
- **Contenu** :
  - Statistiques globales
  - Combats à diriger
  - Progression des catégories
  - Podiums officiels

#### Modules Principaux

**Gestion**
- `/competitions` - Gestion des compétitions
- `/organizers` - Gestion des organisateurs
- `/clubs` - Gestion des clubs
- `/referees` - Gestion des arbitres

**Athlètes**
- `/athletes` - Liste et gestion des athlètes
- `/pesee` - Pesée officielle
- `/tirages` - Tirages au sort

**Compétitions**
- `/live` - Régie live (liste des combats)
- `/live/:matchId` - Combat spécifique
- `/resultats` - Résultats et podiums
- `/reclamations` - Gestion des réclamations

**Affichage**
- `/tv` - Mode TV (affichage grand écran)
- `/qr` - QR Présences
- `/calendar` - Calendrier des compétitions

**Rapports**
- `/reports` - Rapports et statistiques
- `/notifications` - Centre de notifications
- `/export` - Export & Import de données

**Sponsors**
- `/sponsors` - Gestion des sponsors
- `/sponsors/report` - Rapport sponsors
- `/ceremony-sponsors` - Affichage sponsors en cérémonie

**Workflow**
- `/workflow` - Cycle de vie de la compétition
- `/arenas` - Gestion des aires de combat
- `/schedule` - Planning des combats
- `/call` - Système d'appel des athlètes
- `/certificates` - Certificats de participation
- `/report` - Rapport de compétition

**Analytics**
- `/analytics` - Analytics avancés
- `/ranking` - Classement ELO des athlètes
- `/gamification` - Gamification (niveaux, XP, badges)
- `/profiles` - Profils sociaux des athlètes
- `/training` - Module de formation

**Disciplines Spécifiques**
- `/poomsae` - Gestion des compétitions Poomsae
- `/casse` - Gestion des compétitions de Casse
- `/grades` - Gestion des passages de grades

**Gestion Efficace**
- `/management` - Dashboard centralisé (Kyorugi + Poomsae + Casse)

**Administration**
- `/admin` - Panneau d'administration

---

## 🎯 Accès Rapide

### Depuis la Page d'Accueil (`/`)

1. **Voir la Démo** :
   - Cliquez sur "Voir la Démo"
   - Ou accédez directement à : `http://localhost:5173/#/demo`

2. **Accéder à l'Application** :
   - Cliquez sur "Accéder à l'Application"
   - Ou accédez directement à : `http://localhost:5173/#/app`

### Raccourcis Clavier (dans l'application)

- `Ctrl+K` : Recherche globale
- `Ctrl+D` : Dashboard
- `Ctrl+A` : Athlètes
- `Ctrl+L` : Live Scoring
- `Ctrl+R` : Résultats
- `Ctrl+C` : Calendrier
- `Ctrl+S` : Sponsors
- `Ctrl+N` : Notifications
- `Ctrl+?` : Afficher l'aide

---

## 📱 Navigation dans l'Application

### Barre Latérale (Sidebar)

La barre latérale contient tous les modules accessibles :

1. **Tableau de bord** (`/app`)
2. **Compétitions** (`/competitions`)
3. **Organisateurs** (`/organizers`)
4. **Clubs** (`/clubs`)
5. **Arbitres** (`/referees`)
6. **Athlètes** (`/athletes`)
7. **Pesée** (`/pesee`)
8. **Tirages au sort** (`/tirages`)
9. **Live Scoring** (`/live`)
10. **Résultats** (`/resultats`)
11. **Réclamations** (`/reclamations`)
12. **Mode TV** (`/tv`)
13. **QR Présences** (`/qr`)
14. **Calendrier** (`/calendar`)
15. **Rapports** (`/reports`)
16. **Notifications** (`/notifications`)
17. **Export & Import** (`/export`)
18. **Sponsors & Partenaires** (`/sponsors`)
19. **Rapport Sponsors** (`/sponsors/report`)
20. **Cycle de Vie** (`/workflow`)
21. **Aires de Combat** (`/arenas`)
22. **Planning Combats** (`/schedule`)
23. **Appel Athlètes** (`/call`)
24. **Certificats** (`/certificates`)
25. **Rapport Compétition** (`/report`)
26. **Analytics Avancés** (`/analytics`)
27. **Classement ELO** (`/ranking`)
28. **Gamification** (`/gamification`)
29. **Profils Sociaux** (`/profiles`)
30. **Formation** (`/training`)
31. **Poomsae** (`/poomsae`)
32. **Casse (Breaking)** (`/casse`)
33. **Passages de Grades** (`/grades`)
34. **Gestion Efficace** (`/management`)
35. **Administration** (`/admin`)

---

## 🔍 Recherche Globale

### Utilisation

1. Appuyez sur `Ctrl+K` ou cliquez sur le bouton "Rechercher"
2. Tapez le nom d'un athlète, club, sponsor ou arbitre
3. Utilisez `↑↓` pour naviguer dans les résultats
4. Appuyez sur `Enter` pour sélectionner
5. Appuyez sur `Esc` pour fermer

### Fonctionnalités

- Recherche dans toutes les entités (athlètes, clubs, sponsors, arbitres)
- Résultats en temps réel
- Navigation au clavier
- Accès rapide aux pages

---

## 🎨 Thèmes

### Changer de Thème

1. Cliquez sur l'icône de thème dans la barre supérieure
2. Choisissez entre :
   - ☀️ **Clair** : Fond blanc, texte sombre
   - 🌙 **Sombre** : Fond sombre, texte clair (par défaut)
   - 🖥️ **Système** : Suit les préférences du système

### Persistance

Le thème choisi est sauvegardé automatiquement et restauré à la prochaine visite.

---

## ⭐ Favoris

### Ajouter un Favori

1. Naviguez vers n'importe quelle page
2. Cliquez sur le bouton étoile (⭐) dans l'en-tête
3. La page est ajoutée à vos favoris

### Accéder aux Favoris

Les favoris apparaissent dans la barre latérale sous la section "Favoris".

### Supprimer un Favori

Survolez un favori dans la barre latérale et cliquez sur le bouton ✕.

---

## 📊 Statistiques de l'Application

### Build
- **127 modules** transformés
- **670 KB** JavaScript (167 KB gzippé)
- **84 KB** CSS (14 KB gzippé)
- **Build réussi** en 5.48s
- **0 erreurs**

### Fonctionnalités
- **35+ modules** opérationnels
- **4 disciplines** complètes (Kyorugi, Poomsae, Casse, Grades)
- **500+ fonctionnalités**
- **100% sécurité**

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

Si le port 5173 est déjà utilisé :

```bash
# Utiliser un autre port
npm run dev -- --port 3000
```

### Problèmes de route

Si les routes ne fonctionnent pas :

1. Vérifiez que vous utilisez le HashRouter (URLs avec `#`)
2. Accédez à : `http://localhost:5173/#/`
3. Ou `http://localhost:5173/#/demo`
4. Ou `http://localhost:5173/#/app`

### Données perdues

Les données sont stockées dans le localStorage du navigateur :

```javascript
// Voir les données
localStorage.getItem('dojang:v5')

// Réinitialiser les données
localStorage.clear()
```

---

## 📞 Support

### Documentation

- **README.md** - Vue d'ensemble
- **GUIDE_ACCES.md** - Ce document
- **APERCU_VISUEL.md** - Aperçu visuel
- **REVUE_COMPLETE.md** - Détails techniques

### Contact

- **Email** : support@dojang.ci
- **Documentation** : https://docs.dojang.ci
- **Forum** : https://forum.dojang.ci

---

## 🎉 Accès Rapide

### URLs Principales

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `http://localhost:5173/` | Page d'accueil |
| Démo | `http://localhost:5173/#/demo` | Démonstration |
| Application | `http://localhost:5173/#/app` | Dashboard principal |
| Landing | `http://localhost:5173/#/landing` | Page marketing |
| Parents | `http://localhost:5173/#/parents/login` | Portail parents |

### Modules Principaux

| Module | URL | Description |
|--------|-----|-------------|
| Athlètes | `http://localhost:5173/#/athletes` | Gestion des athlètes |
| Live | `http://localhost:5173/#/live` | Scoring en direct |
| Poomsae | `http://localhost:5173/#/poomsae` | Compétitions de formes |
| Casse | `http://localhost:5173/#/casse` | Compétitions de casse |
| Grades | `http://localhost:5173/#/grades` | Passages de grades |
| Management | `http://localhost:5173/#/management` | Gestion centralisée |

---

**Version** : 5.1  
**Statut** : ✅ Production-ready  
**Dernière mise à jour** : 2026  

---

🥋 **DOJANG - La Plateforme Complète du Taekwondo** 🥋

**Bonne utilisation !** 🚀
