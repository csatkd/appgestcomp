import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconFile, IconDownload } from "../components/Icons";
import { athleteName, classLabel } from "../lib/data";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function CompetitionReport() {
  const { state } = useApp();
  const toast = useToast();

  const generateReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast("Veuillez autoriser les popups pour générer le rapport", "error");
      return;
    }

    const totalMatches = Object.values(state.brackets).flat().length;
    const completedMatches = Object.values(state.brackets)
      .flat()
      .filter((m) => m.status === "termine").length;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport - ${state.event.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: white;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 4px solid #f0a41c;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 32px;
      font-weight: bold;
      color: #14100a;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #14100a;
      border-left: 4px solid #f0a41c;
      padding-left: 15px;
      margin-bottom: 15px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      border: 2px solid #ddd;
      padding: 20px;
      text-align: center;
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #f0a41c;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f0a41c;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    .podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 20px;
      margin: 30px 0;
    }
    .podium-place {
      text-align: center;
      padding: 20px;
      border: 2px solid;
    }
    .gold { border-color: #f0a41c; background: #fff9e6; }
    .silver { border-color: #c0c0c0; background: #f5f5f5; }
    .bronze { border-color: #cd7f32; background: #fdf5e6; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Rapport Officiel de Compétition</div>
    <div class="subtitle">${state.event.name}</div>
    <div class="subtitle">${state.event.venue} - ${state.event.date}</div>
  </div>

  <div class="section">
    <div class="section-title">Statistiques Générales</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${state.athletes.length}</div>
        <div class="stat-label">Athlètes inscrits</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${state.clubs.length}</div>
        <div class="stat-label">Clubs participants</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${completedMatches}/${totalMatches}</div>
        <div class="stat-label">Combats disputés</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Résultats par Catégorie</div>
    ${Object.entries(state.results)
      .map(
        ([catId, result]) => `
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 20px; margin-bottom: 15px; color: #14100a;">${classLabel(catId)}</h3>
        <div class="podium">
          <div class="podium-place silver">
            <div style="font-size: 24px; font-weight: bold;">2ème</div>
            <div style="font-size: 16px; margin-top: 10px;">${athleteName(state.athletes, result.silver)}</div>
          </div>
          <div class="podium-place gold">
            <div style="font-size: 32px; font-weight: bold;">1er</div>
            <div style="font-size: 18px; margin-top: 10px;">${athleteName(state.athletes, result.gold)}</div>
          </div>
          <div class="podium-place bronze">
            <div style="font-size: 24px; font-weight: bold;">3ème</div>
            <div style="font-size: 16px; margin-top: 10px;">${result.bronzes[0] ? athleteName(state.athletes, result.bronzes[0]) : "-"}</div>
          </div>
        </div>
      </div>
    `
      )
      .join("")}
  </div>

  <div class="section">
    <div class="section-title">Classement des Clubs</div>
    <table>
      <thead>
        <tr>
          <th>Rang</th>
          <th>Club</th>
          <th>Or</th>
          <th>Argent</th>
          <th>Bronze</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const clubStats = new Map();
          Object.values(state.results).forEach((result) => {
            const goldAthlete = state.athletes.find((a) => a.id === result.gold);
            const silverAthlete = state.athletes.find((a) => a.id === result.silver);
            const bronzeAthlete = state.athletes.find((a) => a.id === result.bronzes[0]);

            if (goldAthlete) {
              const stats = clubStats.get(goldAthlete.club) || { g: 0, s: 0, b: 0, pts: 0 };
              stats.g++;
              stats.pts += 5;
              clubStats.set(goldAthlete.club, stats);
            }
            if (silverAthlete) {
              const stats = clubStats.get(silverAthlete.club) || { g: 0, s: 0, b: 0, pts: 0 };
              stats.s++;
              stats.pts += 3;
              clubStats.set(silverAthlete.club, stats);
            }
            if (bronzeAthlete) {
              const stats = clubStats.get(bronzeAthlete.club) || { g: 0, s: 0, b: 0, pts: 0 };
              stats.b++;
              stats.pts += 1;
              clubStats.set(bronzeAthlete.club, stats);
            }
          });

          return Array.from(clubStats.entries())
            .sort((a, b) => b[1].pts - a[1].pts)
            .map(
              ([club, stats], index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${club}</td>
              <td>${stats.g}</td>
              <td>${stats.s}</td>
              <td>${stats.b}</td>
              <td><strong>${stats.pts}</strong></td>
            </tr>
          `
            )
            .join("");
        })()}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Rapport généré le ${new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
    <p>DOJANG - Régie de compétition Taekwondo FITKD Côte d'Ivoire</p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="padding: 15px 30px; font-size: 16px; cursor: pointer; background: #f0a41c; color: white; border: none; border-radius: 5px;">
      Imprimer le Rapport
    </button>
  </div>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    toast("Rapport généré avec succès");
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.08} blur={3} />
      <PageHead
        title="Rapport de Compétition"
        subtitle="Rapport officiel et statistiques"
        actions={
          <button onClick={generateReport} className="btn btn-primary btn-sm">
            <IconDownload className="w-4 h-4" />
            Générer le Rapport
          </button>
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Athlètes
          </p>
          <p className="font-display text-3xl text-bone mt-2">{state.athletes.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Clubs
          </p>
          <p className="font-display text-3xl text-bone mt-2">{state.clubs.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Combats
          </p>
          <p className="font-display text-3xl text-bone mt-2">
            {Object.values(state.brackets).flat().filter((m) => m.status === "termine").length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Catégories
          </p>
          <p className="font-display text-3xl text-bone mt-2">
            {Object.keys(state.results).length}
          </p>
        </div>
      </div>

      {/* Résultats */}
      <div className="panel p-6 mb-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Podiums Officialisés
        </h3>
        {Object.keys(state.results).length === 0 ? (
          <p className="text-dune text-center py-8">
            Aucun résultat officialisé pour le moment
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(state.results).map(([catId, result]) => (
              <div key={catId} className="border border-husk p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-gold mb-2">
                  {classLabel(catId)}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-dune">Or</p>
                    <p className="font-semibold text-bone">
                      {athleteName(state.athletes, result.gold)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dune">Argent</p>
                    <p className="font-semibold text-bone">
                      {athleteName(state.athletes, result.silver)}
                    </p>
                  </div>
                  <div>
                    <p className="text-dune">Bronze</p>
                    <p className="font-semibold text-bone">
                      {result.bronzes[0] ? athleteName(state.athletes, result.bronzes[0]) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="panel p-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Informations de l'Événement
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold text-dune">Nom:</span>{" "}
            <span className="text-bone">{state.event.name}</span>
          </p>
          <p>
            <span className="font-semibold text-dune">Lieu:</span>{" "}
            <span className="text-bone">{state.event.venue}</span>
          </p>
          <p>
            <span className="font-semibold text-dune">Date:</span>{" "}
            <span className="text-bone">{state.event.date}</span>
          </p>
          <p>
            <span className="font-semibold text-dune">Aires de combat:</span>{" "}
            <span className="text-bone">{state.event.arenas}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
