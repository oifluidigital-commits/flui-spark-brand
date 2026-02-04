import { useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { getRemainingCredits, getCreditPercentage } from '@/data/mockData';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/brand': 'Marca',
  '/content-lab': 'Content Lab',
  '/content-lab/sprints': 'Sprints',
  '/content-lab/ideas': 'Ideias',
  '/content-lab/frameworks': 'Frameworks',
  '/content-lab/radar': 'Radar',
  '/profile': 'Perfil',
  '/pricing': 'Preços',
  '/privacy-policy': 'Política de Privacidade',
};

export function TopBar() {
  const { user, setIsAuthenticated } = useApp();
  const location = useLocation();
  
  const pageTitle = pageTitles[location.pathname] || 'Flui';
  const remainingCredits = getRemainingCredits(user);
  const creditPercentage = getCreditPercentage(user);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
      
      <div className="flex items-center gap-6">
        {/* AI Credits Counter */}
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {remainingCredits.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs text-muted-foreground">créditos IA</span>
            </div>
            <Progress value={100 - creditPercentage} className="h-1 w-24" />
          </div>
        </div>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">{user.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
