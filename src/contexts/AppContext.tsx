import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  User,
  Brand,
  Sprint,
  Idea,
  Framework,
  Trend,
} from '@/types';
import { DiagnosticResult } from '@/data/onboardingData';
import { Strategy } from '@/data/strategyData';
import { useAuth, Profile } from '@/hooks/useAuth';

// Default empty user (no mock data)
const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  onboardingStatus: 'not_started',
  onboardingStep: 0,
  plan: 'free',
  aiCredits: { total: 0, used: 0 },
  createdAt: new Date().toISOString(),
};

interface AppContextType {
  // User state
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Auth profile from Supabase
  profile: Profile | null;
  isAuthLoading: boolean;
  needsNameCollection: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<boolean>;
  
  // Brand state
  brand: Brand | null;
  setBrand: React.Dispatch<React.SetStateAction<Brand | null>>;
  
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
  
  // Legacy auth state (syncs with real auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // All state initialized empty — no mock data
  const [user, setUser] = useState<User>(defaultUser);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [trends] = useState<Trend[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync auth state with real Supabase auth
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated);
    
    // Populate user exclusively from authenticated profile
    if (auth.profile) {
      setUser({
        id: auth.profile.user_id,
        name: auth.profile.name || '',
        email: auth.profile.email || '',
        avatar: auth.profile.avatar_url || undefined,
        onboardingStatus: auth.profile.onboarding_status,
        onboardingStep: auth.profile.onboarding_step,
        plan: auth.profile.plan,
        aiCredits: {
          total: auth.profile.ai_credits_total,
          used: auth.profile.ai_credits_used,
        },
        createdAt: auth.profile.created_at || new Date().toISOString(),
      });
    }
  }, [auth.isAuthenticated, auth.profile]);


  // Derive brand from strategy when strategy changes
  useEffect(() => {
    if (strategy) {
      setBrand({
        id: `brand-${user.id}`,
        userId: user.id,
        name: user.name || 'Minha Marca',
        colors: {
          primary: '#6366f1',
          secondary: '#10b981',
          accent: '#f59e0b',
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
        },
        voice: {
          tone: strategy.diagnosticSummary.dominantTone
            ? strategy.diagnosticSummary.dominantTone.split(',').map((t) => t.trim())
            : [],
          personality: strategy.diagnosticSummary.brandArchetype
            ? [strategy.diagnosticSummary.brandArchetype]
            : [],
          examples: [],
        },
        positioning: {
          valueProposition: strategy.strategicGoal.statement,
          differentiators: strategy.contentPillars.map((p) => p.name),
          targetAudience: strategy.diagnosticSummary.targetAudience,
        },
        pillars: strategy.contentPillars.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          percentage: p.focusPercentage,
          color: p.color,
        })),
        competitors: [],
      });
    }
  }, [strategy, user.id, user.name]);
  
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
        needsNameCollection: auth.needsNameCollection,
        signOut: async () => {
          await auth.signOut();
          setDiagnosticResult(null);
          setStrategy(null);
        },
        refreshProfile: auth.refreshProfile,
        updateProfile: auth.updateProfile,
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
