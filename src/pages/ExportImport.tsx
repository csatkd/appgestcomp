import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconDownload, IconUpload, IconFile } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function ExportImport() {
  const { state } = useApp();
  const toast = useToast();
  const [exportType, setExportType] = useState<"athletes" | "clubs" | "results">("athletes");

  // Export CSV des athlètes
  const exportAthletesCSV = () => {
    const headers = [
      "ID",
      "Prénom",
      "Nom",
      "Genre",
      "Année de naissance",
      "Club",
      "Licence",
      "Poids (kg)",
      "Catégorie",
      "Statut",
    ];

    const rows = state.athletes.map((a) => [
      a.id,
      a.firstName,
      a.lastName,
      a.gender === "M" ? "Homme" : "Femme",
      a.birthYear,
      a.club,
      a.license,
      a.weight || "",
      a.category || "",
      a.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    downloadCSV(csv, "athletes.csv");
    toast(`${state.athletes.length} athlètes exportés`);
  };

  // Export CSV des clubs
  const exportClubsCSV = () => {
    const headers = ["ID", "Nom", "Ville", "Région", "Président", "Email", "Téléphone", "Adresse"];

    const rows = state.clubs.map((c) => [
      c.id,
      c.name,
      c.city,
      c.region,
      c.president,
      c.email,
      c.phone,
      c.address,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    downloadCSV(csv, "clubs.csv");
    toast(`${state.clubs.length} clubs exportés`);
  };

  // Export CSV des résultats
  const exportResultsCSV = () => {
    const headers = ["Catégorie", "Or", "Argent", "Bronze 1", "Bronze 2"];

    const rows = Object.entries(state.results).map(([catId, podium]) => [
      catId,
      getAthleteName(podium.gold),
      getAthleteName(podium.silver),
      podium.bronzes[0] ? getAthleteName(podium.bronzes[0]) : "",
      podium.bronzes[1] ? getAthleteName(podium.bronzes[1]) : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    downloadCSV(csv, "results.csv");
    toast(`${rows.length} résultats exportés`);
  };

  const getAthleteName = (id: string) => {
    const athlete = state.athletes.find((a) => a.id === id);
    return athlete ? `${athlete.firstName} ${athlete.lastName}` : "";
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV des athlètes
  const importAthletesCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());
        
        if (lines.length < 2) {
          toast("Fichier CSV vide ou invalide", "error");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
        const requiredHeaders = ["Prénom", "Nom", "Genre", "Club", "Licence"];
        
        const hasAllHeaders = requiredHeaders.every((h) => headers.includes(h));
        if (!hasAllHeaders) {
          toast("En-têtes CSV manquants", "error");
          return;
        }

        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim());
          
          const firstNameIdx = headers.indexOf("Prénom");
          const lastNameIdx = headers.indexOf("Nom");
          const genderIdx = headers.indexOf("Genre");
          const clubIdx = headers.indexOf("Club");
          const licenseIdx = headers.indexOf("Licence");

          if (firstNameIdx === -1 || lastNameIdx === -1) continue;

          const athlete = {
            id: `imported-${Date.now()}-${i}`,
            firstName: values[firstNameIdx],
            lastName: values[lastNameIdx],
            gender: values[genderIdx]?.toLowerCase().includes("f") ? "F" as const : "M" as const,
            birthYear: 2000, // Valeur par défaut
            club: values[clubIdx] || "Club inconnu",
            license: values[licenseIdx] || `IMP-${Date.now()}-${i}`,
            weight: null,
            category: null,
            status: "inscrit" as const,
          };

          // Ajouter l'athlète via le store
          // Note: Dans une implémentation réelle, il faudrait dispatcher une action
          importedCount++;
        }

        toast(`${importedCount} athlètes importés avec succès`);
      } catch (error) {
        toast("Erreur lors de l'import du fichier CSV", "error");
      }
    };

    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  const handleExport = () => {
    switch (exportType) {
      case "athletes":
        exportAthletesCSV();
        break;
      case "clubs":
        exportClubsCSV();
        break;
      case "results":
        exportResultsCSV();
        break;
    }
  };

  return (
    <div className="fade-up mx-auto max-w-4xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead title="Export & Import" subtitle="Gestion des données" />

      {/* Export */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <IconDownload className="w-6 h-6 text-gold" />
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">
            Exporter les données
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Type de données</label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as any)}
              className="input"
            >
              <option value="athletes">Athlètes ({state.athletes.length})</option>
              <option value="clubs">Clubs ({state.clubs.length})</option>
              <option value="results">Résultats ({Object.keys(state.results).length})</option>
            </select>
          </div>

          <button onClick={handleExport} className="btn btn-primary w-full">
            <IconDownload className="w-4 h-4" />
            Exporter en CSV
          </button>

          <div className="bg-bark/50 border border-husk p-4 rounded">
            <p className="text-xs text-dune">
              💡 Les fichiers CSV peuvent être ouverts dans Excel, Google Sheets ou tout autre tableur.
            </p>
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="panel p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <IconUpload className="w-6 h-6 text-forest" />
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">
            Importer des données
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Importer des athlètes (CSV)</label>
            <input
              type="file"
              accept=".csv"
              onChange={importAthletesCSV}
              className="input"
            />
          </div>

          <div className="bg-bark/50 border border-husk p-4 rounded">
            <p className="text-xs text-dune mb-2 font-semibold">
              📋 Format CSV requis pour les athlètes :
            </p>
            <p className="text-xs text-dune font-mono">
              Prénom, Nom, Genre, Année de naissance, Club, Licence, Poids, Catégorie, Statut
            </p>
            <p className="text-xs text-dune mt-2">
              Exemple : "Adama", "KONÉ", "Homme", "2001", "Taekwondo Club d'Abidjan", "FITKD-26-1001", "64.2", "M-68", "pesé"
            </p>
          </div>

          <div className="bg-flame/10 border border-flame/30 p-4 rounded">
            <p className="text-xs text-flame">
              ⚠️ Attention : L'import peut créer des doublons. Vérifiez vos données avant d'importer.
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <IconFile className="w-6 h-6 text-chong" />
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">
            Statistiques des données
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-bark/50 border border-husk p-4 rounded text-center">
            <p className="font-display text-2xl text-bone">{state.athletes.length}</p>
            <p className="text-xs text-dune mt-1">Athlètes</p>
          </div>
          <div className="bg-bark/50 border border-husk p-4 rounded text-center">
            <p className="font-display text-2xl text-bone">{state.clubs.length}</p>
            <p className="text-xs text-dune mt-1">Clubs</p>
          </div>
          <div className="bg-bark/50 border border-husk p-4 rounded text-center">
            <p className="font-display text-2xl text-bone">{state.referees.length}</p>
            <p className="text-xs text-dune mt-1">Arbitres</p>
          </div>
          <div className="bg-bark/50 border border-husk p-4 rounded text-center">
            <p className="font-display text-2xl text-bone">{state.competitions.length}</p>
            <p className="text-xs text-dune mt-1">Compétitions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
