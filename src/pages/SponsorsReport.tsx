import { useApp } from "../lib/store";
import { IconDownload, IconTrendUp, IconAlert } from "../components/Icons";

export default function SponsorsReport() {
  const { state } = useApp();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Statistiques globales
  const totalSponsors = state.sponsors.length;
  const activeSponsors = state.sponsors.filter((s) => s.status === "actif").length;
  const pendingSponsors = state.sponsors.filter((s) => s.status === "en_attente").length;
  const expiredSponsors = state.sponsors.filter((s) => s.status === "expire").length;

  // Statistiques par niveau
  const goldSponsors = state.sponsors.filter((s) => s.level === "or").length;
  const silverSponsors = state.sponsors.filter((s) => s.level === "argent").length;
  const bronzeSponsors = state.sponsors.filter((s) => s.level === "bronze").length;

  // Statistiques financières
  const totalAmount = state.sponsors.reduce((sum, s) => sum + (s.amount || 0), 0);
  const activeAmount = state.sponsors
    .filter((s) => s.status === "actif")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  // Statistiques de paiements
  const allPayments = state.sponsors.flatMap((s) => s.payments || []);
  const paidPayments = allPayments.filter((p) => p.status === "paye");
  const pendingPayments = allPayments.filter((p) => p.status === "en_attente");
  const overduePayments = allPayments.filter((p) => p.status === "en_retard");

  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  // Alertes
  const expiringSponsors = state.sponsors.filter((s) => {
    if (s.status !== "actif" || !s.endDate) return false;
    const endDate = new Date(s.endDate);
    const now = new Date();
    const daysUntilExpiry = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const exportReport = () => {
    const report = {
      date: new Date().toISOString(),
      summary: {
        totalSponsors,
        activeSponsors,
        pendingSponsors,
        expiredSponsors,
        totalAmount,
        activeAmount,
        totalPaid,
        totalPending,
        totalOverdue,
      },
      sponsors: state.sponsors,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-sponsors-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-bone">
            Rapport Sponsors
          </h1>
          <p className="mt-2 text-dune">
            Analyse détaillée des sponsors et partenaires
          </p>
        </div>
        <button onClick={exportReport} className="btn btn-primary">
          <IconDownload className="w-5 h-5" />
          Exporter le rapport
        </button>
      </div>

      {/* Alertes */}
      {expiringSponsors.length > 0 && (
        <div className="mb-6 panel border-l-4 border-l-gold p-4">
          <div className="flex items-start gap-3">
            <IconAlert className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-bone mb-1">
                Contrats expirant bientôt
              </h3>
              <p className="text-sm text-dune">
                {expiringSponsors.length} sponsor(s) avec un contrat expirant dans les 30 prochains jours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques globales */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="panel p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs uppercase tracking-wider text-dune">
              Total sponsors
            </p>
            <IconTrendUp className="w-5 h-5 text-forest" />
          </div>
          <p className="font-display text-4xl text-bone">{totalSponsors}</p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-forest">
              ✓ {activeSponsors} actifs
            </p>
            <p className="text-gold">
              ⏳ {pendingSponsors} en attente
            </p>
            <p className="text-dune">
              ✗ {expiredSponsors} expirés
            </p>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs uppercase tracking-wider text-dune">
              Montant total
            </p>
            <IconTrendUp className="w-5 h-5 text-gold" />
          </div>
          <p className="font-display text-3xl text-gold">
            {formatAmount(totalAmount)}
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-forest">
              ✓ {formatAmount(activeAmount)} actifs
            </p>
            <p className="text-dune">
              Moyenne: {formatAmount(totalSponsors > 0 ? totalAmount / totalSponsors : 0)}
            </p>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-xs uppercase tracking-wider text-dune">
              Répartition par niveau
            </p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-500">Or</span>
              <span className="font-semibold text-bone">{goldSponsors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Argent</span>
              <span className="font-semibold text-bone">{silverSponsors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-600">Bronze</span>
              <span className="font-semibold text-bone">{bronzeSponsors}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques de paiements */}
      <div className="mb-8 panel p-6">
        <h2 className="font-display text-2xl text-bone mb-4">
          Suivi des paiements
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-bark/50 p-4 rounded">
            <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">
              Payés
            </p>
            <p className="font-display text-2xl text-forest">
              {formatAmount(totalPaid)}
            </p>
            <p className="text-sm text-dune mt-1">
              {paidPayments.length} paiement(s)
            </p>
          </div>
          <div className="bg-bark/50 p-4 rounded">
            <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">
              En attente
            </p>
            <p className="font-display text-2xl text-gold">
              {formatAmount(totalPending)}
            </p>
            <p className="text-sm text-dune mt-1">
              {pendingPayments.length} paiement(s)
            </p>
          </div>
          <div className="bg-bark/50 p-4 rounded">
            <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">
              En retard
            </p>
            <p className="font-display text-2xl text-flame">
              {formatAmount(totalOverdue)}
            </p>
            <p className="text-sm text-dune mt-1">
              {overduePayments.length} paiement(s)
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-dune">
            Taux de recouvrement:{" "}
            <span className="font-semibold text-forest">
              {allPayments.length > 0
                ? Math.round((paidPayments.length / allPayments.length) * 100)
                : 0}
              %
            </span>
          </p>
        </div>
      </div>

      {/* Liste détaillée des sponsors */}
      <div className="panel p-6">
        <h2 className="font-display text-2xl text-bone mb-4">
          Détail par sponsor
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-husk">
                <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Sponsor
                </th>
                <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Niveau
                </th>
                <th className="text-left py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Statut
                </th>
                <th className="text-right py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Montant
                </th>
                <th className="text-right py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  Payé
                </th>
                <th className="text-right py-3 px-2 font-mono text-xs uppercase tracking-wider text-dune">
                  En attente
                </th>
              </tr>
            </thead>
            <tbody>
              {state.sponsors.map((sponsor) => {
                const sponsorPayments = sponsor.payments || [];
                const paid = sponsorPayments
                  .filter((p) => p.status === "paye")
                  .reduce((sum, p) => sum + p.amount, 0);
                const pending = sponsorPayments
                  .filter((p) => p.status === "en_attente" || p.status === "en_retard")
                  .reduce((sum, p) => sum + p.amount, 0);

                return (
                  <tr key={sponsor.id} className="border-b border-husk/50 hover:bg-bark/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-bark flex items-center justify-center">
                            <span className="font-display text-lg text-gold">
                              {sponsor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-bone">{sponsor.name}</p>
                          <p className="text-xs text-dune">{sponsor.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`badge ${
                          sponsor.level === "or"
                            ? "text-yellow-500"
                            : sponsor.level === "argent"
                            ? "text-gray-400"
                            : "text-orange-600"
                        }`}
                      >
                        {sponsor.level === "or"
                          ? "Or"
                          : sponsor.level === "argent"
                          ? "Argent"
                          : "Bronze"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`badge ${
                          sponsor.status === "actif"
                            ? "text-forest"
                            : sponsor.status === "en_attente"
                            ? "text-gold"
                            : "text-dune"
                        }`}
                      >
                        {sponsor.status === "actif"
                          ? "Actif"
                          : sponsor.status === "en_attente"
                          ? "En attente"
                          : "Expiré"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-bone">
                      {formatAmount(sponsor.amount || 0)}
                    </td>
                    <td className="py-3 px-2 text-right text-forest">
                      {formatAmount(paid)}
                    </td>
                    <td className="py-3 px-2 text-right text-gold">
                      {formatAmount(pending)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
