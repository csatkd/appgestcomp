# Module Sponsors & Partenaires

## Vue d'ensemble

Le module **Sponsors & Partenaires** permet de gérer l'ensemble des sponsors et partenaires de la compétition. Il offre une interface complète pour créer, modifier, visualiser et supprimer des sponsors, avec un système de filtrage avancé et des statistiques en temps réel.

## Fonctionnalités

### 1. Gestion complète des sponsors
- **Création** : Ajout de nouveaux sponsors avec toutes les informations nécessaires
- **Modification** : Édition des informations des sponsors existants
- **Suppression** : Suppression avec confirmation
- **Visualisation** : Vue détaillée de chaque sponsor

### 2. Classification des sponsors
- **Types de sponsors** :
  - Sponsor Principal
  - Sponsor Officiel
  - Partenaire
  - Partenaire Média
  - Partenaire Technique

- **Niveaux de sponsoring** :
  - Or (couleur jaune)
  - Argent (couleur grise)
  - Bronze (couleur orange)

- **Statuts** :
  - Actif
  - En attente
  - Expiré

### 3. Informations gérées
Pour chaque sponsor, les informations suivantes sont disponibles :
- Nom du sponsor
- Type de sponsor
- Niveau (Or/Argent/Bronze)
- Logo (URL)
- Site web
- Personne de contact
- Email
- Téléphone
- Date de début du partenariat
- Date de fin du partenariat
- Statut
- Montant du sponsoring (optionnel)
- Description (optionnelle)

### 4. Statistiques en temps réel
Le tableau de bord affiche :
- **Total sponsors** : Nombre total de sponsors enregistrés
- **Sponsors actifs** : Nombre de sponsors avec statut "actif"
- **Sponsors Or** : Nombre de sponsors de niveau "Or"
- **Financement total** : Somme totale des montants des sponsors actifs

### 5. Système de filtrage
Trois filtres permettent d'affiner l'affichage :
- **Filtre par type** : Afficher uniquement un type spécifique de sponsor
- **Filtre par niveau** : Afficher uniquement les sponsors d'un niveau spécifique
- **Filtre par statut** : Afficher uniquement les sponsors d'un statut spécifique

### 6. Affichage visuel
- **Cartes avec logos** : Chaque sponsor est affiché sous forme de carte avec son logo
- **Bordures colorées** : Les bordures des cartes sont colorées selon le niveau (Or/Argent/Bronze)
- **Fallback intelligent** : Si le logo n'est pas disponible, la première lettre du nom est affichée
- **Badges de statut** : Badges colorés indiquant le statut du sponsor

## Interface utilisateur

### Page principale
La page principale affiche :
1. **En-tête** : Titre et bouton "Ajouter un sponsor"
2. **Statistiques** : 4 cartes avec les KPIs
3. **Filtres** : 3 sélecteurs pour filtrer les sponsors
4. **Grille de sponsors** : Affichage en grille responsive des sponsors

### Modal de création/édition
Le modal permet de saisir toutes les informations du sponsor :
- Champs obligatoires : Nom, Contact, Email
- Champs optionnels : Logo, Site web, Téléphone, Montant, Description
- Sélecteurs : Type, Niveau, Statut
- Dates : Date de début et date de fin

### Modal de visualisation
Le modal de visualisation affiche toutes les informations du sponsor de manière détaillée :
- Logo en grand format
- Toutes les informations organisées en sections
- Liens cliquables pour le site web
- Boutons d'action (Fermer, Modifier)

## Données de démonstration

L'application inclut 3 sponsors de démonstration :

1. **Orange Côte d'Ivoire**
   - Type : Sponsor Principal
   - Niveau : Or
   - Montant : 15 000 000 FCFA
   - Statut : Actif

2. **MTN Côte d'Ivoire**
   - Type : Sponsor Officiel
   - Niveau : Argent
   - Montant : 8 000 000 FCFA
   - Statut : Actif

3. **Coca-Cola Côte d'Ivoire**
   - Type : Partenaire
   - Niveau : Bronze
   - Montant : 3 000 000 FCFA
   - Statut : Actif

**Financement total** : 26 000 000 FCFA

## Architecture technique

### Types TypeScript
```typescript
type SponsorType = "principal" | "officiel" | "partenaire" | "media" | "technique";
type SponsorLevel = "or" | "argent" | "bronze";
type SponsorStatus = "actif" | "en_attente" | "expire";

interface Sponsor {
  id: string;
  name: string;
  type: SponsorType;
  level: SponsorLevel;
  logo: string;
  website: string;
  contact: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: SponsorStatus;
  amount?: number;
  description?: string;
}
```

### Actions du reducer
- `ADD_SPONSOR` : Ajout d'un nouveau sponsor
- `UPDATE_SPONSOR` : Mise à jour d'un sponsor existant
- `DELETE_SPONSOR` : Suppression d'un sponsor

### Composants
- **Page** : `src/pages/Sponsors.tsx`
- **Icône** : `IconHandshake` dans `src/components/Icons.tsx`
- **Route** : `/sponsors` dans `src/App.tsx`
- **Navigation** : Lien "Sponsors & Partenaires" dans `src/components/Layout.tsx`

## Utilisation

### Accès
- Via la barre de navigation latérale : "Sponsors & Partenaires"
- URL directe : `#/sponsors`

### Ajouter un sponsor
1. Cliquer sur le bouton "Ajouter un sponsor"
2. Remplir le formulaire (champs obligatoires : Nom, Contact, Email)
3. Sélectionner le type, le niveau et le statut
4. Ajouter les informations optionnelles (logo, site web, montant, etc.)
5. Cliquer sur "Ajouter"

### Modifier un sponsor
1. Cliquer sur le bouton "Modifier" de la carte du sponsor
2. Modifier les informations dans le formulaire
3. Cliquer sur "Mettre à jour"

### Visualiser un sponsor
1. Cliquer sur le bouton "Voir" de la carte du sponsor
2. Consulter toutes les informations dans le modal
3. Cliquer sur le lien du site web pour y accéder
4. Cliquer sur "Modifier" pour éditer les informations

### Supprimer un sponsor
1. Cliquer sur le bouton "Supprimer" (icône poubelle)
2. Confimer la suppression dans la boîte de dialogue

### Filtrer les sponsors
1. Utiliser les sélecteurs de filtre en haut de la page
2. Les sponsors sont automatiquement filtrés selon les critères sélectionnés
3. Combiner plusieurs filtres pour un affichage plus précis

## Statistiques calculées

### Financement total
```javascript
const totalAmount = state.sponsors
  .filter((s) => s.status === "actif" && s.amount)
  .reduce((sum, s) => sum + (s.amount || 0), 0);
```

Le financement total est calculé en additionnant les montants de tous les sponsors actifs.

### Formatage des montants
Les montants sont formatés en FCFA (Franc CFA) avec la fonction :
```javascript
new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
}).format(amount);
```

## Améliorations futures possibles

### Fonctionnalités avancées
- **Export PDF** : Génération de rapports PDF des sponsors
- **Gestion des contrats** : Upload et gestion des contrats de sponsoring
- **Notifications** : Alertes pour les sponsors expirant bientôt
- **Historique** : Suivi des modifications apportées aux sponsors
- **Catégories personnalisées** : Possibilité de créer des types de sponsors personnalisés

### Intégrations
- **Mode TV** : Affichage des logos des sponsors pendant les cérémonies
- **Site web public** : Page publique listant les sponsors
- **Emailing** : Envoi automatique d'emails aux sponsors
- **Paiements** : Intégration avec un système de paiement pour le suivi des versements

### Analytics
- **Graphiques** : Visualisation de la répartition par type et niveau
- **Comparaisons** : Comparaison des financements entre compétitions
- **Prévisions** : Estimation des revenus futurs basée sur les sponsors actifs

## Sécurité et validation

### Validation des formulaires
- Champs obligatoires vérifiés avant soumission
- Validation du format email
- Validation du format URL pour le logo et le site web
- Validation du format téléphone

### Protection des données
- Confirmation avant suppression
- Gestion des erreurs avec messages toast
- Persistance dans localStorage

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

## Performance

- Chargement optimisé des images de logos
- Filtrage côté client pour une réactivité immédiate
- Rendu conditionnel des modals
- Mémoïsation des calculs de statistiques

---

**Module développé dans le cadre de l'application DOJANG - Régie de compétition Taekwondo FITKD Côte d'Ivoire**
