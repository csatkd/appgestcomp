import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconUsers, IconLock } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function ParentsLogin() {
  const { state } = useApp();
  const navigate = useNavigate();
  const toast = useToast();
  const [license, setLicense] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simuler un délai de vérification
    setTimeout(() => {
      const athlete = state.athletes.find(
        (a) => a.license.toLowerCase() === license.trim().toLowerCase()
      );

      if (athlete) {
        // Stocker l'ID de l'athlète dans localStorage
        localStorage.setItem("parent_athlete_id", athlete.id);
        toast(`Bienvenue ! Connecté en tant que parent de ${athlete.firstName} ${athlete.lastName}`);
        navigate("/parents/dashboard");
      } else {
        toast("Numéro de licence non trouvé. Vérifiez la saisie.", "error");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="fade-up mx-auto max-w-2xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.athletes} opacity={0.1} blur={4} />
      
      <div className="panel p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-gold bg-gold/10 mb-6">
            <IconUsers className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-bone mb-3">
            Espace Parents
          </h1>
          <p className="text-dune text-sm sm:text-base">
            Connectez-vous avec le numéro de licence de votre enfant pour accéder à son espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="license" className="label">
              Numéro de Licence
            </label>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dune" />
              <input
                id="license"
                type="text"
                className="input pl-12"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="Ex: FITKD-26-1001"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-2 text-xs text-dune">
              Le numéro de licence sert de mot de passe. Il se trouve sur la carte de licence de votre enfant.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || !license.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-night border-t-transparent rounded-full animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              "Se Connecter"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-husk">
          <div className="bg-bark/50 border border-husk p-4 rounded">
            <p className="text-xs text-dune mb-2 font-semibold">💡 Comment trouver le numéro de licence ?</p>
            <ul className="text-xs text-dune space-y-1">
              <li>• Sur la carte de licence de votre enfant</li>
              <li>• Format : FITKD-26-XXXX (ex: FITKD-26-1001)</li>
              <li>• Demandez à l'entraîneur ou au club</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-dune hover:text-gold transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
