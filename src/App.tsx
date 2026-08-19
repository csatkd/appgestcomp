import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Features from "./components/Features";
import Events from "./components/Events";
import Journey from "./components/Journey";
import Roles from "./components/Roles";
import Modules from "./components/Modules";
import About from "./components/About";
import Rankings from "./components/Rankings";
import Testimonials from "./components/Testimonials";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
import { DISCIPLINES } from "./data";

const CITY_ITEMS = [
  "Inscriptions ouvertes",
  "Alger",
  "Oran",
  "Constantine",
  "Annaba",
  "Sétif",
  "320+ événements / an",
  "Scoring en direct",
];

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-night font-body text-bone">
      <div className="noise-layer" aria-hidden="true" />

      <Header />

      <main>
        <Hero />
        <Marquee items={[...DISCIPLINES, "Formation"]} />
        <Features />
        <Events />
        <Journey />
        <Roles />
        <Modules />
        <About />
        <Rankings />
        <Testimonials />
        <Marquee items={CITY_ITEMS} reverse variant="dark" />
        <Cta />
      </main>

      <Footer />
    </div>
  );
}
