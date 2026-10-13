# Landing Page DOJANG

Landing page dynamique et évolutive pour présenter l'application DOJANG.

## 🎯 Accès

La landing page est accessible via : `#/landing`

## 🏗️ Architecture Modulaire

La landing page est construite avec une architecture modulaire pour faciliter l'évolution :

```
src/
├── pages/
│   └── Landing.tsx              # Page principale
├── components/
│   └── landing/
│       ├── Hero.tsx             # Section héro avec CTA
│       ├── Features.tsx         # Grille des 12 fonctionnalités
│       ├── Stats.tsx            # Statistiques animées
│       ├── Testimonials.tsx     # Témoignages
│       ├── CTA.tsx              # Call-to-action final
│       └── Footer.tsx           # Pied de page
└── hooks/
    └── useScrollReveal.ts       # Hooks d'animation
```

## 🎨 Sections Disponibles

### 1. Hero
- Logo et branding
- Titre principal avec gradient
- Sous-titre descriptif
- Boutons CTA (Accéder / Découvrir)
- Statistiques rapides
- Indicateur de scroll animé

### 2. Features
- Grille de 12 fonctionnalités
- Icônes colorées par module
- Animations au scroll
- Effets hover avec accent gradient

### 3. Stats
- Compteurs animés
- 4 statistiques clés
- Animation de comptage au scroll

### 4. Testimonials
- 3 témoignages
- Cartes avec effets hover
- Citations et auteurs

### 5. CTA Final
- Titre accrocheur
- Description
- Boutons d'action
- Mention gratuit/open source

### 6. Footer
- Logo et description
- Liens vers l'application
- Informations de contact
- Copyright

## 🔧 Personnalisation

### Ajouter une nouvelle section

1. Créer un nouveau composant dans `src/components/landing/` :

```tsx
// src/components/landing/NewSection.tsx
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function NewSection() {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <section className="relative py-24 bg-night">
      <div ref={ref} className={`... ${isVisible ? "..." : "..."}`}>
        {/* Contenu */}
      </div>
    </section>
  );
}
```

2. L'ajouter dans `src/pages/Landing.tsx` :

```tsx
import NewSection from "../components/landing/NewSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-night">
      <Hero />
      <Features />
      <NewSection />  {/* ← Ajouter ici */}
      <Stats />
      {/* ... */}
    </div>
  );
}
```

### Modifier les fonctionnalités

Éditer `src/components/landing/Features.tsx` :

```tsx
const features = [
  {
    icon: IconCalendar,
    title: "Votre Titre",
    description: "Votre description",
    color: "text-gold",  // text-gold, text-flame, text-forest, text-chong
  },
  // ...
];
```

### Modifier les statistiques

Éditer `src/components/landing/Stats.tsx` :

```tsx
const stats = [
  { value: 12, label: "Votre Label", suffix: "" },
  // ...
];
```

### Modifier les témoignages

Éditer `src/components/landing/Testimonials.tsx` :

```tsx
const testimonials = [
  {
    quote: "Votre citation",
    author: "Nom de l'auteur",
    role: "Rôle/Fonction",
  },
  // ...
];
```

## 🎭 Animations

### useScrollReveal
Hook pour révéler un élément au scroll :

```tsx
const { ref, isVisible } = useScrollReveal();

<div ref={ref} className={`transition-all duration-1000 ${
  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
}`}>
  {/* Contenu */}
</div>
```

### useCountUp
Hook pour animer un compteur :

```tsx
const count = useCountUp(100, 2000, isVisible);

<div>{count}</div>
```

## 🎨 Design System

### Couleurs
- `bg-night` : Fond principal (#14100a)
- `bg-coal` : Fond secondaire (#1e1710)
- `text-bone` : Texte principal (#f4ead9)
- `text-dune` : Texte secondaire (#b09e82)
- `text-gold` : Accent principal (#f0a41c)
- `text-flame` : Accent rouge (#e2472e)
- `text-forest` : Accent vert (#23a06a)
- `text-chong` : Accent bleu (#3a72e0)

### Typographie
- `font-display` : Anton (titres)
- `font-body` : Space Grotesk (texte)
- `font-mono` : IBM Plex Mono (données)

### Patterns
- `kente` : Motif kente horizontal
- `kente-vert` : Motif kente vertical
- `mud-bg` : Motif bogolan
- `noise-layer` : Texture grain

## 📱 Responsive

Toutes les sections sont responsive :
- Mobile : 1 colonne
- Tablette : 2 colonnes
- Desktop : 3-4 colonnes

## 🚀 Performance

- Animations CSS (pas de JavaScript lourd)
- IntersectionObserver pour les animations au scroll
- Lazy loading des composants
- Optimisation des re-renders React

## 🔗 Navigation

La landing page est séparée de l'application :
- `#/landing` : Landing page (sans layout)
- `#/` : Application (avec layout)

Pour ajouter un lien vers la landing page depuis l'application :

```tsx
<a href="#/landing">Retour à l'accueil</a>
```

## 📝 Exemples d'extensions

### Section Pricing
```tsx
// src/components/landing/Pricing.tsx
export default function Pricing() {
  return (
    <section className="py-24 bg-coal">
      <h2>Nos Offres</h2>
      {/* Plans tarifaires */}
    </section>
  );
}
```

### Section FAQ
```tsx
// src/components/landing/FAQ.tsx
export default function FAQ() {
  return (
    <section className="py-24 bg-night">
      <h2>Questions Fréquentes</h2>
      {/* Accordéon FAQ */}
    </section>
  );
}
```

### Section Partners
```tsx
// src/components/landing/Partners.tsx
export default function Partners() {
  return (
    <section className="py-24 bg-coal">
      <h2>Nos Partenaires</h2>
      {/* Logos partenaires */}
    </section>
  );
}
```

## 🎯 Bonnes pratiques

1. **Performance** : Utiliser `useScrollReveal` pour toutes les animations
2. **Accessibilité** : Ajouter des `aria-label` aux boutons
3. **Responsive** : Tester sur mobile, tablette et desktop
4. **Cohérence** : Respecter le design system (couleurs, typo)
5. **Modularité** : Chaque section doit être indépendante

## 📞 Support

Pour toute question sur la landing page, contacter l'équipe DOJANG.

---

**DOJANG** - La Régie des Tatamis 🥋
