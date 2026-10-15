import { useApp } from '../lib/store';

interface ExportPDFOptions {
  title: string;
  filename?: string;
}

export function useExportPDF() {
  const { state } = useApp();

  const exportToPDF = (options: ExportPDFOptions) => {
    const { title, filename = 'rapport' } = options;

    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour exporter en PDF');
      return;
    }

    // Générer le contenu HTML
    const html = generateReportHTML(title);

    // Écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(html);
    printWindow.document.close();

    // Attendre que le contenu soit chargé puis ouvrir la boîte de dialogue d'impression
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const generateReportHTML = (title: string): string => {
    const date = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const totalAthletes = state.athletes.length;
    const totalClubs = state.clubs.length;
    const totalSponsors = state.sponsors.length;
    const totalReferees = state.referees.length;
    const totalCompetitions = state.competitions.length;

    const activeSponsors = state.sponsors.filter((s) => s.status === 'actif');
    const totalSponsorAmount = activeSponsors.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    );

    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(amount);
    };

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #f0a41c;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 32px;
      color: #14100a;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 24px;
      color: #14100a;
      border-left: 4px solid #f0a41c;
      padding-left: 15px;
      margin-bottom: 15px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 8px;
    }
    .stat-card h3 {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .stat-card .value {
      font-size: 36px;
      font-weight: bold;
      color: #f0a41c;
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
      background-color: #f0a41c;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <p>Généré le ${date}</p>
    <p>${state.event.name} • ${state.event.venue}</p>
  </div>

  <div class="section">
    <h2>Statistiques Générales</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Athlètes inscrits</h3>
        <div class="value">${totalAthletes}</div>
      </div>
      <div class="stat-card">
        <h3>Clubs affiliés</h3>
        <div class="value">${totalClubs}</div>
      </div>
      <div class="stat-card">
        <h3>Sponsors actifs</h3>
        <div class="value">${totalSponsors}</div>
      </div>
      <div class="stat-card">
        <h3>Arbitres</h3>
        <div class="value">${totalReferees}</div>
      </div>
      <div class="stat-card">
        <h3>Compétitions</h3>
        <div class="value">${totalCompetitions}</div>
      </div>
      <div class="stat-card">
        <h3>Financement total</h3>
        <div class="value">${formatAmount(totalSponsorAmount)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Liste des Athlètes</h2>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Club</th>
          <th>Licence</th>
          <th>Catégorie</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        ${state.athletes
          .map(
            (a) => `
          <tr>
            <td>${a.firstName} ${a.lastName}</td>
            <td>${a.club}</td>
            <td>${a.license}</td>
            <td>${a.category || 'Non définie'}</td>
            <td>${a.status}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Liste des Clubs</h2>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Ville</th>
          <th>Région</th>
          <th>Président</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        ${state.clubs
          .map(
            (c) => `
          <tr>
            <td>${c.name}</td>
            <td>${c.city}</td>
            <td>${c.region}</td>
            <td>${c.president}</td>
            <td>${c.email}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Liste des Sponsors</h2>
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type</th>
          <th>Niveau</th>
          <th>Montant</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        ${state.sponsors
          .map(
            (s) => `
          <tr>
            <td>${s.name}</td>
            <td>${s.type}</td>
            <td>${s.level}</td>
            <td>${s.amount ? formatAmount(s.amount) : 'N/A'}</td>
            <td>${s.status}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>DOJANG - Régie de compétition Taekwondo FITKD Côte d'Ivoire</p>
    <p>Rapport généré automatiquement le ${date}</p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #f0a41c; color: white; border: none; border-radius: 5px;">
      Imprimer / Sauvegarder en PDF
    </button>
  </div>
</body>
</html>
    `;
  };

  return { exportToPDF };
}
