# Module Sponsors & Partenaires - Documentation Approfondie

## Vue d'ensemble

Le module **Sponsors & Partenaires** est une solution complète de gestion des sponsors pour les compétitions de taekwondo. Il permet de gérer l'ensemble du cycle de vie des partenariats, de la création à la gestion des paiements et communications.

## Fonctionnalités principales

### 1. Gestion complète des sponsors

#### Informations de base
- **Nom du sponsor** : Nom officiel de l'entreprise ou organisation
- **Type de sponsor** :
  - Sponsor Principal
  - Sponsor Officiel
  - Partenaire
  - Partenaire Média
  - Partenaire Technique
- **Niveau de sponsoring** :
  - Or (couleur jaune)
  - Argent (couleur grise)
  - Bronze (couleur orange)
- **Statut** :
  - Actif
  - En attente
  - Expiré

#### Informations de contact
- Personne de contact
- Email
- Téléphone
- Site web

#### Informations financières
- Montant du sponsoring (en FCFA)
- Date de début du partenariat
- Date de fin du partenariat

#### Informations supplémentaires
- Logo (URL)
- Logo haute résolution (URL)
- Description du partenariat
- Notes internes (privées)

### 2. Gestion de la visibilité

Le module permet de définir où le sponsor sera visible :
- **Site web** : Logo sur le site officiel
- **Diffusion TV** : Logo pendant les diffusions télévisées
- **Affiches** : Logo sur les affiches officielles
- **Maillots** : Logo sur les maillots des athlètes
- **Stand** : Stand dédié dans l'espace événementiel
- **Réseaux sociaux** : Mention sur les réseaux sociaux
- **Communiqués de presse** : Mention dans les communiqués

### 3. Gestion des avantages

Liste des avantages accordés au sponsor :
- Exemples :
  - "Logo sur tous les supports de communication"
  - "Stand exclusif dans l'espace VIP"
  - "Présence sur les maillots des athlètes"
  - "Invitations VIP pour 20 personnes"

### 4. Gestion des paiements

#### Fonctionnalités
- **Ajout de paiements** : Enregistrer chaque versement
- **Suivi des statuts** :
  - Payé
  - En attente
  - En retard
- **Informations détaillées** :
  - Montant
  - Date
  - Méthode de paiement (virement, chèque, espèces)
  - Référence
  - Notes

#### Statistiques de paiements
- Total payé
- Total en attente
- Total en retard
- Taux de recouvrement

### 5. Gestion des communications

#### Historique des interactions
- **Types de communication** :
  - Email
  - Téléphone
  - Réunion
  - Autre
- **Informations enregistrées** :
  - Date
  - Sujet
  - Contenu détaillé
  - Participants

### 6. Système de filtrage avancé

Trois filtres permettent d'affiner l'affichage :
- **Filtre par type** : Afficher uniquement un type spécifique
- **Filtre par niveau** : Afficher uniquement un niveau spécifique
- **Filtre par statut** : Afficher uniquement un statut spécifique

### 7. Statistiques en temps réel

Le tableau de bord affiche :
- **Total sponsors** : Nombre total de sponsors enregistrés
- **Sponsors actifs** : Nombre de sponsors avec statut "actif"
- **Sponsors Or** : Nombre de sponsors de niveau "Or"
- **Financement total** : Somme totale des montants des sponsors actifs

### 8. Alertes automatiques

Le système affiche automatiquement :
- **Contrats expirant bientôt** : Sponsors dont le contrat expire dans les 30 prochains jours
- **Paiements en retard** : Alertes visuelles pour les paiements en retard

### 9. Rapport détaillé

Page dédiée `/sponsors/report` avec :
- Statistiques globales
- Répartition par niveau
- Suivi des paiements
- Liste détaillée par sponsor
- Export du rapport en JSON

## Interface utilisateur

### Page principale (`/sponsors`)

#### En-tête
- Titre et description
- Bouton "Ajouter un sponsor"

#### Section Alertes
- Affichage des contrats expirant bientôt (si applicable)

#### Section Statistiques
- 4 cartes avec les KPIs principaux

#### Section Filtres
- 3 sélecteurs pour filtrer les sponsors

#### Grille de sponsors
- Affichage en grille responsive
- Cartes avec logos et bordures colorées selon le niveau
- Badges de statut
- Boutons d'action (Voir, Gérer, Modifier, Supprimer)

### Modal de création/édition

Formulaire complet avec :
- Champs obligatoires : Nom, Contact, Email
- Champs optionnels : Logo, Site web, Téléphone, Montant, Description
- Sélecteurs : Type, Niveau, Statut
- Dates : Date de début et date de fin
- Cases à cocher : Visibilité du sponsor
- Zones de texte : Description, Notes internes

### Modal de visualisation

Affichage détaillé de toutes les informations :
- Logo en grand format
- Toutes les informations organisées en sections
- Liens cliquables pour le site web
- Liste de visibilité avec badges
- Boutons d'action (Fermer, Modifier)

### Modal de gestion avancée

Interface à onglets pour :
- **Onglet Paiements** : Gestion des paiements avec statistiques
- **Onglet Communications** : Historique des communications

### Page de rapport (`/sponsors/report`)

#### Statistiques globales
- Total sponsors avec répartition par statut
- Montant total avec moyenne par sponsor
- Répartition par niveau

#### Suivi des paiements
- Total payé
- Total en attente
- Total en retard
- Taux de recouvrement

#### Liste détaillée
- Tableau avec tous les sponsors
- Colonnes : Sponsor, Niveau, Statut, Montant, Payé, En attente
- Logos et informations de contact

#### Export
- Bouton pour exporter le rapport en JSON

## Architecture technique

### Types TypeScript

```typescript
interface Sponsor {
  id: string;
  name: string;
  type: SponsorType;
  level: SponsorLevel;
  logo: string;
  logoHighRes?: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: SponsorStatus;
  amount?: number;
  description?: string;
  visibility?: SponsorVisibility[];
  benefits?: string[];
  contractFile?: string;
  notes?: string;
  payments?: SponsorPayment[];
  communications?: SponsorCommunication[];
}

interface SponsorPayment {
  id: string;
  amount: number;
  date: string;
  status: "paye" | "en_attente" | "en_retard";
  method?: string;
  reference?: string;
  notes?: string;
}

interface SponsorCommunication {
  id: string;
  date: string;
  type: "email" | "telephone" | "reunion" | "autre";
  subject: string;
  content: string;
  participants?: string[];
}
```

### Composants

#### Pages
- `src/pages/Sponsors.tsx` : Page principale de gestion
- `src/pages/SponsorsReport.tsx` : Page de rapport détaillé

#### Composants réutilisables
- `src/components/PaymentsManager.tsx` : Gestion des paiements
- `src/components/CommunicationsManager.tsx` : Gestion des communications

#### Icônes
- `IconHandshake` : Icône principale du module
- `IconEye` : Visualisation
- `IconFile` : Gestion avancée
- `IconTrendUp` : Rapport

### Actions du reducer

- `ADD_SPONSOR` : Ajout d'un nouveau sponsor
- `UPDATE_SPONSOR` : Mise à jour d'un sponsor existant
- `DELETE_SPONSOR` : Suppression d'un sponsor

### Routes

- `/sponsors` : Page principale
- `/sponsors/report` : Page de rapport

### Navigation

- Lien "Sponsors & Partenaires" dans la barre latérale
- Lien "Rapport Sponsors" dans la barre latérale

## Données de démonstration

L'application inclut 3 sponsors de démonstration avec des données complètes :

### 1. Orange Côte d'Ivoire
- **Type** : Sponsor Principal
- **Niveau** : Or
- **Montant** : 15 000 000 FCFA
- **Statut** : Actif
- **Visibilité** : Tous les supports
- **Paiements** : 2 paiements (1 payé, 1 en attente)
- **Communications** : 2 communications (réunion, email)

### 2. MTN Côte d'Ivoire
- **Type** : Sponsor Officiel
- **Niveau** : Argent
- **Montant** : 8 000 000 FCFA
- **Statut** : Actif
- **Visibilité** : Site web, TV, affiches, stand, réseaux sociaux
- **Paiements** : 1 paiement payé
- **Communications** : 1 communication (téléphone)

### 3. Coca-Cola Côte d'Ivoire
- **Type** : Partenaire
- **Niveau** : Bronze
- **Montant** : 3 000 000 FCFA
- **Statut** : Actif
- **Visibilité** : Stand, affiches
- **Paiements** : 1 paiement payé
- **Communications** : 1 communication (email)

**Financement total** : 26 000 000 FCFA

## Utilisation

### Accès
- Via la barre de navigation latérale : "Sponsors & Partenaires"
- URL directe : `#/sponsors`

### Ajouter un sponsor
1. Cliquer sur le bouton "Ajouter un sponsor"
2. Remplir le formulaire (champs obligatoires : Nom, Contact, Email)
3. Sélectionner le type, le niveau et le statut
4. Ajouter les informations optionnelles (logo, site web, montant, etc.)
5. Cocher les options de visibilité
6. Cliquer sur "Ajouter"

### Gérer les paiements
1. Cliquer sur le bouton "Gérer" de la carte du sponsor
2. Sélectionner l'onglet "Paiements"
3. Cliquer sur "Ajouter un paiement"
4. Remplir les informations (montant, date, statut, méthode, référence)
5. Cliquer sur "Ajouter"

### Gérer les communications
1. Cliquer sur le bouton "Gérer" de la carte du sponsor
2. Sélectionner l'onglet "Communications"
3. Cliquer sur "Ajouter une communication"
4. Remplir les informations (date, type, sujet, contenu, participants)
5. Cliquer sur "Ajouter"

### Consulter le rapport
1. Cliquer sur "Rapport Sponsors" dans la barre latérale
2. Consulter les statistiques globales
3. Examiner le suivi des paiements
4. Consulter la liste détaillée
5. Exporter le rapport si nécessaire

## Statistiques calculées

### Financement total
```javascript
const totalAmount = state.sponsors
  .filter((s) => s.status === "actif" && s.amount)
  .reduce((sum, s) => sum + (s.amount || 0), 0);
```

### Taux de recouvrement
```javascript
const recoveryRate = allPayments.length > 0
  ? Math.round((paidPayments.length / allPayments.length) * 100)
  : 0;
```

### Alertes de contrats expirants
```javascript
const expiringSponsors = state.sponsors.filter((s) => {
  if (s.status !== "actif" || !s.endDate) return false;
  const endDate = new Date(s.endDate);
  const now = new Date();
  const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
});
```

## Améliorations futures possibles

### Fonctionnalités avancées
- **Gestion des contrats** : Upload de documents PDF, dates de renouvellement
- **Notifications automatiques** : Emails automatiques pour les paiements en retard
- **Intégration Mode TV** : Affichage automatique des logos sponsors pendant les cérémonies
- **Génération de certificats** : Création automatique de certificats de sponsoring
- **Historique complet** : Suivi de toutes les modifications apportées aux sponsors

### Intégrations
- **Site web public** : Page publique listant les sponsors
- **Emailing** : Envoi automatique d'emails aux sponsors
- **Paiements en ligne** : Intégration avec un système de paiement
- **Réseaux sociaux** : Publication automatique des annonces de sponsors

### Analytics
- **Graphiques interactifs** : Visualisation de la répartition par type et niveau
- **Comparaisons** : Comparaison des financements entre compétitions
- **Prévisions** : Estimation des revenus futurs basée sur les sponsors actifs
- **ROI** : Calcul du retour sur investissement pour chaque sponsor

## Sécurité et validation

### Validation des formulaires
- Champs obligatoires vérifiés avant soumission
- Validation du format email
- Validation du format URL pour le logo et le site web
- Validation du format téléphone
- Validation des montants (nombre positif)

### Protection des données
- Confirmation avant suppression
- Gestion des erreurs avec messages toast
- Persistance dans localStorage
- Notes internes séparées des informations publiques

## Accessibilité

- Labels appropriés pour tous les champs de formulaire
- Attributs ARIA pour les modals
- Navigation au clavier complète
- Contrastes de couleurs conformes aux standards WCAG
- Messages d'erreur clairs et descriptifs

## Responsive design

L'interface est entièrement responsive :
- **Mobile** : Grille en 1 colonne
- **Tablette** : Grille en 2 colonnes
- **Desktop** : Grille en 3 colonnes
- Modals adaptatifs pour toutes les tailles d'écran
- Tableaux avec défilement horizontal sur mobile

## Performance

- Chargement optimisé des images de logos
- Filtrage côté client pour une réactivité immédiate
- Rendu conditionnel des modals
- Mémoïsation des calculs de statistiques
- Pagination virtuelle pour les grandes listes (future amélioration)

## Compilation

- **72 modules** transformés
- **Build réussi** sans erreurs
- **Taille** : 414 KB JS (107 KB gzippé)
- **CSS** : 50 KB (9.4 KB gzippé)

---

**Module développé dans le cadre de l'application DOJANG - Régie de compétition Taekwondo FITKD Côte d'Ivoire**

**Version** : 2.0 - Version approfondie avec gestion des paiements et communications

**Dernière mise à jour** : 2026
