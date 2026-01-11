"use client";

import { useState, useEffect } from 'react';
import { useEvent } from '@/context/event-context';

const Countdown = () => {
  const { eventSettings, hackathon } = useEvent();
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    phase: "Chargement...",
    finished: false
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !eventSettings.countdownEnabled || !hackathon) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const startDate = new Date(hackathon.dateDebut);
      const submissionDeadline = new Date(hackathon.dateLimiteInscription);
      const endDate = new Date(hackathon.dateFin);

      let targetDate: Date;
      let phase: string;

      // Déterminer la phase actuelle et la date cible
      if (now < startDate) {
        // Phase 1: Avant le début - countdown vers le début
        targetDate = startDate;
        phase = "Jusqu'au début";
      } else if (now < submissionDeadline) {
        // Phase 2: Après le début - countdown vers la limite de soumission
        targetDate = submissionDeadline;
        phase = "Soumission des dossiers";
      } else if (now < endDate) {
        // Phase 3: Après la limite - countdown vers la fin
        targetDate = endDate;
        phase = "Jusqu'à la fin";
      } else {
        // Phase 4: Événement terminé
        return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, phase: "Terminé", finished: true };
      }

      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        // Calcul plus précis des unités de temps
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30); // Approximation: 30 jours par mois
        const days = totalDays % 30; // Jours restants dans le mois actuel
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { months, days, hours, minutes, seconds, phase, finished: false };
      }

      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, phase: "Terminé", finished: true };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, eventSettings.countdownEnabled, hackathon]);

  // Ne pas afficher le countdown s'il est désactivé
  if (!eventSettings.countdownEnabled) {
    return null;
  }

  // Si l'événement est terminé, afficher un message spécial
  if (timeLeft.finished) {
    return (
      <div className="text-center">
        <div className="font-headline text-2xl md:text-4xl font-bold text-green-500 mb-2">
          🎉 Événement Terminé !
        </div>
        <div className="text-sm text-muted-foreground">
          Merci d'avoir participé au Hackathon !
        </div>
      </div>
    );
  }

  const timeParts = [
    { label: 'Mois', value: timeLeft.months },
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ];

  return (
    <div className="text-center space-y-4">
      {/* Phase actuelle */}
      <div className="text-sm font-medium text-primary">
        {timeLeft.phase}
      </div>

      {/* Compteur */}
      <div className="flex justify-center items-start gap-2 md:gap-4">
        {timeParts.map((part) => (
          <div key={part.label} className="text-center w-16 md:w-24">
            <div
              className="font-headline text-4xl md:text-6xl font-bold text-primary"
              style={{textShadow: '0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--primary) / 0.5)'}}
            >
              {isClient ? part.value.toString().padStart(2, '0') : '00'}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-1">{part.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
