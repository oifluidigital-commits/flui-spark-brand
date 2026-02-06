import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { DiagnosticResult } from '@/data/onboardingData';
import { Strategy } from '@/data/strategyData';
import { useAuth, Profile } from '@/hooks/useAuth';

interface AppContextType {
  // User state
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Auth profile from Supabase
  profile: Profile | null;
  isAuthLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Brand state
  brand: Brand;
  setBrand: React.Dispatch<React.SetStateAction<Brand>>;
  
  // Diagnostic state
  diagnosticResult: DiagnosticResult | null;
  setDiagnosticResult: React.Dispatch<React.SetStateAction<DiagnosticResult | null>>;
  
  // Strategy state
  strategy: Strategy | null;
  setStrategy: React.Dispatch<React.SetStateAction<Strategy | null>>;

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
  // Real auth from Supabase
  const auth = useAuth();
  
  // Legacy auth state (will sync with real auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // User state (will sync with profile)
  const [user, setUser] = useState<User>(mockUser);
  
  // Brand state
  const [brand, setBrand] = useState<Brand>(mockBrand);
  
  // Diagnostic state
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  
  // Strategy state
  const [strategy, setStrategy] = useState<Strategy | null>(null);

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

  // Sync auth state with real Supabase auth
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated);
    
    // Sync user data with profile
    if (auth.profile) {
      setUser((prev) => ({
        ...prev,
        id: auth.profile!.user_id,
        name: auth.profile!.name || prev.name,
        email: auth.profile!.email || prev.email,
        avatar: auth.profile!.avatar_url || prev.avatar,
        onboardingStatus: auth.profile!.onboarding_status,
        onboardingStep: auth.profile!.onboarding_step,
        plan: auth.profile!.plan,
        aiCredits: {
          total: auth.profile!.ai_credits_total,
          used: auth.profile!.ai_credits_used,
        },
      }));
    }
  }, [auth.isAuthenticated, auth.profile]);
  
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
      onboardingStep: Math.min(prev.onboardingStep + 1, 7),
      onboardingStatus: 'in_progress',
    }));
  };
  
  const completeOnboarding = () => {
    setUser((prev) => ({
      ...prev,
      onboardingStatus: 'completed',
      onboardingStep: 7,
    }));
  };
  
  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        profile: auth.profile,
        isAuthLoading: auth.isLoading,
        signOut: auth.signOut,
        refreshProfile: auth.refreshProfile,
        brand,
        setBrand,
        diagnosticResult,
        setDiagnosticResult,
        strategy,
        setStrategy,
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
