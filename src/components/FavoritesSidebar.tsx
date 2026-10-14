import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { IconStar, IconX } from './Icons';

export default function FavoritesSidebar() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-husk py-3">
      <div className="px-5 pb-2 flex items-center gap-2">
        <IconStar className="h-4 w-4 text-gold" />
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
          Favoris
        </p>
      </div>
      <div className="space-y-0.5">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="group flex items-center gap-2 px-5 py-2 hover:bg-bark/50 cursor-pointer transition-colors"
            onClick={() => navigate(fav.path)}
          >
            <span className="flex-1 text-sm text-bone truncate">
              {fav.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(fav.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-dune hover:text-flame transition-all"
              title="Retirer des favoris"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
