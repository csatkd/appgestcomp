import { useScrollReveal, useCountUp } from "../../hooks/useScrollReveal";

const stats = [
  { value: 12, label: "Modules Intégrés", suffix: "" },
  { value: 8, label: "Catégories WT", suffix: "" },
  { value: 100, label: "Conformité WT", suffix: "%" },
  { value: 24, label: "Support", suffix: "/7" },
];

export default function Stats() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-24 bg-night overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 kente opacity-5" />
      
      <div ref={ref} className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: (typeof stats)[0];
  index: number;
  isVisible: boolean;
}) {
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div
      className={`text-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="font-display text-5xl sm:text-6xl md:text-7xl text-gold mb-3">
        {count}
        <span className="text-3xl sm:text-4xl">{stat.suffix}</span>
      </div>
      <div className="font-mono text-sm uppercase tracking-wider text-dune">
        {stat.label}
      </div>
    </div>
  );
}
