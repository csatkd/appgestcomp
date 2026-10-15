import { PageHead } from '../components/ui';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import CasseManager from '../components/casse/CasseManager';

export default function Casse() {
  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Compétitions de Casse"
        subtitle="Gestion des compétitions de breaking"
      />
      <CasseManager />
    </div>
  );
}
