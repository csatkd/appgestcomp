import { PageHead } from '../components/ui';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import PoomsaeManager from '../components/poomsae/PoomsaeManager';

export default function Poomsae() {
  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Compétitions Poomsae"
        subtitle="Gestion des compétitions de formes"
      />
      <PoomsaeManager />
    </div>
  );
}
