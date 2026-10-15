import DashboardSettings from './DashboardSettings';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import { useExportPDF } from '../hooks/useExportPDF';
import { IconFile } from './Icons';
import { useToast } from './ui';

export default function DashboardToolbar() {
  const { exportToPDF } = useExportPDF();
  const toast = useToast();

  const handleExportPDF = () => {
    exportToPDF({
      title: 'Rapport de Compétition - DOJANG',
      filename: `rapport-dojang-${new Date().toISOString().split('T')[0]}`,
    });
    toast('Rapport PDF généré avec succès');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DashboardSettings />
      <button
        onClick={handleExportPDF}
        className="btn btn-ghost btn-sm"
        title="Exporter en PDF"
      >
        <IconFile className="h-4 w-4" />
        <span className="hidden sm:inline">Export PDF</span>
      </button>
      <KeyboardShortcutsHelp />
    </div>
  );
}
