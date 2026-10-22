import { useState, useEffect } from 'react';

export interface Favorite {
  id: string;
  type: 'athlete' | 'club' | 'competition' | 'sponsor' | 'page';
  name: string;
  path: string;
  icon?: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const stored = localStorage.getItem('dojang_favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('dojang_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    const newFavorite: Favorite = {
      ...favorite,
      id: `fav-${Date.now()}`,
      addedAt: Date.now()
    };
    setFavorites(prev => [newFavorite, ...prev]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const isFavorite = (path: string) => {
    return favorites.some(f => f.path === path);
  };

  const toggleFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    if (isFavorite(favorite.path)) {
      const fav = favorites.find(f => f.path === favorite.path);
      if (fav) removeFavorite(fav.id);
    } else {
      addFavorite(favorite);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
}
