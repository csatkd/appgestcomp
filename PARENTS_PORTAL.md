# Portail Parents - Documentation

## 📋 Vue d'ensemble

Le portail parents permet aux parents de suivre la progression de leur enfant dans les compétitions de taekwondo. L'accès est sécurisé par le numéro de licence de l'athlète qui sert à la fois d'identifiant et de mot de passe.

## 🔐 Système d'Authentification

### Principe
- **Login** : Numéro de licence de l'athlète (ex: `FITKD-26-1001`)
- **Mot de passe** : Même numéro de licence
- **Stockage** : Session stockée dans `localStorage` sous la clé `parent_athlete_id`

### Sécurité
- Vérification que la licence existe dans la base de données des athlètes
- Redirection automatique vers la page de connexion si la session est invalide
- Possibilité de déconnexion à tout moment

## 📱 Pages du Portail

### 1. Page de Connexion (`/parents/login`)

**URL** : `#/parents/login`

**Fonctionnalités** :
- Formulaire de connexion avec champ "Numéro de Licence"
- Validation du format de la licence
- Message d'aide pour trouver le numéro de licence
- Animation de chargement pendant la vérification
- Toast de succès/erreur

**Design** :
- Interface centrée et épurée
- Icône de cadenas pour indiquer la sécurité
- Fond avec image thématique (athlètes)
- Bouton de retour à l'accueil

### 2. Tableau de Bord Parent (`/parents/dashboard`)

**URL** : `#/parents/dashboard`

**Fonctionnalités** :

#### Profil de l'athlète
- Avatar avec initiales
- Nom complet
- Badges de statut (inscrit/pesé/forfait)
- Numéro de licence
- Informations de base (sexe, âge, club)

#### Statistiques
- **Catégorie** : Catégorie de poids actuelle + dernier poids enregistré
- **Victoires** : Nombre de matchs gagnés
- **Matchs** : Nombre total de matchs + défaites

#### Historique des Matchs
- Liste chronologique de tous les matchs
- Indicateur visuel : victoire (vert), défaite (rouge), en cours (doré)
- Score du match (si terminé)
- Nom de l'adversaire

#### Informations du Club
- Nom du club
- Numéro de licence
- Dernière pesée enregistrée

**Design** :
- Layout responsive (mobile-first)
- Cartes avec bordures colorées selon le statut
- Icônes thématiques pour chaque section
- Bouton de déconnexion en haut à droite

## 🎨 Composants Utilisés

### `ParentsLogin.tsx`
```typescript
- Formulaire de connexion
- Validation de la licence
- Gestion de l'état de chargement
- Redirection après connexion
```

### `ParentsDashboard.tsx`
```typescript
- Vérification de la session
- Affichage du profil complet
- Calcul des statistiques
- Historique des matchs
- Bouton de déconnexion
```

### `ParentsPortal.tsx` (Landing)
```typescript
- Section de présentation sur la landing page
- 3 cartes de fonctionnalités
- Bouton CTA vers la page de connexion
```

## 🔧 Configuration

### Routes (App.tsx)
```typescript
<Route path="/parents/login" element={<ParentsLogin />} />
<Route path="/parents/dashboard" element={<ParentsDashboard />} />
```

### Icônes Utilisées
- `IconUsers` : Profil et statistiques
- `IconLock` : Sécurité et connexion
- `IconScale` : Catégorie de poids
- `IconTrophy` : Victoires et matchs
- `IconLogout` : Déconnexion

## 📊 Données Affichées

### Informations Personnelles
- Prénom et nom
- Sexe
- Année de naissance → calcul de l'âge
- Club d'appartenance
- Numéro de licence
- Statut (inscrit/pesé/forfait)

### Informations Sportives
- Catégorie de poids
- Dernier poids enregistré
- Nombre de victoires
- Nombre de défaites
- Nombre total de matchs

### Historique des Matchs
Pour chaque match :
- Statut (à venir / en cours / terminé)
- Résultat (victoire / défaite)
- Score final
- Nom de l'adversaire

## 🔒 Sécurité et Confidentialité

### Données Accessibles
Les parents peuvent uniquement voir :
- Les informations de leur propre enfant
- L'historique des matchs de leur enfant
- Les statistiques personnelles

### Données Non Accessibles
Les parents ne peuvent pas :
- Voir les informations des autres athlètes
- Modifier les données
- Accéder aux fonctionnalités d'administration
- Voir les scores détaillés des autres matchs

## 🚀 Améliorations Futures

### Fonctionnalités Possibles
1. **Notifications** : Alertes avant les matchs
2. **Calendrier** : Planning des prochaines compétitions
3. **Photos** : Galerie de photos des compétitions
4. **Certificats** : Téléchargement des certificats de participation
5. **Statistiques Avancées** : Graphiques de progression
6. **Messagerie** : Contact avec les entraîneurs
7. **Multi-enfants** : Gestion de plusieurs enfants avec un seul compte

### Sécurité
1. **Authentification à deux facteurs**
2. **Expiration de session** automatique
3. **Historique de connexion**
4. **Changement de mot de passe** (si on ajoute un vrai système de mots de passe)

## 📝 Guide d'Utilisation pour les Parents

### Première Connexion
1. Aller sur la landing page
2. Cliquer sur "Espace Parents"
3. Saisir le numéro de licence de l'enfant (ex: `FITKD-26-1001`)
4. Cliquer sur "Se Connecter"
5. Accéder au tableau de bord

### Trouver le Numéro de Licence
- Sur la carte de licence de l'enfant
- Format : `FITKD-26-XXXX`
- Demander à l'entraîneur ou au club

### Déconnexion
- Cliquer sur le bouton "Déconnexion" en haut à droite du tableau de bord
- La session est immédiatement terminée

## 🎯 Cas d'Usage

### Pour les Parents
- Suivre la progression de leur enfant
- Voir les résultats des compétitions
- Connaître la catégorie de poids
- Consulter l'historique des matchs

### Pour les Organisateurs
- Offrir un service supplémentaire aux familles
- Réduire les demandes d'information
- Améliorer l'engagement des participants
- Professionnaliser l'événement

### Pour les Clubs
- Valoriser leur offre
- Fidéliser les familles
- Faciliter la communication
- Moderniser leur image

## 📞 Support

Pour toute question sur le portail parents :
- Vérifier que le numéro de licence est correct
- S'assurer que l'enfant est bien inscrit dans le système
- Contacter l'organisateur ou le club

---

**DOJANG** - La Régie des Tatamis 🥋
