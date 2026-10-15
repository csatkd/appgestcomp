# Images d'Arrière-Plan

Ce document décrit le système d'images d'arrière-plan intégré à chaque page de l'application DOJANG.

## 📸 Vue d'ensemble

Chaque page de l'application dispose d'une image d'arrière-plan unique qui renforce l'identité visuelle et crée une atmosphère immersive. Les images sont générées par IA avec une esthétique africaine et sportive cohérente.

## 🎨 Images par Page

### 1. **Dashboard** (Tableau de bord)
- **Image** : Pattern kente géométrique
- **URL** : `0c30dde7-7aa2-493e-855b-20e6e276a67e`
- **Opacité** : 12%
- **Flou** : 3px
- **Thème** : Motifs textiles africains traditionnels

### 2. **Athletes** (Athlètes)
- **Image** : Silhouette d'athlète en action
- **URL** : `38aa8328-e82c-457c-a6f8-e98d648aab22`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Dynamisme sportif

### 3. **WeighIn** (Pesée)
- **Image** : Balance de pesée professionnelle
- **URL** : `9a36ff99-1c76-4c69-a168-20ccdf8ac9aa`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Précision médicale

### 4. **Brackets** (Tirages au sort)
- **Image** : Visualisation de bracket/tournoi
- **URL** : `6d7c4d26-b344-4a11-a7b2-544b266f0f53`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Structure compétitive

### 5. **Live** (Live Scoring)
- **Image** : Combat en action
- **URL** : `de993668-1277-4aa8-93ad-3123d42a1f64`
- **Opacité** : 10% (8% pour l'écran de combat)
- **Flou** : 3px (4px pour l'écran de combat)
- **Thème** : Intensité sportive

### 6. **Results** (Résultats)
- **Image** : Trophée et podium
- **URL** : `59125f0d-2349-43dd-8816-56b9419e47b6`
- **Opacité** : 12%
- **Flou** : 3px
- **Thème** : Victoire et achievement

### 7. **Claims** (Réclamations)
- **Image** : Drapeau d'arbitre
- **URL** : `cfadc7ef-672b-4f03-b7ec-eb5c0d0b909c`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Officiation et contestation

### 8. **TvMode** (Mode TV)
- **Image** : Écran de diffusion
- **URL** : `12dbc5ff-e2cb-4a1e-9b75-16e6e51c1c98`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Diffusion professionnelle

### 9. **QrPresence** (QR Présences)
- **Image** : Scanner QR code
- **URL** : `80b66c10-9133-4cb6-99ab-fc7edadcc77b`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Technologie et validation

### 10. **Competitions** (Compétitions)
- **Image** : Carte de compétitions multiples
- **URL** : `b98fd7f3-c58f-463f-ade2-8fb8089bd872`
- **Opacité** : 10%
- **Flou** : 3px
- **Thème** : Multi-événements

## 🛠️ Architecture Technique

### Composant PageBackground

```tsx
// src/components/PageBackground.tsx
interface PageBackgroundProps {
  imageUrl: string;
  opacity?: number;  // 0-1, défaut 0.15
  blur?: number;     // pixels, défaut 2
}
```

**Fonctionnalités** :
- Image de fond avec couverture complète
- Overlay gradient pour la lisibilité
- Pattern mud-bg subtil par-dessus
- Position fixe (ne scroll pas)
- Z-index négatif (derrière le contenu)

### Configuration des URLs

```tsx
// src/config/backgrounds.ts
export const PAGE_BACKGROUNDS = {
  dashboard: 'https://image.qwenlm.ai/generated-images/...',
  athletes: 'https://image.qwenlm.ai/generated-images/...',
  // ... autres pages
} as const;
```

### Intégration dans les Pages

```tsx
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Dashboard() {
  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground 
        imageUrl={PAGE_BACKGROUNDS.dashboard} 
        opacity={0.12} 
        blur={3} 
      />
      {/* Contenu de la page */}
    </div>
  );
}
```

## 🎯 Personnalisation

### Modifier l'opacité

Ajustez le paramètre `opacity` pour rendre l'image plus ou moins visible :

```tsx
<PageBackground 
  imageUrl={PAGE_BACKGROUNDS.dashboard} 
  opacity={0.08}  // Plus subtil
  blur={3} 
/>
```

**Recommandations** :
- `0.08 - 0.10` : Très subtil, idéal pour les pages avec beaucoup de contenu
- `0.10 - 0.12` : Équilibré, bon pour la plupart des pages
- `0.12 - 0.15` : Plus visible, pour les pages avec moins de contenu

### Modifier le flou

Ajustez le paramètre `blur` pour contrôler la netteté :

```tsx
<PageBackground 
  imageUrl={PAGE_BACKGROUNDS.dashboard} 
  opacity={0.12} 
  blur={5}  // Plus flou
/>
```

**Recommandations** :
- `2px` : Image relativement nette
- `3px` : Équilibré (défaut)
- `4-5px` : Plus flou, mieux pour la lisibilité du contenu

### Remplacer une image

1. Générez une nouvelle image avec Qwen AI ou utilisez votre propre image
2. Mettez à jour l'URL dans `src/config/backgrounds.ts` :

```tsx
export const PAGE_BACKGROUNDS = {
  dashboard: 'https://votre-nouvelle-image.png',
  // ...
} as const;
```

### Ajouter une image pour une nouvelle page

1. Ajoutez l'URL dans `src/config/backgrounds.ts` :

```tsx
export const PAGE_BACKGROUNDS = {
  // ... pages existantes
  newPage: 'https://image.qwenlm.ai/generated-images/...',
} as const;
```

2. Importez et utilisez dans votre page :

```tsx
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function NewPage() {
  return (
    <div>
      <PageBackground 
        imageUrl={PAGE_BACKGROUNDS.newPage} 
        opacity={0.1} 
        blur={3} 
      />
      {/* Contenu */}
    </div>
  );
}
```

## 🎨 Guide de Génération d'Images

### Prompts Recommandés

Pour maintenir la cohérence visuelle, utilisez ces éléments dans vos prompts :

**Palette de couleurs** :
- Or (#f0a41c)
- Rouge flamme (#e2472e)
- Vert forêt (#23a06a)
- Bleu chong (#3a72e0)
- Fond sombre (night/coal)

**Style** :
- "African aesthetic"
- "Professional sports photography"
- "Dark moody background"
- "Golden accent lighting"
- "High contrast cinematic"
- "4K quality"

**Exemples de prompts** :

```
Abstract geometric pattern inspired by West African kente cloth, 
golden yellow, deep red, forest green and black stripes in diagonal 
arrangement, subtle texture overlay, dark background, professional 
sports event aesthetic, 4K quality, seamless pattern
```

```
Silhouette of taekwondo athlete in dynamic kicking pose, African 
features, dramatic lighting with golden and red accents, dark moody 
background, professional sports photography style, high contrast, 
cinematic
```

### Dimensions Recommandées

- **Largeur** : 1920px
- **Hauteur** : 1080px
- **Ratio** : 16:9
- **Format** : PNG ou JPG

## 📊 Performance

### Optimisation

Les images sont :
- Chargées en arrière-plan (z-index négatif)
- Floutées pour réduire la charge visuelle
- Superposées avec des overlays pour améliorer la lisibilité
- Non interactives (pointer-events: none)

### Taille des Fichiers

Les images générées font environ 200-500 KB chacune. Pour optimiser :

1. **Compression** : Utilisez des outils comme TinyPNG
2. **Format WebP** : Convertissez en WebP pour une meilleure compression
3. **Lazy loading** : Les images sont déjà chargées de manière optimale

### Impact sur les Performances

- **Premier chargement** : ~2-3 MB total (10 images)
- **Cache navigateur** : Les images sont mises en cache après le premier chargement
- **Impact CPU** : Minimal (flou CSS, pas de traitement JavaScript)

## 🔧 Dépannage

### L'image ne s'affiche pas

1. Vérifiez l'URL dans `src/config/backgrounds.ts`
2. Vérifiez que le composant `PageBackground` est bien importé
3. Vérifiez la console pour les erreurs 404

### L'image est trop visible

Réduisez l'opacité :
```tsx
<PageBackground opacity={0.08} />
```

### L'image est trop floue

Réduisez le flou :
```tsx
<PageBackground blur={2} />
```

### Le contenu est difficile à lire

Augmentez le flou et réduisez l'opacité :
```tsx
<PageBackground opacity={0.08} blur={5} />
```

## 📝 Notes

- Les images sont hébergées sur `image.qwenlm.ai`
- Les URLs sont permanentes et ne changent pas
- Le composant est responsive et s'adapte à toutes les tailles d'écran
- Les images sont optimisées pour les écrans haute résolution (Retina)

## 🚀 Améliorations Futures

- [ ] Support WebP pour une meilleure compression
- [ ] Lazy loading des images
- [ ] Mode sombre/clair pour les images
- [ ] Images alternatives pour mobile
- [ ] Animation subtile sur les images (parallax)

---

**DOJANG** - La Régie des Tatamis 🥋
