import { useState, useEffect } from 'react';

export interface Favorite {
  id: string;
  path: string;
  label: string;
  icon: string;
  addedAt: string;
}

const STORAGE_KEY = 'dojang_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    const newFavorite: Favorite = {
      ...favorite,
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
    };
    setFavorites((prev) => [...prev, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (path: string) => {
    return favorites.some((f) => f.path === path);
  };

  const toggleFavorite = (favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    if (isFavorite(favorite.path)) {
      const fav = favorites.find((f) => f.path === favorite.path);
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
    toggleFavorite,
  };
}
