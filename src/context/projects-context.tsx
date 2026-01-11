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

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);

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
