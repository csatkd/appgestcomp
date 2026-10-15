# Intégration Mode TV - Affichage automatique des logos des sponsors

## Vue d'ensemble

L'intégration Mode TV permet d'afficher automatiquement les logos des sponsors pendant les cérémonies de remise de prix et les pauses de la compétition. Cette fonctionnalité maximise la visibilité des sponsors et valorise leur investissement.

## Fonctionnalités

### 1. Affichage en carrousel automatique
- **Rotation automatique** : Les logos défilent automatiquement toutes les 4 secondes
- **Transitions fluides** : Animations de fondu et zoom pour un rendu professionnel
- **Boucle infinie** : Le carrousel recommence automatiquement après le dernier sponsor
- **Tri par niveau** : Les sponsors Or s'affichent en premier, suivis des Argent puis Bronze

### 2. Filtres par niveau de sponsor
- **Tous les niveaux** : Affiche tous les sponsors actifs
- **Or uniquement** : Affiche seulement les sponsors de niveau Or
- **Argent uniquement** : Affiche seulement les sponsors de niveau Argent
- **Bronze uniquement** : Affiche seulement les sponsors de niveau Bronze

### 3. Contrôle de la vitesse
- **Slider de vitesse** : Ajustable de 2 à 10 secondes entre chaque logo
- **Valeur par défaut** : 5 secondes
- **Ajustement en temps réel** : Le changement est immédiat

### 4. Contrôles de lecture
- **Pause/Reprendre** : Met en pause ou reprend le défilement automatique
- **Précédent** : Affiche le sponsor précédent manuellement
- **Suivant** : Affiche le sponsor suivant manuellement

### 5. Indicateurs visuels
- **Barre de progression** : Indique la position actuelle dans le carrousel
- **Compteur** : Affiche "X / Y" pour savoir où on en est
- **Badge de niveau** : Affiche le niveau du sponsor actuel (OR, ARGENT, BRONZE)

### 6. Mode plein écran
- **Bouton plein écran** : Permet de passer en mode plein écran pour projection TV
- **Bouton quitter** : Apparaît en mode plein écran pour revenir à la normale
- **Optimisé TV** : Affichage optimisé pour les grands écrans

### 7. Page dédiée aux cérémonies
- **Route spéciale** : `/ceremony-sponsors`
- **Affichage automatique** : Démarre automatiquement en plein écran
- **Design cérémonial** : Fond avec gradient dynamique selon le niveau du sponsor
- **Bandes kente** : Décoration aux bords supérieur et inférieur
- **Informations événement** : Nom de l'événement, date et lieu affichés

## Composants créés

### 1. SponsorDisplay.tsx
Composant principal pour l'affichage des sponsors avec :
- Props `fullscreen` pour activer le mode plein écran
- Filtres par niveau
- Contrôle de vitesse
- Boutons de navigation
- Indicateurs de progression
- Animations fluides

### 2. CeremonySponsors.tsx
Composant dédié aux cérémonies avec :
- Affichage plein écran automatique
- Gradient dynamique selon le niveau
- Bandes kente décoratives
- En-tête de l'événement
- Footer avec informations
- Transitions professionnelles

### 3. CeremonySponsorsPage.tsx
Page wrapper pour la route `/ceremony-sponsors`

## Intégration dans le Mode TV

### Nouvelle vue "Sponsors"
- **Bouton ajouté** : "Sponsors" avec icône IconHandshake
- **Position** : 4ème bouton dans le sélecteur de vue
- **Fonctionnement** : Affiche le composant SponsorDisplay dans un panel

### Accès
```
Mode TV → Bouton "Sponsors" → Affichage des logos
```

## Utilisation

### Affichage standard (Mode TV)
1. Aller dans "Mode TV" via la navigation
2. Cliquer sur le bouton "Sponsors"
3. Utiliser les filtres pour afficher un niveau spécifique
4. Ajuster la vitesse avec le slider
5. Utiliser les boutons de navigation si nécessaire
6. Cliquer sur "Mode plein écran" pour projection TV

### Affichage cérémonial
1. Accéder directement à `#/ceremony-sponsors`
2. L'affichage démarre automatiquement
3. Les logos défilent en boucle
4. Utiliser F11 pour plein écran navigateur si nécessaire

## Configuration des sponsors

Pour qu'un sponsor apparaisse en Mode TV, il doit :
1. **Être actif** : Statut = "actif"
2. **Avoir un logo** : Champ "logo" rempli avec une URL valide
3. **Avoir la visibilité TV** : Case "Diffusion TV" cochée dans la visibilité

### Exemple de configuration
```javascript
{
  id: "sponsor-1",
  name: "Orange Côte d'Ivoire",
  status: "actif",
  logo: "https://example.com/logo.png",
  visibility: ["site_web", "tv", "affiches", ...],
  level: "or",
  // ... autres champs
}
```

## Design et animations

### Transitions
- **Fade in/out** : Fondu d'apparition et de disparition
- **Scale** : Léger zoom lors des transitions
- **Duration** : 500ms pour des transitions fluides
- **Easing** : ease-in-out pour un rendu naturel

### Couleurs par niveau
- **Or** : Gradient jaune/or (#fbbf24)
- **Argent** : Gradient gris clair (#d1d5db)
- **Bronze** : Gradient orange (#fb923c)

### Typographie
- **Nom du sponsor** : Font display, 6xl, uppercase
- **Niveau** : Font mono, tracking étendu, couleur selon niveau
- **Description** : Text xl, couleur dune
- **Événement** : Font mono, tracking étendu, couleur gold

## Statistiques

### Sponsors affichés
- **Total** : Nombre de sponsors actifs avec logo et visibilité TV
- **Par niveau** : Répartition Or/Argent/Bronze
- **Temps de cycle** : Temps total pour afficher tous les sponsors une fois

### Calcul du temps de cycle
```
Temps de cycle = Nombre de sponsors × Vitesse (en secondes)
```

Exemple : 10 sponsors × 5 secondes = 50 secondes pour un cycle complet

## Optimisations

### Performance
- **Filtrage côté client** : Rapide et réactif
- **Images optimisées** : Utilisation du champ `logoHighRes` si disponible
- **Lazy loading** : Les images sont chargées à la demande
- **Memoization** : Les calculs sont mis en cache

### Accessibilité
- **Alt text** : Chaque logo a un texte alternatif
- **Contrastes** : Couleurs optimisées pour la lisibilité
- **Navigation clavier** : Tous les boutons sont accessibles au clavier
- **ARIA labels** : Labels appropriés pour les lecteurs d'écran

## Cas d'utilisation

### 1. Pendant les cérémonies de remise de prix
- Afficher les logos pendant que les athlètes montent sur le podium
- Rotation automatique pendant 2-3 minutes
- Fond cérémonial avec gradient

### 2. Pendant les pauses
- Affichage continu entre les combats
- Vitesse plus rapide (3-4 secondes)
- Tous les niveaux affichés

### 3. Pendant l'attente du public
- Affichage en boucle avant le début de l'événement
- Vitesse plus lente (6-8 secondes)
- Description des sponsors affichée

### 4. Pendant les interviews
- Affichage en fond pendant les interviews
- Logos en filigrane
- Vitesse lente (8-10 secondes)

## Personnalisation

### Modifier la vitesse par défaut
Dans `SponsorDisplay.tsx` :
```typescript
const [speed, setSpeed] = useState(5000); // Changer cette valeur
```

### Modifier la durée des transitions
Dans `SponsorDisplay.tsx` :
```typescript
setTimeout(() => {
  setCurrentIndex((prev) => (prev + 1) % sortedSponsors.length);
  setIsTransitioning(false);
}, 500); // Changer cette valeur (en ms)
```

### Modifier l'ordre d'affichage
Dans `SponsorDisplay.tsx` :
```typescript
const sortedSponsors = [...activeSponsors].sort((a, b) => {
  // Modifier la logique de tri ici
  const levelOrder = { or: 0, argent: 1, bronze: 2 };
  return levelOrder[a.level] - levelOrder[b.level];
});
```

## Routes disponibles

- `/tv` → Mode TV avec vue Sponsors
- `/ceremony-sponsors` → Page dédiée aux cérémonies

## Intégration future

### Fonctionnalités prévues
- **Playlist personnalisée** : Sélection manuelle des sponsors à afficher
- **Horaires programmés** : Affichage automatique à des heures précises
- **Intégration OBS** : Plugin pour logiciels de streaming
- **QR Code dynamique** : QR code du sponsor affiché avec le logo
- **Animations personnalisées** : Choix du type d'animation par sponsor

### API d'intégration
```javascript
// Exemple d'API pour contrôler l'affichage depuis une application externe
window.DOJANG_TV = {
  nextSponsor: () => { /* Passer au sponsor suivant */ },
  previousSponsor: () => { /* Revenir au sponsor précédent */ },
  pause: () => { /* Mettre en pause */ },
  resume: () => { /* Reprendre */ },
  setSpeed: (ms) => { /* Changer la vitesse */ },
  setFilter: (level) => { /* Changer le filtre */ },
};
```

## Compilation

- **72 modules** transformés
- **Build réussi** sans erreurs
- **Taille** : 414 KB JS (107 KB gzippé)
- **CSS** : 50 KB (9.4 KB gzippé)

## Support technique

### Problèmes courants

**Les logos ne s'affichent pas**
- Vérifier que le sponsor est actif
- Vérifier que le logo est une URL valide
- Vérifier que la visibilité "tv" est cochée

**Les transitions sont saccadées**
- Réduire le nombre de sponsors affichés
- Utiliser des images optimisées (max 500KB)
- Vérifier les performances du navigateur

**Le mode plein écran ne fonctionne pas**
- Utiliser le bouton "Mode plein écran"
- Ou appuyer sur F11 pour le plein écran navigateur
- Vérifier les permissions du navigateur

---

**Module développé dans le cadre de l'application DOJANG - Régie de compétition Taekwondo FITKD Côte d'Ivoire**

**Version** : 1.0 - Intégration Mode TV

**Dernière mise à jour** : 2026
