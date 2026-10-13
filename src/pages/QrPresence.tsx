import { useMemo, useState } from "react";
import { useApp } from "../lib/store";
import { athleteName, classLabel } from "../lib/data";
import { PageHead, StatusBadge, useToast, Modal } from "../components/ui";
import { IconQr, IconCheck, IconX } from "../components/Icons";
import type { QrScan } from "../lib/types";
import PageBackground from "../components/PageBackground";
import { PAGE_BACKGROUNDS } from "../config/backgrounds";

export default function QrPresence() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [scanType, setScanType] = useState<"presence" | "pesee">("presence");
  const [athleteId, setAthleteId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    const presenceScans = state.qrScans.filter((s) => s.type === "presence");
    const peseeScans = state.qrScans.filter((s) => s.type === "pesee");
    const uniquePresence = new Set(presenceScans.map((s) => s.athleteId)).size;
    const uniquePesee = new Set(peseeScans.map((s) => s.athleteId)).size;
    return {
      total: state.qrScans.length,
      presence: presenceScans.length,
      pesee: peseeScans.length,
      uniquePresence,
      uniquePesee,
    };
  }, [state.qrScans]);

  const recentScans = useMemo(() => {
    return state.qrScans.slice(0, 20).map((scan) => {
      const athlete = state.athletes.find((a) => a.id === scan.athleteId);
      return { ...scan, athlete };
    });
  }, [state.qrScans, state.athletes]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!athleteId) errs.athleteId = "Sélectionnez un athlète";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const athlete = state.athletes.find((a) => a.id === athleteId);
    if (!athlete) {
      toast("Athlète introuvable", "error");
      return;
    }

    // Vérifier si déjà scanné récemment (dans les 5 minutes)
    const recentScan = state.qrScans.find(
      (s) => s.athleteId === athleteId && s.type === scanType && Date.now() - new Date(s.scannedAt).getTime() < 5 * 60 * 1000
    );
    if (recentScan) {
      toast(`${athlete.firstName} ${athlete.lastName} déjà scanné(e) il y a moins de 5 minutes`, "error");
      return;
    }

    const scan: QrScan = {
      id: `scan-${Date.now()}`,
      athleteId,
      scannedAt: new Date().toISOString(),
      type: scanType,
    };

    dispatch({ type: "ADD_QR_SCAN", scan });
    const typeLabel = scanType === "presence" ? "présence" : "pesée";
    toast(`Scan ${typeLabel} validé pour ${athlete.firstName} ${athlete.lastName}`);
    setAthleteId("");
    setOpen(false);
  };

  return (
    <div className="fade-up mx-auto max-w-6xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.qrPresence} opacity={0.1} blur={3} />
      <PageHead
        title="QR Présences"
        subtitle="Validation des présences et pesées"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <IconQr className="h-3.5 w-3.5" />
            Scanner un QR code
          </button>
        }
      />

      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dune">Total scans</p>
          <p className="mt-2 font-display text-3xl text-bone">{stats.total}</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest">Présences</p>
          <p className="mt-2 font-display text-3xl text-forest">{stats.presence}</p>
          <p className="mt-1 font-mono text-[10px] text-dune">{stats.uniquePresence} unique(s)</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Pesées</p>
          <p className="mt-2 font-display text-3xl text-gold">{stats.pesee}</p>
          <p className="mt-1 font-mono text-[10px] text-dune">{stats.uniquePesee} unique(s)</p>
        </div>
        <div className="panel p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chong">Taux présence</p>
          <p className="mt-2 font-display text-3xl text-chong">
            {state.athletes.length > 0
              ? Math.round((stats.uniquePresence / state.athletes.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Scans récents */}
      <div className="panel">
        <div className="border-b border-husk px-6 py-4">
          <h3 className="font-display text-xl uppercase tracking-wide text-bone">
            Scans récents
          </h3>
        </div>
        {recentScans.length === 0 ? (
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <IconQr className="h-12 w-12 text-dune/40" />
            <p className="mt-4 font-display text-2xl uppercase tracking-wide text-bone">
              Aucun scan enregistré
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-dune">
              Les scans de présence et de pesée apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-husk/60">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center gap-4 px-6 py-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center border ${
                    scan.type === "presence" ? "border-forest text-forest" : "border-gold text-gold"
                  }`}
                >
                  <IconQr className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-bone">
                    {scan.athlete
                      ? `${scan.athlete.firstName} ${scan.athlete.lastName}`
                      : "Athlète inconnu"}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
                    {scan.type === "presence" ? "Présence" : "Pesée"} ·{" "}
                    {new Date(scan.scannedAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <StatusBadge status={scan.type === "presence" ? "pesé" : "inscrit"} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale de scan */}
      <Modal open={open} onClose={() => setOpen(false)} title="Scanner un QR code">
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <span className="label">Type de scan</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScanType("presence")}
                className={`flex-1 cursor-pointer border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                  scanType === "presence"
                    ? "border-forest bg-forest/10 font-semibold text-forest"
                    : "border-husk text-dune hover:border-forest/60"
                }`}
              >
                Présence
              </button>
              <button
                type="button"
                onClick={() => setScanType("pesee")}
                className={`flex-1 cursor-pointer border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                  scanType === "pesee"
                    ? "border-gold bg-gold/10 font-semibold text-gold"
                    : "border-husk text-dune hover:border-gold/60"
                }`}
              >
                Pesée
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="scan-athlete" className="label">Athlète</label>
            <select
              id="scan-athlete"
              className="input"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
            >
              <option value="">Sélectionnez un athlète</option>
              {state.athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName} — {a.license}
                </option>
              ))}
            </select>
            {errors.athleteId && <p className="mt-1.5 text-xs text-flame">{errors.athleteId}</p>}
          </div>

          <div className="border-t border-husk pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">
              Simulation : sélectionnez manuellement l'athlète au lieu de scanner un QR code
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-husk pt-4">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              <IconCheck className="h-3.5 w-3.5" />
              Valider le scan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
