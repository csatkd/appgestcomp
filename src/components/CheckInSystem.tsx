import { useState } from 'react';
import { useApp } from '../lib/store';
import { PageHead, useToast } from './ui';
import PageBackground from './PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import { IconQr, IconCheck, IconX, IconUsers } from './Icons';

interface CheckIn {
  id: string;
  athleteId: string;
  timestamp: string;
  method: 'qr' | 'barcode' | 'manual';
  verified: boolean;
}

export default function CheckInSystem() {
  const { state } = useApp();
  const toast = useToast();
  
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [scanMode, setScanMode] = useState<'qr' | 'barcode' | 'manual'>('qr');
  const [manualCode, setManualCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  const generateQRCode = (athleteId: string) => {
    // Simuler la génération d'un QR code
    return `DOJANG-${athleteId}-${Date.now()}`;
  };

  const verifyCheckIn = (code: string) => {
    // Extraire l'ID de l'athlète du code
    const parts = code.split('-');
    if (parts.length < 2) {
      toast('Code invalide', 'error');
      return false;
    }

    const athleteId = parts[1];
    const athlete = state.athletes.find(a => a.id === athleteId);
    
    if (!athlete) {
      toast('Athlète non trouvé', 'error');
      return false;
    }

    // Vérifier si déjà check-in
    const alreadyCheckedIn = checkIns.some(c => c.athleteId === athleteId);
    if (alreadyCheckedIn) {
      toast(`${athlete.firstName} ${athlete.lastName} est déjà enregistré`, 'info');
      return false;
    }

    // Enregistrer le check-in
    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      athleteId,
      timestamp: new Date().toISOString(),
      method: scanMode,
      verified: true
    };

    setCheckIns([newCheckIn, ...checkIns]);
    toast(`${athlete.firstName} ${athlete.lastName} enregistré avec succès`, 'success');
    return true;
  };

  const handleManualCheckIn = () => {
    if (!manualCode.trim()) {
      toast('Veuillez entrer un code', 'error');
      return;
    }

    verifyCheckIn(manualCode);
    setManualCode('');
  };

  const handleSimulateScan = () => {
    // Simuler un scan QR aléatoire
    const randomAthlete = state.athletes[Math.floor(Math.random() * state.athletes.length)];
    if (randomAthlete) {
      const code = generateQRCode(randomAthlete.id);
      verifyCheckIn(code);
    }
  };

  const checkedInCount = checkIns.length;
  const totalAthletes = state.athletes.length;
  const checkInRate = totalAthletes > 0 ? Math.round((checkedInCount / totalAthletes) * 100) : 0;

  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Système de Check-in"
        subtitle="Enregistrement des athlètes par QR Code"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="panel p-6">
          <IconUsers className="w-8 h-8 text-gold mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {checkedInCount}/{totalAthletes}
          </p>
          <p className="text-sm text-dune">Athlètes enregistrés</p>
        </div>
        <div className="panel p-6">
          <IconCheck className="w-8 h-8 text-forest mb-3" />
          <p className="font-display text-3xl text-bone mb-1">{checkInRate}%</p>
          <p className="text-sm text-dune">Taux de check-in</p>
        </div>
        <div className="panel p-6">
          <IconQr className="w-8 h-8 text-chong mb-3" />
          <p className="font-display text-3xl text-bone mb-1">
            {totalAthletes - checkedInCount}
          </p>
          <p className="text-sm text-dune">En attente</p>
        </div>
      </div>

      {/* Zone de scan */}
      <div className="panel p-6 mb-8">
        <h3 className="font-display text-2xl text-bone mb-6">Scanner un Athlète</h3>
        
        {/* Mode de scan */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setScanMode('qr')}
            className={`btn ${scanMode === 'qr' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <IconQr className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={() => setScanMode('barcode')}
            className={`btn ${scanMode === 'barcode' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Code-barres
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`btn ${scanMode === 'manual' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Manuel
          </button>
        </div>

        {/* Zone de scan QR */}
        {scanMode === 'qr' && (
          <div className="text-center">
            <div className="border-4 border-dashed border-gold rounded-lg p-12 mb-6">
              <IconQr className="w-24 h-24 text-gold mx-auto mb-4" />
              <p className="text-lg text-bone mb-2">Zone de scan QR Code</p>
              <p className="text-sm text-dune mb-4">
                Placez le QR code de l'athlète devant la caméra
              </p>
              <button
                onClick={handleSimulateScan}
                className="btn btn-primary"
              >
                Simuler un scan
              </button>
            </div>
            <p className="text-sm text-dune">
              💡 Astuce : Utilisez la caméra de votre appareil pour scanner les QR codes
            </p>
          </div>
        )}

        {/* Saisie manuelle */}
        {scanMode === 'manual' && (
          <div className="max-w-md mx-auto">
            <label className="label">Code de l'athlète</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="DOJANG-ath-123..."
                className="input flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualCheckIn();
                  }
                }}
              />
              <button
                onClick={handleManualCheckIn}
                className="btn btn-primary"
              >
                <IconCheck className="w-4 h-4" />
                Valider
              </button>
            </div>
            <p className="text-xs text-dune mt-2">
              Entrez le code unique de l'athlète ou scannez son QR code
            </p>
          </div>
        )}

        {/* Code-barres */}
        {scanMode === 'barcode' && (
          <div className="text-center">
            <div className="border-4 border-dashed border-chong rounded-lg p-12 mb-6">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg text-bone mb-2">Zone de scan Code-barres</p>
              <p className="text-sm text-dune mb-4">
                Placez le code-barres devant le scanner
              </p>
              <button
                onClick={handleSimulateScan}
                className="btn btn-primary"
              >
                Simuler un scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des check-ins */}
      <div className="panel p-6">
        <h3 className="font-display text-2xl text-bone mb-6">
          Historique des Check-ins ({checkIns.length})
        </h3>
        
        {checkIns.length === 0 ? (
          <div className="text-center py-12">
            <IconQr className="w-16 h-16 text-dune/30 mx-auto mb-4" />
            <p className="text-dune">Aucun check-in pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIns.map((checkIn) => {
              const athlete = state.athletes.find(a => a.id === checkIn.athleteId);
              if (!athlete) return null;

              return (
                <div key={checkIn.id} className="panel p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-flame rounded-full flex items-center justify-center text-xl font-bold text-night">
                      {athlete.firstName[0]}{athlete.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-bone">
                        {athlete.firstName} {athlete.lastName}
                      </p>
                      <p className="text-sm text-dune">{athlete.club}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <IconCheck className="w-4 h-4 text-forest" />
                      <span className="text-sm font-semibold text-forest">Enregistré</span>
                    </div>
                    <p className="text-xs text-dune">
                      {formatDate(checkIn.timestamp)} à {formatTime(checkIn.timestamp)}
                    </p>
                    <p className="text-xs text-dune capitalize">
                      Via {checkIn.method === 'qr' ? 'QR Code' : 
                           checkIn.method === 'barcode' ? 'Code-barres' : 
                           'Saisie manuelle'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Liste des athlètes non check-in */}
      <div className="panel p-6 mt-8">
        <h3 className="font-display text-2xl text-bone mb-6">
          Athlètes en Attente ({totalAthletes - checkedInCount})
        </h3>
        
        {totalAthletes - checkedInCount === 0 ? (
          <div className="text-center py-12">
            <IconCheck className="w-16 h-16 text-forest/30 mx-auto mb-4" />
            <p className="text-dune">Tous les athlètes sont enregistrés !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.athletes
              .filter(a => !checkIns.some(c => c.athleteId === a.id))
              .slice(0, 12)
              .map((athlete) => (
                <div key={athlete.id} className="panel p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-bark rounded-full flex items-center justify-center text-sm font-bold text-bone">
                      {athlete.firstName[0]}{athlete.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-bone text-sm">
                        {athlete.firstName} {athlete.lastName}
                      </p>
                      <p className="text-xs text-dune">{athlete.club}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const code = generateQRCode(athlete.id);
                      verifyCheckIn(code);
                    }}
                    className="btn btn-ghost btn-sm w-full"
                  >
                    <IconQr className="w-3 h-3" />
                    Enregistrer
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
