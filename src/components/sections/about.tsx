import { CheckCircle } from "lucide-react";

const CodeBlock = () => (
    <div className="relative font-code">
      <pre className="bg-black/80 backdrop-blur-sm rounded-lg p-6 text-sm text-white overflow-x-auto border border-primary/20">
        <code className="language-javascript">
          <span className="text-gray-500">// src/app/page.tsx</span><br/>
          <span className="text-purple-400">import</span> {"{"} <span className="text-blue-300">Hackathon</span> {"}"} <span className="text-purple-400">from</span> <span className="text-yellow-300">'@/events'</span>;<br/><br/>
          <span className="text-purple-400">export default function</span> <span className="text-green-300">Home</span>() {"{"}<br/>
          {"  "}<span className="text-purple-400">return</span> (<br/>
          {"    "}<span className="text-gray-500">&lt;</span><span className="text-green-400">main</span><span className="text-gray-500">&gt;</span><br/>
          {"      "}<span className="text-gray-500">&lt;</span><span className="text-red-400">Hackathon.Bienvenue</span><br/>
          {"        "}<span className="text-blue-300">annee</span>={"{"}<span className="text-yellow-300">2026</span>{"}"}<br/>
          {"        "}<span className="text-blue-300">devise</span>=<span className="text-yellow-300">"Innover. Créer. Collaborer."</span><br/>
          {"      "}<span className="text-gray-500">/&gt;</span><br/>
          {"    "}<span className="text-gray-500">&lt;/</span><span className="text-green-400">main</span><span className="text-gray-500">&gt;</span><br/>
          {"  "});<br/>
          {"}"}
        </code>
        <div className="absolute top-11 left-7 w-0.5 h-4 bg-white animate-pulse"></div>
      </pre>
    </div>
  );

const AboutSection = () => {
    return (
      <section id="about" className="py-20 md:py-32 bg-card/50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <CodeBlock />
            </div>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                <span className="text-primary">100%</span> Code<br/>
                <span className="text-primary">100%</span> Créativité
              </h2>
              <p className="mt-4 text-muted-foreground">
                Le Hackathon 2026 n'est pas une simple compétition. C'est un creuset d'esprits brillants, une rampe de lancement pour des idées révolutionnaires et une célébration du pouvoir de la technologie pour résoudre des problèmes du monde réel. Que vous soyez un développeur chevronné ou un prodige du design, voici votre arène.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Application Web ou Mobile :</strong> Choisissez votre plateforme, libérez votre créativité et construisez une application entièrement fonctionnelle à partir de zéro.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Un Défi, Une Idée, Une Solution :</strong> Relevez des défis passionnants, imaginez des solutions innovantes et donnez vie à votre vision avec le soutien de mentors de l'industrie.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutSection;
