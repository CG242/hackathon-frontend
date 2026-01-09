'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Winners {
  first: string;
  second: string;
  third: string;
}

interface WinnersContextType {
  winners: Winners;
  setWinners: (winners: Winners) => void;
  areResultsPublished: boolean;
  publishResults: (published: boolean) => void;
  preselected: string[];
  setPreselected: (preselected: string[]) => void;
  arePreselectionsPublished: boolean;
  publishPreselections: (published: boolean) => void;
}

const WinnersContext = createContext<WinnersContextType | undefined>(undefined);

const initialWinners: Winners = {
  first: 'none',
  second: 'none',
  third: 'none',
};

export const WinnersProvider = ({ children }: { children: ReactNode }) => {
  const [winners, setWinnersState] = useState<Winners>(initialWinners);
  const [areResultsPublished, setAreResultsPublished] = useState(false);
  const [preselected, setPreselectedState] = useState<string[]>([]);
  const [arePreselectionsPublished, setArePreselectionsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedWinners = localStorage.getItem('hackathon_winners');
      const storedPublishedState = localStorage.getItem('hackathon_results_published');
      const storedPreselected = localStorage.getItem('hackathon_preselected');
      const storedPreselectedPublished = localStorage.getItem('hackathon_preselected_published');

      if (storedWinners) {
        setWinnersState(JSON.parse(storedWinners));
      }
      if (storedPublishedState) {
        setAreResultsPublished(JSON.parse(storedPublishedState));
      }
      if (storedPreselected) {
        setPreselectedState(JSON.parse(storedPreselected));
      }
       if (storedPreselectedPublished) {
        setArePreselectionsPublished(JSON.parse(storedPreselectedPublished));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
    setLoading(false);
  }, []);

  const setWinners = (newWinners: Winners) => {
    localStorage.setItem('hackathon_winners', JSON.stringify(newWinners));
    setWinnersState(newWinners);
  };

  const publishResults = (published: boolean) => {
    localStorage.setItem('hackathon_results_published', JSON.stringify(published));
    setAreResultsPublished(published);
  };
  
  const setPreselected = (newPreselected: string[]) => {
    localStorage.setItem('hackathon_preselected', JSON.stringify(newPreselected));
    setPreselectedState(newPreselected);
  };

  const publishPreselections = (published: boolean) => {
    localStorage.setItem('hackathon_preselected_published', JSON.stringify(published));
    setArePreselectionsPublished(published);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <WinnersContext.Provider value={{ 
        winners, setWinners, areResultsPublished, publishResults,
        preselected, setPreselected, arePreselectionsPublished, publishPreselections
    }}>
      {children}
    </WinnersContext.Provider>
  );
};

export const useWinners = () => {
  const context = useContext(WinnersContext);
  if (context === undefined) {
    throw new Error('useWinners must be used within a WinnersProvider');
  }
  return context;
};
