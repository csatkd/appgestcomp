import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { IconAlert, IconCheck, IconX } from "./Icons";

/* ————— Toasts ————— */

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

const ToastCtx = createContext<(message: string, kind?: Toast["kind"]) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    toastId += 1;
    const id = toastId;
    setToasts((t) => [...t, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[120] flex w-[320px] flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto relative flex items-start gap-3 border border-husk bg-coal px-4 py-3.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]"
          >
            <span
              className={`absolute left-0 top-0 h-full w-1 ${
                t.kind === "success" ? "bg-forest" : t.kind === "error" ? "bg-flame" : "bg-gold"
              }`}
              aria-hidden="true"
            />
            <span
              className={`mt-0.5 shrink-0 ${
                t.kind === "success" ? "text-forest" : t.kind === "error" ? "text-flame" : "text-gold"
              }`}
            >
              {t.kind === "error" ? <IconAlert className="h-4 w-4" /> : <IconCheck className="h-4 w-4" />}
            </span>
            <p className="text-sm leading-snug text-bone">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ————— Modale ————— */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-night/85 p-5 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="modal-in relative w-full max-w-lg border border-husk bg-coal shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kente h-1.5 w-full" aria-hidden="true" />
        <div className="flex items-center justify-between border-b border-husk px-6 py-4">
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="cursor-pointer p-1.5 text-dune transition-colors hover:text-flame"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ————— En-tête de page ————— */

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
          <span className="kente inline-block h-2 w-10" aria-hidden="true" />
          {subtitle}
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
          {title}
        </h1>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

/* ————— État vide ————— */

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center border border-husk text-gold">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-bone">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-dune">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ————— Barre de progression ————— */

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden bg-husk ${className}`}>
      <div
        className="h-full bg-gold transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ————— Pastille de statut ————— */

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    inscrit: { cls: "text-dune", label: "Inscrit" },
    "pesé": { cls: "text-forest", label: "Pesé" },
    forfait: { cls: "text-flame", label: "Forfait" },
    ouverte: { cls: "text-dune", label: "Ouverte" },
    "tirée": { cls: "text-gold", label: "Tirage fait" },
    "terminée": { cls: "text-forest", label: "Terminée" },
    pret: { cls: "text-gold", label: "Prêt" },
    encours: { cls: "text-flame", label: "En cours" },
    termine: { cls: "text-forest", label: "Terminé" },
    attente: { cls: "text-dune", label: "Attente" },
  };
  const m = map[status] ?? { cls: "text-dune", label: status };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}
