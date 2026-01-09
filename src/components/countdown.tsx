"use client";

import { useState, useEffect } from 'react';
import { useEvent } from '@/context/event-context';

const Countdown = () => {
  const { eventSettings } = useEvent();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !eventSettings.eventDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(eventSettings.eventDate) - +new Date();
      if (difference > 0) {
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { months, days, hours, minutes, seconds };
      }
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient, eventSettings.eventDate]);

  const timeParts = [
    { label: 'Mois', value: timeLeft.months },
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ];
  
  return (
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
  );
};

export default Countdown;
