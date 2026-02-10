import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { UserGateProvider } from "@/contexts/UserGateContext";
import { Loader2 } from "lucide-react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Brand from "./pages/Brand";
import ContentLab from "./pages/ContentLab";
import Sprints from "./pages/Sprints";
import Ideas from "./pages/Ideas";
import Frameworks from "./pages/Frameworks";
import Radar from "./pages/Radar";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Strategy from "./pages/Strategy";
import SprintDetail from "./pages/SprintDetail";

const queryClient = new QueryClient();

function AuthLoader({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useApp();
  
  if (isAuthLoading) return <AuthLoader>{null}</AuthLoader>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

// Strict guard: requires auth + name + onboarding completed
function OnboardingGuardedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading, profile } = useApp();

  if (isAuthLoading) return <AuthLoader>{null}</AuthLoader>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Name missing → force name collection
  if (profile && (!profile.name || profile.name.trim() === '')) {
    return <Navigate to="/complete-profile" replace />;
  }
  
  // Onboarding not completed → force onboarding
  if (profile && profile.onboarding_status !== 'completed') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading, profile } = useApp();
  
  if (isAuthLoading) return <AuthLoader>{null}</AuthLoader>;
  
  if (isAuthenticated && profile) {
    // Name missing → complete profile first
    if (!profile.name || profile.name.trim() === '') {
      return <Navigate to="/complete-profile" replace />;
    }
    if (profile.onboarding_status === 'completed') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<Navigate to="/login" replace />} />
      
      {/* Semi-protected: requires auth but not onboarding */}
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
      
      {/* Fully guarded routes: auth + name + onboarding completed */}
      <Route path="/dashboard" element={<OnboardingGuardedRoute><Dashboard /></OnboardingGuardedRoute>} />
      <Route path="/brand" element={<OnboardingGuardedRoute><Brand /></OnboardingGuardedRoute>} />
      <Route path="/content-lab" element={<OnboardingGuardedRoute><ContentLab /></OnboardingGuardedRoute>} />
      <Route path="/content-lab/sprints" element={<OnboardingGuardedRoute><Sprints /></OnboardingGuardedRoute>} />
      <Route path="/sprints/:sprintId" element={<OnboardingGuardedRoute><SprintDetail /></OnboardingGuardedRoute>} />
      <Route path="/content-lab/ideas" element={<OnboardingGuardedRoute><Ideas /></OnboardingGuardedRoute>} />
      <Route path="/content-lab/frameworks" element={<OnboardingGuardedRoute><Frameworks /></OnboardingGuardedRoute>} />
      <Route path="/content-lab/radar" element={<OnboardingGuardedRoute><Radar /></OnboardingGuardedRoute>} />
      <Route path="/profile" element={<OnboardingGuardedRoute><Profile /></OnboardingGuardedRoute>} />
      <Route path="/strategy" element={<OnboardingGuardedRoute><Strategy /></OnboardingGuardedRoute>} />
      
      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <UserGateProvider>
            <AppRoutes />
          </UserGateProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
