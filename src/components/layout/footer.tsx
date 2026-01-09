import Link from 'next/link';
import { Github, X, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-headline text-lg font-bold">Hackathon 2026</h3>
            <p className="mt-2 text-sm text-muted-foreground">Innover. Créer. Collaborer.</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-sm text-foreground">Navigation</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">À Propos</Link></li>
                <li><Link href="/#prizes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Prix</Link></li>
                <li><Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Ressources</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Règlement</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Réseaux</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"><X className="w-4 h-4" /> X (Twitter)</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CFI-CIRAS. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
