import { useState } from "react";
import { useApp } from "../lib/store";
import { PageHead, useToast } from "../components/ui";
import { IconAward, IconDownload } from "../components/Icons";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function Certificates() {
  const { state } = useApp();
  const toast = useToast();
  const [selectedAthlete, setSelectedAthlete] = useState<string>("");

  const generateCertificate = (athleteId: string) => {
    const athlete = state.athletes.find((a) => a.id === athleteId);
    if (!athlete) return;

    // Créer une nouvelle fenêtre pour le certificat
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast("Veuillez autoriser les popups pour générer le certificat", "error");
      return;
    }

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Certificat - ${athlete.firstName} ${athlete.lastName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      background: white;
      padding: 40px;
    }
    .certificate {
      max-width: 800px;
      margin: 0 auto;
      border: 20px solid;
      border-image: linear-gradient(45deg, #f0a41c, #e2472e, #1e8a5a) 1;
      padding: 60px;
      text-align: center;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid #f0a41c;
      pointer-events: none;
    }
    .header {
      margin-bottom: 40px;
    }
    .title {
      font-size: 48px;
      color: #14100a;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 24px;
      color: #f0a41c;
      font-style: italic;
    }
    .content {
      margin: 40px 0;
    }
    .athlete-name {
      font-size: 36px;
      color: #14100a;
      font-weight: bold;
      margin: 20px 0;
      border-bottom: 3px solid #f0a41c;
      display: inline-block;
      padding-bottom: 10px;
    }
    .details {
      font-size: 18px;
      color: #333;
      line-height: 1.8;
      margin: 30px 0;
    }
    .footer {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #333;
      width: 200px;
      margin: 10px auto;
    }
    .signature-text {
      font-size: 14px;
      color: #666;
    }
    .date {
      font-size: 14px;
      color: #666;
      margin-top: 40px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="title">Certificat de Participation</div>
      <div class="subtitle">${state.event.name}</div>
    </div>

    <div class="content">
      <p style="font-size: 20px; margin-bottom: 20px;">
        Ce certificat est décerné à
      </p>
      <div class="athlete-name">
        ${athlete.firstName} ${athlete.lastName}
      </div>
      <div class="details">
        <p><strong>Club:</strong> ${athlete.club}</p>
        <p><strong>Licence:</strong> ${athlete.license}</p>
        <p><strong>Catégorie:</strong> ${athlete.category || "Non définie"}</p>
        <p><strong>Poids:</strong> ${athlete.weight || "N/A"} kg</p>
        <p style="margin-top: 30px;">
          Pour sa participation exceptionnelle au<br>
          <strong>${state.event.name}</strong><br>
          organisé le ${state.event.date}<br>
          à ${state.event.venue}
        </p>
      </div>
    </div>

    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">Président FITKD</div>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-text">Directeur Technique</div>
      </div>
    </div>

    <div class="date">
      Délivré le ${new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="padding: 15px 30px; font-size: 16px; cursor: pointer; background: #f0a41c; color: white; border: none; border-radius: 5px;">
      Imprimer le Certificat
    </button>
  </div>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    toast("Certificat généré avec succès");
  };

  const generateAllCertificates = () => {
    toast("Génération de tous les certificats...");
    state.athletes.forEach((athlete, index) => {
      setTimeout(() => {
        generateCertificate(athlete.id);
      }, index * 500);
    });
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.results} opacity={0.08} blur={3} />
      <PageHead
        title="Certificats de Participation"
        subtitle="Génération de certificats pour les athlètes"
        actions={
          <button onClick={generateAllCertificates} className="btn btn-primary btn-sm">
            <IconDownload className="w-4 h-4" />
            Générer Tous
          </button>
        }
      />

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Total athlètes
          </p>
          <p className="font-display text-3xl text-bone mt-2">{state.athletes.length}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Athlètes pesés
          </p>
          <p className="font-display text-3xl text-forest mt-2">
            {state.athletes.filter((a) => a.status === "pesé").length}
          </p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-dune">
            Certificats disponibles
          </p>
          <p className="font-display text-3xl text-gold mt-2">{state.athletes.length}</p>
        </div>
      </div>

      {/* Sélection d'athlète */}
      <div className="panel p-6 mb-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Générer un Certificat
        </h3>
        <div className="flex gap-4">
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="input flex-1"
          >
            <option value="">Sélectionner un athlète</option>
            {state.athletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.firstName} {athlete.lastName} - {athlete.club}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selectedAthlete) {
                generateCertificate(selectedAthlete);
              } else {
                toast("Veuillez sélectionner un athlète", "error");
              }
            }}
            className="btn btn-primary"
          >
            <IconAward className="w-4 h-4" />
            Générer
          </button>
        </div>
      </div>

      {/* Liste des athlètes */}
      <div className="panel p-6">
        <h3 className="font-display text-xl uppercase tracking-wide text-bone mb-4">
          Tous les Athlètes
        </h3>
        <div className="space-y-2">
          {state.athletes.map((athlete) => (
            <div
              key={athlete.id}
              className="flex items-center justify-between border border-husk p-4 hover:border-gold/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-bone">
                  {athlete.firstName} {athlete.lastName}
                </p>
                <p className="text-sm text-dune mt-1">
                  {athlete.club} • {athlete.license}
                </p>
              </div>
              <button
                onClick={() => generateCertificate(athlete.id)}
                className="btn btn-ghost btn-sm"
              >
                <IconAward className="w-4 h-4" />
                Certificat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
