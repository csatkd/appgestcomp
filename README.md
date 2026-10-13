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

### 4. **Athlètes** (`/athletes`)
Base de données des compétiteurs avec :
- Inscription et validation
- Recherche et filtrage
- Gestion des licences FITKD

### 5. **Pesée** (`/pesee`)
Contrôle officiel des poids :
- Saisie avec validation
- Assignation automatique aux catégories WT
- Gestion des forfaits

### 6. **Tirages au sort** (`/tirages`)
Génération de tableaux à élimination directe :
- Seeding équilibré
- Gestion automatique des exempts (byes)
- Visualisation par tours

### 7. **Live Scoring** (`/live`)
Régie de combat en temps réel :
- Chronomètre WT (3 rounds × 2 min)
- Scoring complet (poing, corps, tête, rotatifs)
- Gestion des Gam-jeom
- Point en or
- Persistance des combats en cours

### 8. **Résultats** (`/resultats`)
Podiums et classements :
- Affichage des médaillés
- Classement des clubs
- Statistiques par catégorie

### 9. **Réclamations** (`/reclamations`)
Gestion des contestations :
- Workflow complet (soumise → examen → acceptée/rejetée)
- Historique détaillé
- Statistiques en temps réel

### 10. **Mode TV** (`/tv`)
Affichage grand écran :
- Podiums par catégorie
- Classement général des clubs
- Statistiques de la compétition

### 11. **QR Présences** (`/qr`)
Validation des présences :
- Simulation de scan QR
- Présences et pesées
- Statistiques de participation

### 12. **Administration** (`/admin`)
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
  currentCompetitionId: string     // Compétition active
  event: EventConfig               // Config de la compétition active
  athletes: Athlete[]
  brackets: Record<string, Match[]>
  catStatus: Record<string, CategoryStatus>
  results: Record<string, Podium>
  claims: Claim[]
  qrScans: QrScan[]
  // ... autres propriétés
}
```

### Actions du reducer
- `ADD_COMPETITION` / `UPDATE_COMPETITION` / `DELETE_COMPETITION`
- `SET_CURRENT_COMPETITION`
- `ADD_ORGANIZER` / `UPDATE_ORGANIZER` / `DELETE_ORGANIZER`
- Toutes les actions existantes (athlètes, pesée, tirages, etc.)

### Persistance
- Stockage local (localStorage)
- Export/import JSON
- Versioning du schéma (v5)

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

## 📊 Données de démonstration

L'application inclut des données de démonstration préconfigurées :

- **1 compétition** : Championnat National FITKD 2026
- **1 organisateur** : Fédération Ivoirienne de Taekwondo
- **27 athlètes** de 8 clubs ivoiriens
- **1 tirage généré** en Hommes −68 kg

## 🔒 Sécurité et Validation

- Validation des formulaires en temps réel
- Protection contre les suppressions accidentelles
- Vérification des intégrités référentielles
- Messages d'erreur contextuels

## 🌍 Adaptation Côte d'Ivoire

- Clubs ivoiriens (Taekwondo Club d'Abidjan, INJS Abidjan, etc.)
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
