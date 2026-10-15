import { useState, useEffect } from 'react';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

const COLOR_BLIND_FILTERS: Record<ColorBlindMode, string> = {
  none: 'none',
  protanopia: 'url(#protanopia)',
  deuteranopia: 'url(#deuteranopia)',
  tritanopia: 'url(#tritanopia)',
  achromatopsia: 'grayscale(100%)',
};

export function useAccessibility() {
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>(() => {
    const stored = localStorage.getItem('accessibility_colorBlindMode');
    return (stored as ColorBlindMode) || 'none';
  });

  const [highContrast, setHighContrast] = useState(() => {
    const stored = localStorage.getItem('accessibility_highContrast');
    return stored === 'true';
  });

  const [largeText, setLargeText] = useState(() => {
    const stored = localStorage.getItem('accessibility_largeText');
    return stored === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem('accessibility_reducedMotion');
    return stored === 'true';
  });

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('accessibility_colorBlindMode', colorBlindMode);
  }, [colorBlindMode]);

  useEffect(() => {
    localStorage.setItem('accessibility_highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessibility_largeText', String(largeText));
  }, [largeText]);

  useEffect(() => {
    localStorage.setItem('accessibility_reducedMotion', String(reducedMotion));
  }, [reducedMotion]);

  // Appliquer les styles globaux
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [highContrast, largeText, reducedMotion]);

  return {
    colorBlindMode,
    setColorBlindMode,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    reducedMotion,
    setReducedMotion,
  };
}
