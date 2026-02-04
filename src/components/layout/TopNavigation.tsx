import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Activity,
  Target,
  Calendar,
  FileText,
  BarChart,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

// Navigation items
const navItems = [
  { label: 'Diagnóstico', path: '/diagnostico', icon: Activity },
  { label: 'Estratégia', path: '/estrategia', icon: Target },
  { label: 'Planejamento', path: '/planejamento', icon: Calendar },
  { label: 'Conteúdos', path: '/conteudos', icon: FileText },
  { label: 'Insights', path: '/insights', icon: BarChart },
];

// Mock diagnostic status
type DiagnosticStatus = 'em_andamento' | 'concluido';

const mockDiagnosticStatus: DiagnosticStatus = 'em_andamento';

export function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const diagnosticStatus = mockDiagnosticStatus;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-900 border-b border-zinc-800">
      <div className="h-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
        {/* Left - Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:block">
            Flui
          </span>
        </Link>

        {/* Center - Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  active
                    ? 'text-zinc-50'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {/* Active indicator */}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right - Status Badge + Avatar */}
        <div className="flex items-center gap-4">
          {/* Diagnostic Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              'hidden sm:flex items-center gap-1.5 py-1 px-2.5',
              diagnosticStatus === 'concluido'
                ? 'border-emerald-500/50 text-emerald-500'
                : 'border-amber-500/50 text-amber-500'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                diagnosticStatus === 'concluido'
                  ? 'bg-emerald-500'
                  : 'bg-amber-500 animate-pulse'
              )}
            />
            {diagnosticStatus === 'concluido' ? 'Concluído' : 'Em andamento'}
          </Badge>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(user.name || 'U')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(user.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user.name || 'Usuário'}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-zinc-400 hover:text-zinc-50 focus:text-zinc-50"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="cursor-pointer text-zinc-400 hover:text-zinc-50 focus:text-zinc-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/help')}
                className="cursor-pointer text-zinc-400 hover:text-zinc-50 focus:text-zinc-50"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Ajuda
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-500 hover:text-red-400 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-zinc-900 border-zinc-800 p-0">
              <SheetHeader className="p-4 border-b border-zinc-800">
                <SheetTitle className="text-foreground">Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Items */}
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary/10 text-zinc-50 border-l-2 border-indigo-600'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Status Badge */}
              <div className="px-4 py-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'w-full justify-center py-2',
                    diagnosticStatus === 'concluido'
                      ? 'border-emerald-500/50 text-emerald-500'
                      : 'border-amber-500/50 text-amber-500'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full mr-2',
                      diagnosticStatus === 'concluido'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500 animate-pulse'
                    )}
                  />
                  {diagnosticStatus === 'concluido' ? 'Concluído' : 'Em andamento'}
                </Badge>
              </div>

              {/* Mobile Profile Section */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(user.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {user.name || 'Usuário'}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleNavigate('/profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}