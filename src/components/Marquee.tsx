import { Diamond } from "./Icons";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  variant?: "gold" | "dark";
}

/** Bandeau défilant façon régie sportive. */
export default function Marquee({ items, reverse = false, variant = "gold" }: MarqueeProps) {
  const doubled = [...items, ...items, ...items, ...items];
  const isGold = variant === "gold";

  return (
    <div
      className={`marquee overflow-hidden py-3.5 ${
        isGold
          ? "border-y-2 border-night bg-gold"
          : "border-y border-husk bg-coal"
      }`}
      aria-hidden="true"
    >
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-10 pr-10 font-display text-2xl uppercase tracking-wide sm:text-3xl ${
              isGold ? "text-night" : "text-gold"
            }`}
          >
            {item}
            <Diamond className={`h-3.5 w-3.5 ${isGold ? "text-night" : "text-flame"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
