import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { UserGateProvider } from "@/contexts/UserGateContext";
import { Loader2 } from "lucide-react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useApp();
  
  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading, profile } = useApp();
  
  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If authenticated, redirect based on onboarding status
  if (isAuthenticated && profile) {
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
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Semi-protected: requires auth but not onboarding completion */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/brand" element={<ProtectedRoute><Brand /></ProtectedRoute>} />
      <Route path="/content-lab" element={<ProtectedRoute><ContentLab /></ProtectedRoute>} />
      <Route path="/content-lab/sprints" element={<ProtectedRoute><Sprints /></ProtectedRoute>} />
      <Route path="/sprints/:sprintId" element={<ProtectedRoute><SprintDetail /></ProtectedRoute>} />
      <Route path="/content-lab/ideas" element={<ProtectedRoute><Ideas /></ProtectedRoute>} />
      <Route path="/content-lab/frameworks" element={<ProtectedRoute><Frameworks /></ProtectedRoute>} />
      <Route path="/content-lab/radar" element={<ProtectedRoute><Radar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
      <Route path="/strategy" element={<ProtectedRoute><Strategy /></ProtectedRoute>} />
      
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
