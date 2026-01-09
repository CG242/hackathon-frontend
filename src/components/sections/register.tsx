import RegistrationForm from "@/components/registration-form";

const RegisterSection = () => {
  return (
    <section id="register" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">
                Prêt à construire le futur ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Réservez votre place pour le Hackathon 2026. Les places sont limitées. Ne manquez pas l'opportunité d'innover, d'apprendre et de gagner des prix incroyables.
            </p>
        </div>
        <div className="mt-12 max-w-2xl mx-auto">
            <RegistrationForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
