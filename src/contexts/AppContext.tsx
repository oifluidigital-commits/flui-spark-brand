import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  Brand,
  Sprint,
  Idea,
  Framework,
  Trend,
} from '@/types';
import {
  mockUser,
  mockBrand,
  mockSprints,
  mockIdeas,
  mockFrameworks,
  mockTrends,
} from '@/data/mockData';

interface AppContextType {
  // User state
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Auth actions
  logout: () => void;
  
  // Brand state
  brand: Brand;
  setBrand: React.Dispatch<React.SetStateAction<Brand>>;
  
  // Sprints state
  sprints: Sprint[];
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  addSprint: (sprint: Sprint) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  
  // Ideas state
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  
  // Frameworks state
  frameworks: Framework[];
  setFrameworks: React.Dispatch<React.SetStateAction<Framework[]>>;
  addFramework: (framework: Framework) => void;
  
  // Trends state
  trends: Trend[];
  
  // Onboarding
  completeOnboardingStep: () => void;
  completeOnboarding: () => void;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User state
  const [user, setUser] = useState<User>(mockUser);
  
  // Brand state
  const [brand, setBrand] = useState<Brand>(mockBrand);
  
  // Sprints state
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  
  // Ideas state
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  
  // Frameworks state
  const [frameworks, setFrameworks] = useState<Framework[]>(mockFrameworks);
  
  // Trends state (read-only mock)
  const [trends] = useState<Trend[]>(mockTrends);
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Sprint CRUD
  const addSprint = (sprint: Sprint) => {
    setSprints((prev) => [...prev, sprint]);
  };
  
  const updateSprint = (id: string, updates: Partial<Sprint>) => {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.id === id ? { ...sprint, ...updates, updatedAt: new Date().toISOString() } : sprint
      )
    );
  };
  
  const deleteSprint = (id: string) => {
    setSprints((prev) => prev.filter((sprint) => sprint.id !== id));
  };
  
  // Ideas CRUD
  const addIdea = (idea: Idea) => {
    setIdeas((prev) => [...prev, idea]);
  };
  
  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, ...updates, updatedAt: new Date().toISOString() } : idea
      )
    );
  };
  
  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };
  
  // Frameworks
  const addFramework = (framework: Framework) => {
    setFrameworks((prev) => [...prev, framework]);
  };
  
  // Onboarding helpers
  const completeOnboardingStep = () => {
    setUser((prev) => ({
      ...prev,
      onboardingStep: Math.min(prev.onboardingStep + 1, 4),
    }));
  };
  
  const completeOnboarding = () => {
    setUser((prev) => ({
      ...prev,
      onboardingStatus: 'completed',
      onboardingStep: 4,
    }));
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        brand,
        setBrand,
        sprints,
        setSprints,
        addSprint,
        updateSprint,
        deleteSprint,
        ideas,
        setIdeas,
        addIdea,
        updateIdea,
        deleteIdea,
        frameworks,
        setFrameworks,
        addFramework,
        trends,
        completeOnboardingStep,
        completeOnboarding,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
