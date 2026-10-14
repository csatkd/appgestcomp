import { useState } from 'react';
import { PoomsaeCategoryConfig, PoomsaeCategory, PoomsaeDivision, BeltLevel } from '../../lib/poomsae/types';
import { IconCheck } from '../Icons';

interface CreateCategoryModalProps {
  onSubmit: (category: PoomsaeCategoryConfig) => void;
  onCancel: () => void;
}

export default function CreateCategoryModal({ onSubmit, onCancel }: CreateCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'individuel-reconnu' as PoomsaeCategory,
    division: 'senior' as PoomsaeDivision,
    beltLevel: 'color' as BeltLevel,
    gender: 'Mixed' as 'M' | 'F' | 'Mixed',
    ageMin: 18,
    ageMax: 29,
    teamSize: 1,
    maxParticipants: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category: PoomsaeCategoryConfig = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      division: formData.division,
      beltLevel: formData.beltLevel,
      gender: formData.gender,
      ageMin: formData.ageMin,
      ageMax: formData.ageMax,
      teamSize: formData.type.includes('equipe') ? formData.teamSize : undefined,
      maxParticipants: formData.maxParticipants,
    };

    onSubmit(category);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night/80 flex items-center justify-center p-4">
      <div className="bg-coal border border-husk rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-coal border-b border-husk p-6">
          <h2 className="font-display text-2xl text-bone">Nouvelle catégorie Poomsae</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom de la catégorie */}
          <div>
            <label className="label">Nom de la catégorie</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Senior Hommes Ceintures Noires"
              className="input"
              required
            />
          </div>

          {/* Type de catégorie */}
          <div>
            <label className="label">Type de compétition</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PoomsaeCategory })}
              className="input"
            >
              <option value="individuel-reconnu">Individuel - Formes reconnues</option>
              <option value="individuel-freestyle">Individuel - Freestyle</option>
              <option value="equipe-reconnu">Équipe - Formes reconnues</option>
              <option value="equipe-freestyle">Équipe - Freestyle</option>
            </select>
          </div>

          {/* Division d'âge */}
          <div>
            <label className="label">Division d'âge</label>
            <select
              value={formData.division}
              onChange={(e) => {
                const division = e.target.value as PoomsaeDivision;
                const ageRanges = {
                  cadet: { min: 12, max: 14 },
                  junior: { min: 15, max: 17 },
                  senior: { min: 18, max: 29 },
                  veteran: { min: 30, max: 99 },
                };
                setFormData({
                  ...formData,
                  division,
                  ageMin: ageRanges[division].min,
                  ageMax: ageRanges[division].max,
                });
              }}
              className="input"
            >
              <option value="cadet">Cadet (12-14 ans)</option>
              <option value="junior">Junior (15-17 ans)</option>
              <option value="senior">Senior (18-29 ans)</option>
              <option value="veteran">Vétéran (30+ ans)</option>
            </select>
          </div>

          {/* Niveau de ceinture */}
          <div>
            <label className="label">Niveau de ceinture</label>
            <select
              value={formData.beltLevel}
              onChange={(e) => setFormData({ ...formData, beltLevel: e.target.value as BeltLevel })}
              className="input"
            >
              <option value="color">Ceintures de couleur (9ᵉ-1ᵉʳ Gup)</option>
              <option value="black">Ceintures noires (1ᵉʳ-9ᵉ Dan)</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="label">Genre</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' | 'Mixed' })}
              className="input"
            >
              <option value="M">Hommes</option>
              <option value="F">Femmes</option>
              <option value="Mixed">Mixte</option>
            </select>
          </div>

          {/* Tranche d'âge personnalisée */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Âge minimum</label>
              <input
                type="number"
                value={formData.ageMin}
                onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="99"
              />
            </div>
            <div>
              <label className="label">Âge maximum</label>
              <input
                type="number"
                value={formData.ageMax}
                onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="99"
              />
            </div>
          </div>

          {/* Taille de l'équipe (si équipe) */}
          {formData.type.includes('equipe') && (
            <div>
              <label className="label">Taille de l'équipe</label>
              <input
                type="number"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
                className="input"
                min="2"
                max="10"
              />
            </div>
          )}

          {/* Nombre maximum de participants */}
          <div>
            <label className="label">Nombre maximum de participants</label>
            <input
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              className="input"
              min="1"
              max="200"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-husk">
            <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              <IconCheck className="w-4 h-4" />
              Créer la catégorie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
