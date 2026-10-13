import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Stats from "../components/landing/Stats";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import LandingFooter from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-night">
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
      <LandingFooter />
    </div>
  );
}
