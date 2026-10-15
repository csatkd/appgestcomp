interface PageBackgroundProps {
  imageUrl: string;
  opacity?: number;
  blur?: number;
}

/**
 * Composant d'arrière-plan de page avec image
 * @param imageUrl - URL de l'image de fond
 * @param opacity - Opacité de l'image (0-1, défaut 0.15)
 * @param blur - Intensité du flou en pixels (défaut 2)
 */
export default function PageBackground({ 
  imageUrl, 
  opacity = 0.15, 
  blur = 2 
}: PageBackgroundProps) {
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`,
          opacity: opacity,
          filter: `blur(${blur}px)`,
        }}
      />
      
      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/95 to-night" />
      
      {/* Pattern subtil par-dessus */}
      <div className="absolute inset-0 mud-bg opacity-20" />
    </div>
  );
}
