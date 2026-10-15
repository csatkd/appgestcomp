import { PageHead } from '../components/ui';
import PageBackground from '../components/PageBackground';
import { PAGE_BACKGROUNDS } from '../config/backgrounds';
import GradeManager from '../components/grades/GradeManager';

export default function Grades() {
  return (
    <div className="fade-up mx-auto max-w-7xl">
      <PageBackground imageUrl={PAGE_BACKGROUNDS.dashboard} opacity={0.08} blur={3} />
      <PageHead
        title="Passages de Grades"
        subtitle="Gestion évolutive et flexible des examens de ceinture"
      />
      <GradeManager />
    </div>
  );
}
