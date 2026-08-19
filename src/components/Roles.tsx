import { useState } from "react";
import { ROLES_INFO } from "../data";
import Reveal, { Eyebrow } from "./Reveal";
import { IconBelt, IconUsers, IconWhistle, IconFlag, IconGear, IconCheck, IconQr } from "./Icons";

const ROLE_ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  belt: IconBelt,
  users: IconUsers,
  whistle: IconWhistle,
  flag: IconFlag,
  gear: IconGear,
};

function MockShell({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div className="relative border border-husk bg-coal shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)]">
      <div className="kente h-1.5 w-full" aria-hidden="true" />
      <div className="flex items-center justify-between border-b border-husk px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dune">{header}</p>
        <span className="dot-soft inline-block h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function MockAthlete() {
  return (
    <MockShell header="Licence numérique — Athlète">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            Licence fédérale · Saison 2026
          </p>
          <p className="mt-2 font-display text-3xl uppercase text-bone">S. DELI</p>
          <p className="mt-1 font-mono text-xs text-dune">LIC-2026-08412 · CIV · Kyorugi −68 kg</p>
        </div>
        <IconQr className="h-16 w-16 shrink-0 text-gold" />
      </div>
      <div className="mt-5 space-y-3 border-t border-husk pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-dune">Grade</span>
          <span className="flex items-center gap-2 font-semibold text-bone">
            <span className="h-2 w-8 bg-flame" aria-hidden="true" />
            Rouge · 1ᵉʳ Gup
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dune">Certificat médical</span>
          <span className="border border-forest/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-forest">
            ✓ Validé
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dune">Palmarès 2025</span>
          <span className="font-semibold text-bone">12 combats · 9 victoires</span>
        </div>
      </div>
      <p className="mt-5 border-t border-husk pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
        QR à présenter au scan des présences
      </p>
    </MockShell>
  );
}

function MockCoach() {
  const rows = [
    { name: "A. KOUASSI", cat: "−58 kg", status: "Validé", cls: "text-forest border-forest/60" },
    { name: "M. TRAORÉ", cat: "−68 kg", status: "Paiement reçu", cls: "text-gold border-gold/60" },
    { name: "I. NDIAYE", cat: "−80 kg", status: "En attente", cls: "text-dune border-husk" },
  ];
  return (
    <MockShell header="Espace Coach — Club Espoir TKD">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl uppercase text-bone">12 inscrits</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
          Open Poomsae · Oran
        </p>
      </div>
      <div className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between border border-husk bg-bark/60 px-4 py-3 transition-colors hover:border-gold/50"
          >
            <div>
              <p className="text-sm font-bold text-bone">{r.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dune">{r.cat}</p>
            </div>
            <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${r.cls}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-gold underline decoration-gold/40 underline-offset-4 transition hover:text-bone">
        Relancer les paiements en attente →
      </p>
    </MockShell>
  );
}

function MockReferee() {
  const rows = [
    { aria: "Aire A", time: "09:00", match: "Quarts −68 kg", role: "Arbitre central", cls: "text-forest border-forest/60", label: "Confirmé" },
    { aria: "Aire C", time: "11:30", match: "Demies −57 kg", role: "Juge de coin", cls: "text-gold border-gold/60", label: "Convocation" },
    { aria: "Aire B", time: "15:00", match: "Finales", role: "Affectation en cours…", cls: "text-dune border-husk", label: "À venir" },
  ];
  return (
    <MockShell header="Espace Arbitre — Rotations du jour">
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={`${r.aria}-${r.time}`} className="border border-husk bg-bark/60 px-4 py-3 transition-colors hover:border-gold/50">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                {r.aria} · {r.time}
              </p>
              <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${r.cls}`}>
                {r.label}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-bone">
              {r.match} <span className="text-dune">— {r.role}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
        <span className="dot-soft inline-block h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
        24 matchs arbitrés cette saison
      </p>
    </MockShell>
  );
}

function MockOfficial() {
  return (
    <MockShell header="Espace Officiel — Réclamations">
      <div className="space-y-2.5">
        <div className="border border-husk bg-bark/60 px-4 py-3 transition-colors hover:border-flame/50">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone">Réclamation #112</p>
            <span className="border border-flame/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-flame">
              En examen
            </span>
          </div>
          <p className="mt-1.5 text-sm text-dune">
            Finale −57 kg Femmes — <span className="text-bone">Gam-jeom contesté à 01:12</span>
          </p>
        </div>
        <div className="border border-husk bg-bark/60 px-4 py-3 transition-colors hover:border-forest/50">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bone">Réclamation #109</p>
            <span className="border border-forest/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-forest">
              Résolue
            </span>
          </div>
          <p className="mt-1.5 text-sm text-dune">
            Demi-finale +80 kg — <span className="text-bone">Sortie d'aire validée par la vidéo</span>
          </p>
        </div>
      </div>
      <p className="mt-5 border-t border-husk pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
        Délai réglementaire : 10 min après la fin du combat
      </p>
    </MockShell>
  );
}

function MockAdmin() {
  const bars = [42, 58, 47, 76, 64, 92, 81];
  return (
    <MockShell header="Espace Administrateur — Saison 2026">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { n: "12 847", l: "Licences" },
          { n: "847", l: "Clubs" },
          { n: "320", l: "Événements" },
        ].map((s) => (
          <div key={s.l} className="border border-husk bg-bark/60 px-3 py-3 text-center">
            <p className="font-display text-xl text-bone">{s.n}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dune">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dune">
          Inscriptions / semaine
        </p>
        <div className="mt-2 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 ${i === bars.length - 2 ? "bg-gold" : "bg-husk"} transition-colors hover:bg-gold/70`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <p className="mt-5 inline-block cursor-pointer border border-gold/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition hover:bg-gold hover:text-night">
        Exporter le rapport de saison
      </p>
    </MockShell>
  );
}

const MOCKS: Record<string, () => React.ReactElement> = {
  athlete: MockAthlete,
  coach: MockCoach,
  referee: MockReferee,
  official: MockOfficial,
  admin: MockAdmin,
};

/** Un espace dédié pour chaque acteur de la compétition. */
export default function Roles() {
  const [active, setActive] = useState("athlete");
  const role = ROLES_INFO.find((r) => r.id === active) ?? ROLES_INFO[0];
  const Mock = MOCKS[active];

  return (
    <section
      id="roles"
      className="mud-bg relative scroll-mt-24 border-t border-husk bg-coal/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Une suite complète pour chaque rôle</Eyebrow>
            <h2 className="mt-6 font-display text-4xl uppercase leading-[1.02] text-bone sm:text-5xl lg:text-6xl">
              Chaque acteur,
              <br />
              son <span className="text-gold">espace dédié</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap gap-2.5" role="tablist" aria-label="Choisir un rôle">
            {ROLES_INFO.map((r) => {
              const I = ROLE_ICONS[r.icon];
              const on = active === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(r.id)}
                  className={`flex cursor-pointer items-center gap-2.5 border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    on
                      ? "border-gold bg-gold text-night"
                      : "border-husk text-dune hover:border-gold/60 hover:text-bone"
                  }`}
                >
                  <I className="h-[18px] w-[18px]" />
                  {r.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div key={active} className="ev-in mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-gold">{role.tagline}</p>
            <h3 className="mt-4 font-display text-3xl uppercase text-bone sm:text-4xl">
              Espace {role.label}
            </h3>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-dune">{role.desc}</p>
            <ul className="mt-7 space-y-3.5">
              {role.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-bone">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-gold/60 text-gold">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Mock />
        </div>
      </div>
    </section>
  );
}
