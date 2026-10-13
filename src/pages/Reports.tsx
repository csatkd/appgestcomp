import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconGrid, IconDownload } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Reports() {
  const { state } = useApp();
  const toast = useToast();
  const [reportType, setReportType] = useState<"athletes" | "clubs" | "matches" | "categories">("athletes");

  // Statistiques globales
  const stats = {
    totalAthletes: state.athletes.length,
    weighedAthletes: state.athletes.filter(a => a.status === "pesé").length,
    totalMatches: Object.values(state.brackets).flat().length,
    completedMatches: Object.values(state.brackets).flat().filter(m => m.status === "termine").length,
    totalClubs: state.clubs.length,
    totalCompetitions: state.competitions.length,
    activeCompetitions: state.competitions.filter(c => c.status === "active").length,
  };

  // Statistiques par catégorie
  const categoryStats = Object.entries(state.brackets).map(([catId, matches]) => {
    const totalMatches = matches.length;
    const completedMatches = matches.filter(m => m.status === "termine").length;
    const athletes = state.athletes.filter(a => a.category === catId);
    return {
      catId,
      totalMatches,
      completedMatches,
      athletes: athletes.length,
    };
  });

  // Statistiques par club
  const clubStats = state.clubs.map(club => {
    const athletes = state.athletes.filter(a => a.club === club.name);
    const weighedAthletes = athletes.filter(a => a.status === "pesé").length;
    return {
      ...club,
      totalAthletes: athletes.length,
      weighedAthletes,
    };
  }).sort((a, b) => b.totalAthletes - a.totalAthletes);

  // Export CSV
  const exportCSV = () => {
    let csv = "";
    let filename = "";

    switch (reportType) {
      case "athletes":
        csv = "Nom,Prénom,Club,Catégorie,Poids,Statut,Licence\n";
        state.athletes.forEach(a => {
          csv += `${a.lastName},${a.firstName},${a.club},${a.category || "N/A"},${a.weight || "N/A"},${a.status},${a.license}\n`;
        });
        filename = "athletes.csv";
        break;

      case "clubs":
        csv = "Nom,Ville,Région,Email,Téléphone,Nb Athlètes\n";
        clubStats.forEach(c => {
          csv += `${c.name},${c.city},${c.region},${c.email},${c.phone},${c.totalAthletes}\n`;
        });
        filename = "clubs.csv";
        break;

      case "matches":
        csv = "Catégorie,Statut,Nb Matchs Total,Nb Matchs Terminés\n";
        categoryStats.forEach(c => {
          csv += `${c.catId},${c.completedMatches === c.totalMatches ? "Terminé" : "En cours"},${c.totalMatches},${c.completedMatches}\n`;
        });
        filename = "matches.csv";
        break;

      case "categories":
        csv = "Catégorie,Nb Athlètes,Nb Matchs,Matchs Terminés\n";
        categoryStats.forEach(c => {
          csv += `${c.catId},${c.athletes},${c.totalMatches},${c.completedMatches}\n`;
        });
        filename = "categories.csv";
        break;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    toast("Rapport exporté avec succès");
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Rapports & Statistiques"
        subtitle="Analyses et exports de données"
        actions={
          <button onClick={exportCSV} className="btn btn-primary btn-sm">
            <IconDownload className="w-4 h-4" />
            Exporter CSV
          </button>
        }
      />

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Athlètes</p>
          <p className="font-display text-3xl text-bone">{stats.totalAthletes}</p>
          <p className="text-sm text-forest mt-1">{stats.weighedAthletes} pesés</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Matchs</p>
          <p className="font-display text-3xl text-bone">{stats.totalMatches}</p>
          <p className="text-sm text-forest mt-1">{stats.completedMatches} terminés</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Clubs</p>
          <p className="font-display text-3xl text-bone">{stats.totalClubs}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-dune mb-2">Compétitions</p>
          <p className="font-display text-3xl text-bone">{stats.totalCompetitions}</p>
          <p className="text-sm text-forest mt-1">{stats.activeCompetitions} actives</p>
        </div>
      </div>

      {/* Sélecteur de rapport */}
      <div className="panel p-6 mb-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Type de rapport
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: "athletes", label: "Athlètes" },
            { id: "clubs", label: "Clubs" },
            { id: "matches", label: "Matchs" },
            { id: "categories", label: "Catégories" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id as any)}
              className={`p-4 border transition-colors ${
                reportType === type.id
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-husk text-dune hover:border-gold/50"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu du rapport */}
      <div className="panel p-6">
        {reportType === "athletes" && (
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
              Liste des Athlètes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-husk">
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Nom</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Club</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Catégorie</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {state.athletes.map((a) => (
                    <tr key={a.id} className="border-b border-husk/50 hover:bg-bark/30">
                      <td className="p-3 text-bone">{a.firstName} {a.lastName}</td>
                      <td className="p-3 text-dune">{a.club}</td>
                      <td className="p-3 text-dune">{a.category || "N/A"}</td>
                      <td className="p-3">
                        <span className={`badge ${
                          a.status === "pesé" ? "text-forest" :
                          a.status === "inscrit" ? "text-gold" : "text-flame"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === "clubs" && (
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
              Statistiques par Club
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-husk">
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Club</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Ville</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Athlètes</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Pesés</th>
                  </tr>
                </thead>
                <tbody>
                  {clubStats.map((c) => (
                    <tr key={c.id} className="border-b border-husk/50 hover:bg-bark/30">
                      <td className="p-3 text-bone">{c.name}</td>
                      <td className="p-3 text-dune">{c.city}</td>
                      <td className="p-3 text-bone">{c.totalAthletes}</td>
                      <td className="p-3 text-forest">{c.weighedAthletes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === "matches" && (
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
              Progression des Matchs par Catégorie
            </h3>
            <div className="space-y-4">
              {categoryStats.map((c) => (
                <div key={c.catId} className="border border-husk p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-bone">{c.catId}</p>
                    <p className="text-sm text-dune">
                      {c.completedMatches}/{c.totalMatches} matchs
                    </p>
                  </div>
                  <div className="w-full bg-husk rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all"
                      style={{ width: `${c.totalMatches > 0 ? (c.completedMatches / c.totalMatches) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === "categories" && (
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
              Statistiques par Catégorie
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-husk">
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Catégorie</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Athlètes</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Matchs</th>
                    <th className="text-left p-3 font-mono text-xs uppercase tracking-wider text-dune">Terminés</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map((c) => (
                    <tr key={c.catId} className="border-b border-husk/50 hover:bg-bark/30">
                      <td className="p-3 text-bone">{c.catId}</td>
                      <td className="p-3 text-bone">{c.athletes}</td>
                      <td className="p-3 text-bone">{c.totalMatches}</td>
                      <td className="p-3 text-forest">{c.completedMatches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
