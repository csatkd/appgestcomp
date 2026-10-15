# Nouveaux Modules - Documentation

## 📅 Module Calendrier (`/calendar`)

### Vue d'ensemble
Module de visualisation du planning des compétitions sous forme de calendrier mensuel interactif.

### Fonctionnalités
- **Navigation mensuelle** : Boutons précédent/suivant pour naviguer entre les mois
- **Vue calendrier** : Grille de 6 semaines × 7 jours
- **Événements colorés** : Code couleur par type de compétition
  - 🟢 Vert : Compétition locale
  - 🟡 Or : Compétition nationale
  - 🔴 Rouge : Compétition internationale
- **Liste des événements** : Détail des compétitions du mois sélectionné
- **Légende** : Explication des codes couleur

### Composants
- `src/pages/Calendar.tsx` : Composant principal
- Utilise `IconCalendar` et `IconChevron`

### Données affichées
- Nom de la compétition
- Dates de début et fin
- Lieu
- Type (locale/nationale/internationale)

---

## 🔔 Module Notifications (`/notifications`)

### Vue d'overview
Système de notifications intelligentes basé sur l'état actuel de la compétition.

### Fonctionnalités
- **Notifications automatiques** :
  - ⚠️ Pesées en attente
  - ℹ️ Tirages à générer
  - ✗ Réclamations en attente
  - ✓ Matchs prêts
  - ℹ️ Compétitions actives
- **Filtres** : Toutes / Non lues
- **Statistiques** : Total, non lues
- **Actions rapides** : Liens directs vers les modules concernés
- **Marquage** : Marquer comme lu / Tout marquer comme lu

### Composants
- `src/pages/Notifications.tsx` : Composant principal
- Utilise `IconBell`, `IconCheck`, `IconTrash`

### Types de notifications
- `info` : Informations générales (bleu)
- `success` : Succès (vert)
- `warning` : Avertissements (or)
- `error` : Erreurs/urgences (rouge)

---

## 📊 Module Rapports & Statistiques (`/reports`)

### Vue d'ensemble
Tableau de bord analytique avec statistiques détaillées et visualisations.

### Fonctionnalités
- **KPIs principaux** :
  - Athlètes (total, pesés, forfaits)
  - Matchs (total, terminés, prêts)
  - Compétitions (total, actives)
  - Progression (taux de completion)
- **Barres de progression** :
  - Taux de pesées
  - Taux de matchs terminés
  - Taux de réclamations résolues
- **Statistiques par catégorie** :
  - Tableau détaillé par catégorie de poids
  - Nombre d'athlètes, matchs, matchs terminés
  - Statut de chaque catégorie
- **Statistiques par club** :
  - Classement des clubs par nombre d'athlètes
  - Taux de pesées par club
  - Barres de progression visuelles

### Composants
- `src/pages/Reports.tsx` : Composant principal
- Utilise `IconChart`, `IconUsers`, `IconTrophy`, `IconCalendar`

### Métriques calculées
- Taux de pesées : (athlètes pesés / total athlètes) × 100
- Taux de completion : (matchs terminés / total matchs) × 100
- Taux de réclamations résolues : (réclamations résolues / total réclamations) × 100

---

## 📤 Module Export & Import (`/export`)

### Vue d'overview
Module de gestion des données avec export/import au format CSV.

### Fonctionnalités d'export
- **Types de données exportables** :
  - Athlètes (toutes les informations)
  - Clubs (coordonnées complètes)
  - Résultats (podiums par catégorie)
- **Format CSV** : Compatible Excel, Google Sheets
- **Téléchargement automatique** : Fichier généré et téléchargé

### Fonctionnalités d'import
- **Import d'athlètes** : Upload de fichier CSV
- **Validation** : Vérification des en-têtes requis
- **Format requis** :
  ```
  Prénom, Nom, Genre, Année de naissance, Club, Licence, Poids, Catégorie, Statut
  ```
- **Gestion des erreurs** : Messages d'erreur clairs

### Composants
- `src/pages/ExportImport.tsx` : Composant principal
- Utilise `IconDownload`, `IconUpload`, `IconFile`

### Formats de fichiers
- **Export** : CSV avec séparateur virgule, champs entre guillemets
- **Import** : CSV avec en-têtes obligatoires

### Statistiques affichées
- Nombre d'athlètes
- Nombre de clubs
- Nombre d'arbitres
- Nombre de compétitions

---

## 🎨 Icônes ajoutées

### Nouvelles icônes dans `Icons.tsx`
- `IconChart` : Graphique en barres (pour Rapports)
- `IconFile` : Document (pour Export/Import)
- `IconLogout` : Déconnexion (pour Portail Parents)

### Icônes réutilisées
- `IconCalendar` : Calendrier
- `IconBell` : Notifications
- `IconDownload` : Export
- `IconUpload` : Import
- `IconCheck` : Validation
- `IconTrash` : Suppression

---

## 📋 Mise à jour de la navigation

### Layout.tsx
Ajout de 4 nouveaux liens dans la barre de navigation latérale :
1. **Calendrier** (`/calendar`) - Icône `IconCalendar`
2. **Rapports** (`/reports`) - Icône `IconDownload`
3. **Notifications** (`/notifications`) - Icône `IconBell`
4. **Export & Import** (`/export`) - Icône `IconFile`

### App.tsx
Ajout de 4 nouvelles routes :
```tsx
<Route path="/calendar" element={<Calendar />} />
<Route path="/reports" element={<Reports />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/export" element={<ExportImport />} />
```

---

## 📊 Statistiques globales de l'application

### Nombre total de modules : 18
1. Tableau de bord
2. Compétitions
3. Organisateurs
4. Clubs
5. Arbitres
6. Athlètes
7. Pesée
8. Tirages au sort
9. Live Scoring
10. Résultats
11. Réclamations
12. Mode TV
13. QR Présences
14. **Calendrier** (NOUVEAU)
15. **Rapports & Statistiques** (NOUVEAU)
16. **Notifications** (NOUVEAU)
17. **Export & Import** (NOUVEAU)
18. Administration
+ Portail Parents (2 pages)

### Compilation
- **68 modules** transformés
- **Build réussi** sans erreurs
- **Taille** : 370 KB JS (99 KB gzippé)
- **CSS** : 49 KB (9.2 KB gzippé)

---

## 🚀 Améliorations futures possibles

### Module Calendrier
- [ ] Vue semaine/jour
- [ ] Drag & drop pour déplacer les événements
- [ ] Synchronisation avec Google Calendar
- [ ] Export iCal

### Module Notifications
- [ ] Notifications push (PWA)
- [ ] Email notifications
- [ ] Historique des notifications
- [ ] Personnalisation des alertes

### Module Rapports
- [ ] Graphiques interactifs (Chart.js)
- [ ] Export PDF des rapports
- [ ] Comparaison entre compétitions
- [ ] Prédictions et tendances

### Module Export/Import
- [ ] Export Excel (XLSX)
- [ ] Import de résultats depuis fichiers PSS
- [ ] Synchronisation cloud
- [ ] Sauvegarde automatique

---

**DOJANG** - La Régie des Tatamis 🥋
