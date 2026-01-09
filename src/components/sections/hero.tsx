import { Button } from "@/components/ui/button";
import Link from "next/link";
import Countdown from "@/components/countdown";
import BackgroundParticles from "@/components/background-particles";

const HeroSection = () => {
  return (
    <section id="hero" className="relative flex items-center justify-center min-h-screen overflow-hidden pt-20">
      <BackgroundParticles />
      <div className="relative z-10 text-center px-4">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 animate-fade-in-up">
          <span className="text-primary">&lt;/</span>HACKATHON
          <span className="text-primary">&gt;</span> <span className="text-accent">2026</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fade-in-up animation-delay-300">
          Rejoignez les esprits les plus innovants pour construire l'avenir de la technologie.
          <br /> Un week-end. Des possibilités infinies.
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Button size="lg" asChild className="transition-transform duration-300 hover:scale-105">
            <Link href="#register">S'inscrire maintenant</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="transition-transform duration-300 hover:scale-105">
            <Link href="#about">En savoir plus</Link>
          </Button>
        </div>
        <div className="mt-16 animate-fade-in-up animation-delay-900">
          <Countdown />
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
