# DOJANG - Régie de Compétition Taekwondo FITKD Côte d'Ivoire

Application web professionnelle de gestion de compétitions de taekwondo, développée pour la Fédération Ivoirienne de Taekwondo (FITKD).

## 🏆 Fonctionnalités Multi-Compétitions

### Gestion des Compétitions
L'application permet désormais de gérer **plusieurs compétitions simultanément** avec différents types :

- **Locales** : Compétitions de club ou inter-clubs
- **Nationales** : Championnats nationaux, coupes nationales
- **Internationales** : Opens internationaux, championnats régionaux

#### Caractéristiques
- Création illimitée de compétitions
- Attribution à différents organisateurs
- Statuts personnalisés (brouillon, active, terminée, archivée)
- Gestion des dates et lieux
- Configuration du nombre d'aires de combat
- Basculement entre compétitions actives

### Gestion des Organisateurs
Système complet de gestion des entités organisatrices :

- Fédérations nationales
- Ligues régionales
- Clubs
- Organismes privés

#### Informations gérées
- Nom de l'organisation
- Email de contact
- Téléphone
- Association avec les compétitions

## 👨‍👩‍👧 Portail Parents

### Accès Sécurisé
Les parents peuvent suivre la progression de leur enfant grâce à un portail dédié :
- **URL** : `#/parents/login`
- **Authentification** : Numéro de licence de l'athlète (sert de login ET mot de passe)
- **Session** : Stockée dans localStorage pour une navigation fluide

### Fonctionnalités du Portail
- **Profil complet** : Informations personnelles, catégorie, club, statut
- **Statistiques** : Victoires, défaites, total des matchs
- **Historique** : Liste détaillée de tous les matchs avec scores et adversaires
- **Déconnexion** : Bouton de déconnexion sécurisé

### Documentation
Voir [PARENTS_PORTAL.md](./PARENTS_PORTAL.md) pour plus de détails.

## 📋 Modules Disponibles

### 1. **Tableau de bord** (`/`)
Vue d'ensemble de la compétition active avec KPIs en temps réel.

### 2. **Compétitions** (`/competitions`)
Gestion multi-événements :
- Créer/modifier/supprimer des compétitions
- Définir le type (locale/nationale/internationale)
- Gérer les statuts
- Basculer entre compétitions

### 3. **Organisateurs** (`/organizers`)
Gestion des entités organisatrices :
- Ajouter des fédérations, ligues, clubs
- Informations de contact complètes
- Protection contre la suppression si compétitions associées

### 4. **Clubs** (`/clubs`) ✨ NOUVEAU
Gestion des clubs affiliés :
- CRUD complet des clubs
- Informations détaillées (président, ville, région, contact)
- Suivi du nombre d'athlètes par club
- Protection contre suppression si athlètes associés
- Vue en grille avec statistiques

### 5. **Arbitres** (`/referees`) ✨ NOUVEAU
Gestion du corps arbitral :
- CRUD complet des arbitres
- Grades officiels (International, Continental, National, Régional)
- Gestion des statuts (actif, inactif, suspendu)
- Suivi des matchs arbitrés
- Vue en tableau avec filtrage

### 6. **Athlètes** (`/athletes`)
Base de données des compétiteurs avec :
- Inscription et validation
- Recherche et filtrage
- Gestion des licences FITKD

### 7. **Pesée** (`/pesee`)
Contrôle officiel des poids :
- Saisie avec validation
- Assignation automatique aux catégories WT
- Gestion des forfaits

### 8. **Tirages au sort** (`/tirages`)
Génération de tableaux à élimination directe :
- Seeding équilibré
- Gestion automatique des exempts (byes)
- Visualisation par tours

### 9. **Live Scoring** (`/live`)
Régie de combat en temps réel :
- Chronomètre WT (3 rounds × 2 min)
- Scoring complet (poing, corps, tête, rotatifs)
- Gestion des Gam-jeom
- Point en or
- Persistance des combats en cours

### 10. **Résultats** (`/resultats`)
Podiums et classements :
- Affichage des médaillés
- Classement des clubs
- Statistiques par catégorie

### 11. **Réclamations** (`/reclamations`)
Gestion des contestations :
- Workflow complet (soumise → examen → acceptée/rejetée)
- Historique détaillé
- Statistiques en temps réel

### 12. **Mode TV** (`/tv`)
Affichage grand écran :
- Podiums par catégorie
- Classement général des clubs
- Statistiques de la compétition

### 13. **QR Présences** (`/qr`)
Validation des présences :
- Simulation de scan QR
- Présences et pesées
- Statistiques de participation

### 14. **Calendrier** (`/calendar`) ✨ NOUVEAU
Vue calendrier des compétitions :
- Vue mensuelle interactive avec navigation
- Affichage des compétitions par jour
- Indicateurs visuels (point rouge pour jours avec événements)
- Modal de détails pour chaque compétition
- Liste des compétitions du mois
- Jour actuel mis en évidence

### 15. **Rapports** (`/reports`) ✨ NOUVEAU
Statistiques avancées et exports :
- Statistiques globales (athlètes, matchs, clubs, compétitions)
- 4 types de rapports : Athlètes, Clubs, Matchs, Catégories
- Tableaux détaillés avec toutes les données
- Export CSV pour chaque type de rapport
- Barres de progression pour visualiser l'avancement
- Tri et filtrage des données

### 16. **Notifications** (`/notifications`) ✨ NOUVEAU
Centre de messages et alertes :
- Création de notifications (info, succès, avertissement, erreur)
- Gestion des notifications (lire, supprimer)
- Statistiques (total, non lues, lues, aujourd'hui)
- Persistance dans localStorage
- Icônes et couleurs thématiques
- Badge "Nouveau" pour notifications non lues

### 17. **Export & Import** (`/export`) ✨ NOUVEAU
Gestion des données avec export/import CSV :
- Export des athlètes, clubs et résultats au format CSV
- Import d'athlètes depuis fichier CSV
- Validation des données importées
- Statistiques des données (athlètes, clubs, arbitres, compétitions)
- Compatible Excel, Google Sheets
- Gestion des erreurs et doublons

### 18. **Sponsors & Partenaires** (`/sponsors`) ✨ NOUVEAU
Gestion complète des sponsors et partenaires :
- CRUD complet des sponsors (créer, lire, modifier, supprimer)
- Classification par type (Principal, Officiel, Partenaire, Média, Technique)
- Niveaux de sponsoring (Or, Argent, Bronze) avec code couleur
- Statuts (Actif, En attente, Expiré)
- Gestion des logos avec affichage visuel
- Statistiques en temps réel (total, actifs, financement total)
- Système de filtrage avancé (type, niveau, statut)
- Affichage en grille responsive avec cartes colorées
- Modals de création/édition et visualisation détaillée
- 3 sponsors de démonstration pré-configurés
- Documentation complète dans [SPONSORS_MODULE.md](./SPONSORS_MODULE.md)

### 19. **Administration** (`/admin`)
Configuration globale :
- Paramètres de l'événement
- Gestion des catégories
- Export/import JSON
- Journal d'activité

## 🎨 Design System

### Identité visuelle africaine
- **Palette kente** : or (#f0a41c), rouge flamme (#e2472e), vert forêt (#23a06a)
- **Typographie** : Anton (display), Space Grotesk (texte), IBM Plex Mono (données)
- **Motifs** : Bandes kente, textures bogolan

### Composants réutilisables
- Boutons (primary, ghost, danger)
- Modales
- Toasts de notification
- Badges de statut
- Barres de progression

## 🏗️ Architecture Technique

### Structure des données
```typescript
AppState {
  version: number
  competitions: Competition[]      // Liste des compétitions
  organizers: Organizer[]          // Liste des organisateurs
  clubs: Club[]                    // Liste des clubs affiliés ✨ NOUVEAU
  referees: Referee[]              // Liste des arbitres ✨ NOUVEAU
  currentCompetitionId: string     // Compétition active
  event: EventConfig               // Config de la compétition active
  athletes: Athlete[]
  brackets: Record<string, Match[]>
  catStatus: Record<string, CategoryStatus>
  results: Record<string, Podium>
  claims: Claim[]
  qrScans: QrScan[]
  notifications: Notification[]        // Notifications ✨ NOUVEAU
  // ... autres propriétés
}
```

### Actions du reducer
- `ADD_COMPETITION` / `UPDATE_COMPETITION` / `DELETE_COMPETITION`
- `SET_CURRENT_COMPETITION`
- `ADD_ORGANIZER` / `UPDATE_ORGANIZER` / `DELETE_ORGANIZER`
- `ADD_CLUB` / `UPDATE_CLUB` / `DELETE_CLUB` ✨ NOUVEAU
- `ADD_REFEREE` / `UPDATE_REFEREE` / `DELETE_REFEREE` ✨ NOUVEAU
- `ADD_NOTIFICATION` / `UPDATE_NOTIFICATION` / `DELETE_NOTIFICATION` ✨ NOUVEAU
- Toutes les actions existantes (athlètes, pesée, tirages, etc.)

### Persistance
- Stockage local (localStorage)
- Export/import JSON
- Versioning du schéma (v5)

## 🌐 Landing Page

Une landing page dynamique et évolutive est disponible pour présenter l'application :

- **Accès** : `#/landing`
- **Architecture** : Modulaire (Hero, Features, Stats, Testimonials, CTA, Footer)
- **Animations** : Scroll reveal, compteurs animés
- **Documentation** : Voir [LANDING.md](./LANDING.md) pour personnaliser et étendre

## 🎨 Images d'Arrière-Plan

Chaque page de l'application dispose d'une image d'arrière-plan unique générée par IA :

- **10 images thématiques** : Pattern kente, athlètes, trophées, combats, etc.
- **Esthétique africaine** : Palette kente (or, rouge, vert) cohérente
- **Composant réutilisable** : `PageBackground` avec opacité et flou configurables
- **Documentation** : Voir [BACKGROUNDS.md](./BACKGROUNDS.md) pour personnaliser les images

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build production
npm run build

# Vérification des types
npm run typecheck
```

### Accès rapide
- **Landing page** : `http://localhost:5173/#/landing`
- **Application** : `http://localhost:5173/#/`

## 📊 Données de démonstration

L'application inclut des données de démonstration préconfigurées :

- **1 compétition** : Championnat National FITKD 2026
- **1 organisateur** : Fédération Ivoirienne de Taekwondo
- **8 clubs** ivoiriens affiliés ✨ NOUVEAU
- **6 arbitres** certifiés ✨ NOUVEAU
- **27 athlètes** de 8 clubs ivoiriens
- **1 tirage généré** en Hommes −68 kg

## 🔒 Sécurité et Validation

- Validation des formulaires en temps réel
- Protection contre les suppressions accidentelles
- Vérification des intégrités référentielles
- Messages d'erreur contextuels

## 🌍 Adaptation Côte d'Ivoire

- Clubs ivoiriens (Taekwondo Club d'Abidjan, INJS Abidjan, etc.) ✨ NOUVEAU
- Arbitres ivoiriens certifiés (International, Continental, National, Régional) ✨ NOUVEAU
- Athlètes avec noms ivoiriens authentiques
- Licences FITKD-26-XXXX
- Lieu : Palais des Sports — Treichville, Abidjan

## 📝 Licence

Développé pour la Fédération Ivoirienne de Taekwondo (FITKD)

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités :
1. Créer une nouvelle page dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Ajouter le lien dans `src/components/Layout.tsx`
4. Étendre le modèle de données si nécessaire dans `src/lib/types.ts`
5. Ajouter les actions dans `src/lib/store.tsx`

## 📞 Support

Pour toute question ou support technique, contactez la FITKD.

---

**DOJANG** - La régie numérique des tatamis 🥋
