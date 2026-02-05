import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";

// Pages
import Login from "./pages/Login";
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

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.onboardingStatus !== 'completed') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/brand" element={<ProtectedRoute><Brand /></ProtectedRoute>} />
      <Route path="/content-lab" element={<ProtectedRoute><ContentLab /></ProtectedRoute>} />
      <Route path="/content-lab/sprints" element={<ProtectedRoute><Sprints /></ProtectedRoute>} />
      <Route path="/content-lab/ideas" element={<ProtectedRoute><Ideas /></ProtectedRoute>} />
      <Route path="/content-lab/frameworks" element={<ProtectedRoute><Frameworks /></ProtectedRoute>} />
      <Route path="/content-lab/radar" element={<ProtectedRoute><Radar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
       <Route path="/estrategia" element={<ProtectedRoute><Strategy /></ProtectedRoute>} />
      
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
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
