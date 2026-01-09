"use client";

import Link from "next/link";
import { CodeXml, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
    { href: "/#about", label: "À Propos" },
    { href: "/#prizes", label: "Prix" },
    { href: "/results", label: "Résultats" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline">
            <CodeXml className="w-8 h-8 text-primary" />
            <span>CFI-CIRAS</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
               <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button asChild>
              <Link href="/#register">S'inscrire</Link>
            </Button>
          </div>
          <div className="md:hidden">
           {isClient && (
             <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center border-b pb-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline" onClick={() => setIsMenuOpen(false)}>
                      <CodeXml className="w-7 h-7 text-primary" />
                      <span>CFI-CIRAS</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Fermer le menu</span>
                    </Button>
                  </div>
                  <nav className="flex flex-col items-center space-y-6 mt-10 text-lg">
                    {navLinks.map((link) => (
                       <Link key={link.href} href={link.href} className="font-medium text-foreground/80 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pb-4">
                    <Button asChild className="w-full">
                      <Link href="/#register" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
           )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
