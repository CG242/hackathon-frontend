import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import PrizesSection from "@/components/sections/prizes";
import RegisterSection from "@/components/sections/register";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <PrizesSection />
        <RegisterSection />
      </main>
      <Footer />
    </div>
  );
}
