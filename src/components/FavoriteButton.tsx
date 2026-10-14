import { useFavorites } from '../hooks/useFavorites';
import { IconStar } from './Icons';
import { useToast } from './ui';

interface FavoriteButtonProps {
  path: string;
  label: string;
  icon?: string;
}

export default function FavoriteButton({ path, label, icon = 'star' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const toast = useToast();

  const isFav = isFavorite(path);

  const handleClick = () => {
    toggleFavorite({ path, label, icon });
    toast(
      isFav ? `${label} retiré des favoris` : `${label} ajouté aux favoris`,
      isFav ? 'info' : 'success'
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-ghost btn-sm ${
        isFav ? 'text-gold border-gold' : 'text-dune'
      }`}
      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <IconStar className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
      <span className="hidden sm:inline">{isFav ? 'Favori' : 'Ajouter'}</span>
    </button>
  );
}
