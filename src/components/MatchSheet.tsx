import { useApp } from "../lib/store";
import { athleteName, classLabel } from "../lib/data";
import { totalScore } from "../lib/bracket";

interface MatchSheetProps {
  matchId: string;
  catId: string;
}

export default function MatchSheet({ matchId, catId }: MatchSheetProps) {
  const { state } = useApp();

  const match = state.brackets[catId]?.find((m) => m.id === matchId);
  if (!match) return null;

  const athleteA = state.athletes.find((a) => a.id === match.a);
  const athleteB = state.athletes.find((a) => a.id === match.b);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-bone text-night p-8 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="border-b-4 border-double border-night pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold uppercase">{state.event.name}</h1>
            <p className="text-sm mt-1">{state.event.venue}</p>
            <p className="text-sm">{state.event.date}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">FEUILLE DE MATCH</p>
            <p className="text-sm">Match #{match.id.slice(-6)}</p>
          </div>
        </div>
      </div>

      {/* Informations du match */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div>
          <p className="font-bold">Catégorie:</p>
          <p>{classLabel(match.catId)}</p>
        </div>
        <div>
          <p className="font-bold">Tour:</p>
          <p>
            {match.round === 0
              ? "Préliminaire"
              : match.round === 1
                ? "Quart de finale"
                : match.round === 2
                  ? "Demi-finale"
                  : "Finale"}
          </p>
        </div>
        <div>
          <p className="font-bold">Statut:</p>
          <p className="uppercase">
            {match.status === "pret"
              ? "Prêt"
              : match.status === "encours"
                ? "En cours"
                : match.status === "termine"
                  ? "Terminé"
                  : "En attente"}
          </p>
        </div>
      </div>

      {/* Athlètes */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Chong (Bleu) */}
        <div className="border-2 border-blue-600 p-4">
          <div className="bg-blue-600 text-bone px-3 py-1 -mx-4 -mt-4 mb-3 font-bold uppercase">
            CHONG (BLEU)
          </div>
          {athleteA ? (
            <>
              <p className="text-xl font-bold">{athleteA.firstName} {athleteA.lastName}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p><span className="font-semibold">Club:</span> {athleteA.club}</p>
                <p><span className="font-semibold">Licence:</span> {athleteA.license}</p>
                <p><span className="font-semibold">Poids:</span> {athleteA.weight} kg</p>
                <p><span className="font-semibold">Coach:</span> _______________</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Athlète non défini</p>
          )}
        </div>

        {/* Hong (Rouge) */}
        <div className="border-2 border-red-600 p-4">
          <div className="bg-red-600 text-bone px-3 py-1 -mx-4 -mt-4 mb-3 font-bold uppercase">
            HONG (ROUGE)
          </div>
          {athleteB ? (
            <>
              <p className="text-xl font-bold">{athleteB.firstName} {athleteB.lastName}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p><span className="font-semibold">Club:</span> {athleteB.club}</p>
                <p><span className="font-semibold">Licence:</span> {athleteB.license}</p>
                <p><span className="font-semibold">Poids:</span> {athleteB.weight} kg</p>
                <p><span className="font-semibold">Coach:</span> _______________</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Athlète non défini</p>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="border-2 border-night p-4 mb-6">
        <h2 className="text-xl font-bold mb-4 uppercase text-center">Scores</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-semibold mb-2">Round 1</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {match.status !== "attente" ? totalScore(match, "a") : "-"}
                </p>
                <p className="text-xs">CHONG</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {match.status !== "attente" ? totalScore(match, "b") : "-"}
                </p>
                <p className="text-xs">HONG</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Round 2</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-blue-600">-</p>
                <p className="text-xs">CHONG</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">-</p>
                <p className="text-xs">HONG</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Round 3</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-blue-600">-</p>
                <p className="text-xs">CHONG</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">-</p>
                <p className="text-xs">HONG</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gam-jeom */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="border border-night p-3">
          <p className="font-bold mb-2">Gam-jeom CHONG:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className={`w-6 h-6 border border-night ${
                  n <= match.gamA ? "bg-night" : ""
                }`}
              />
            ))}
          </div>
        </div>
        <div className="border border-night p-3">
          <p className="font-bold mb-2">Gam-jeom HONG:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className={`w-6 h-6 border border-night ${
                  n <= match.gamB ? "bg-night" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vainqueur */}
      {match.status === "termine" && match.winner && (
        <div className="border-4 border-double border-night p-4 mb-6 text-center">
          <p className="text-2xl font-bold uppercase mb-2">Vainqueur</p>
          <p className="text-3xl font-bold">
            {match.winner === "a"
              ? `${athleteA?.firstName} ${athleteA?.lastName}`
              : `${athleteB?.firstName} ${athleteB?.lastName}`}
          </p>
          <p className="text-sm mt-2">
            Score final: {totalScore(match, "a")} - {totalScore(match, "b")}
          </p>
        </div>
      )}

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 mt-12 pt-6 border-t-2 border-night">
        <div className="text-center">
          <div className="border-b border-night mb-2 h-12"></div>
          <p className="text-xs font-semibold">Arbitre Central</p>
          <p className="text-xs">Nom & Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b border-night mb-2 h-12"></div>
          <p className="text-xs font-semibold">Juge 1</p>
          <p className="text-xs">Nom & Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b border-night mb-2 h-12"></div>
          <p className="text-xs font-semibold">Juge 2</p>
          <p className="text-xs">Nom & Signature</p>
        </div>
      </div>

      {/* Bouton d'impression */}
      <div className="mt-8 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-night text-bone font-bold uppercase hover:bg-night/80"
        >
          Imprimer la Feuille de Match
        </button>
      </div>

      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
