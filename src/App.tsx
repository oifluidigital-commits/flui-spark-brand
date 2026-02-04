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
import Diagnostico from "./pages/Diagnostico";
import Estrategia from "./pages/Estrategia";
import Planejamento from "./pages/Planejamento";
import Conteudos from "./pages/Conteudos";
import Insights from "./pages/Insights";
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
      
      {/* New main navigation routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/diagnostico" element={<ProtectedRoute><Diagnostico /></ProtectedRoute>} />
      <Route path="/estrategia" element={<ProtectedRoute><Estrategia /></ProtectedRoute>} />
      <Route path="/planejamento" element={<ProtectedRoute><Planejamento /></ProtectedRoute>} />
      <Route path="/conteudos" element={<ProtectedRoute><Conteudos /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      
      {/* Legacy routes */}
      <Route path="/brand" element={<ProtectedRoute><Brand /></ProtectedRoute>} />
      <Route path="/content-lab" element={<ProtectedRoute><ContentLab /></ProtectedRoute>} />
      <Route path="/content-lab/sprints" element={<ProtectedRoute><Sprints /></ProtectedRoute>} />
      <Route path="/content-lab/ideas" element={<ProtectedRoute><Ideas /></ProtectedRoute>} />
      <Route path="/content-lab/frameworks" element={<ProtectedRoute><Frameworks /></ProtectedRoute>} />
      <Route path="/content-lab/radar" element={<ProtectedRoute><Radar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
      
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
