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
          {"      "}<span className="text-gray-500">&lt;</span><span className="text-red-400">Hackathon.Welcome</span><br/>
          {"        "}<span className="text-blue-300">year</span>={"{"}<span className="text-yellow-300">2026</span>{"}"}<br/>
          {"        "}<span className="text-blue-300">motto</span>=<span className="text-yellow-300">"Innovate. Create. Collaborate."</span><br/>
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
                Hackathon 2026 is not just another competition. It's a melting pot of brilliant minds, a launchpad for groundbreaking ideas, and a celebration of technology's power to solve real-world problems. Whether you're a seasoned developer or a design prodigy, this is your arena.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Application Web ou Mobile:</strong> Choose your platform, unleash your creativity, and build a fully functional application from scratch.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent mt-1 shrink-0" />
                  <span>
                    <strong>Un Défi, Une Idée, Une Solution:</strong> Tackle exciting challenges, brainstorm innovative solutions, and bring your vision to life with the support of industry mentors.
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
