import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  Palette,
  FlaskConical,
  Zap,
  Lightbulb,
  BookOpen,
  Radar,
  User,
  CreditCard,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  end?: boolean;
}

function NavItem({ to, icon: Icon, label, collapsed, end = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-primary/10 text-primary border-l-2 border-primary',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const { user, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [contentLabOpen, setContentLabOpen] = useState(true);
  const location = useLocation();
  
  const isContentLabActive = location.pathname.startsWith('/content-lab');
  
  const onboardingProgress = (user.onboardingStep / 4) * 100;
  const showOnboardingProgress = user.onboardingStatus !== 'completed';
  
  return (
    <aside
      className={cn(
        'h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!sidebarCollapsed && (
          <span className="text-xl font-bold text-primary">Flui</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={sidebarCollapsed} />
        <NavItem to="/brand" icon={Palette} label="Marca" collapsed={sidebarCollapsed} />
        
        {/* Content Lab Section */}
        <div className="pt-2">
          {sidebarCollapsed ? (
            <NavItem 
              to="/content-lab" 
              icon={FlaskConical} 
              label="Content Lab" 
              collapsed={sidebarCollapsed} 
            />
          ) : (
            <>
              <button
                onClick={() => setContentLabOpen(!contentLabOpen)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isContentLabActive && 'text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-5 w-5" />
                  <span className="text-sm font-medium">Content Lab</span>
                </div>
                {contentLabOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {contentLabOpen && (
                <div className="ml-4 pl-4 border-l border-border space-y-1 mt-1">
                  <NavItem to="/content-lab/sprints" icon={Zap} label="Sprints" collapsed={false} />
                  <NavItem to="/content-lab/ideas" icon={Lightbulb} label="Ideias" collapsed={false} />
                  <NavItem to="/content-lab/frameworks" icon={BookOpen} label="Frameworks" collapsed={false} />
                  <NavItem to="/content-lab/radar" icon={Radar} label="Radar" collapsed={false} />
                </div>
              )}
            </>
          )}
        </div>
      </nav>
      
      {/* Onboarding Progress */}
      {showOnboardingProgress && !sidebarCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">
            Progresso do Onboarding
          </div>
          <Progress value={onboardingProgress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {user.onboardingStep} de 4 etapas
          </div>
        </div>
      )}
      
      {/* Secondary Links */}
      <div className="p-3 border-t border-border space-y-1">
        <NavItem to="/profile" icon={User} label="Perfil" collapsed={sidebarCollapsed} />
        <NavItem to="/pricing" icon={CreditCard} label="Preços" collapsed={sidebarCollapsed} />
        <NavItem to="/privacy-policy" icon={Shield} label="Privacidade" collapsed={sidebarCollapsed} />
      </div>
    </aside>
  );
}
