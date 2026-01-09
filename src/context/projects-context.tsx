'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Project = {
    name: string;
    description: string;
    team: string[];
    tags: string[];
};

interface ProjectsContextType {
    projects: Project[];
    addProject: (project: Project) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const initialProjects: Project[] = [
    {
        name: "Projet Alpha",
        description: "Plateforme de gestion de projets innovante utilisant l'IA pour optimiser les tâches.",
        team: ["CFI-CIRAS", "CFI-CIRAS", "CFI-CIRAS"],
        tags: ["IA", "Productivité", "Web"],
    },
    {
        name: "Eco-Tracker",
        description: "Application mobile pour suivre et réduire son empreinte carbone au quotidien.",
        team: ["CFI-CIRAS", "CFI-CIRAS", "CFI-CIRAS"],
        tags: ["Mobile", "Écologie", "Gamification"],
    },
    {
        name: "Health-Bot",
        description: "Un chatbot médical pour le diagnostic préliminaire et la prise de rendez-vous.",
        team: ["CFI-CIRAS", "CFI-CIRAS", "CFI-CIRAS"],
        tags: ["Santé", "Chatbot", "IA"],
    },
    {
        name: "Data-Viz",
        description: "Outil de visualisation de données en temps réel pour les marchés financiers.",
        team: ["CFI-CIRAS", "CFI-CIRAS"],
        tags: ["Data", "Finance", "Web"],
    }
];

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);

    const addProject = (project: Project) => {
        setProjects(prevProjects => [project, ...prevProjects]);
    };

    return (
        <ProjectsContext.Provider value={{ projects, addProject }}>
            {children}
        </ProjectsContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};
