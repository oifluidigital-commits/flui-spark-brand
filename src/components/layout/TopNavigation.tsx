 import { useState, useEffect } from 'react';
 import { useNavigate, useLocation } from 'react-router-dom';
 import { 
   LayoutDashboard, 
   Target, 
   Calendar, 
   FileText, 
   BarChart2, 
   Menu, 
   X, 
   ChevronDown, 
   User, 
   Settings, 
   HelpCircle, 
   LogOut,
   Palette,
   Zap,
   Lightbulb,
   BookOpen,
   Radar,
   CreditCard,
   Shield,
   Sparkles,
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Avatar, AvatarFallback } from '@/components/ui/avatar';
 import { Progress } from '@/components/ui/progress';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuLabel,
   DropdownMenuGroup,
 } from '@/components/ui/dropdown-menu';
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from '@/components/ui/sheet';
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 import { getRemainingCredits, getCreditPercentage } from '@/data/mockData';
 
 // Menu item type definition
 interface MenuItem {
   id: string;
   label: string;
   icon: React.ElementType;
   route: string;
   children?: MenuItem[];
 }
 
 // Primary navigation items (center of top bar)
 const menuItems: MenuItem[] = [
   { id: 'diagnostico', label: 'Diagnóstico', icon: LayoutDashboard, route: '/dashboard' },
   { id: 'estrategia', label: 'Estratégia', icon: Target, route: '/strategy' },
   { 
     id: 'planejamento', 
     label: 'Planejamento', 
     icon: Calendar, 
     route: '/content-lab/sprints',
     children: [
       { id: 'sprints', label: 'Sprints', icon: Zap, route: '/content-lab/sprints' },
     ]
   },
   { 
     id: 'conteudos', 
     label: 'Conteúdos', 
     icon: FileText, 
     route: '/content-lab/ideas',
     children: [
       { id: 'ideas', label: 'Ideias', icon: Lightbulb, route: '/content-lab/ideas' },
       { id: 'frameworks', label: 'Frameworks', icon: BookOpen, route: '/content-lab/frameworks' },
     ]
   },
   { id: 'insights', label: 'Insights', icon: Radar, route: '/content-lab/radar' },
 ];
 
 // Secondary navigation items (mobile drawer only)
 const secondaryItems: MenuItem[] = [
   { id: 'brand', label: 'Marca', icon: Palette, route: '/brand' },
   { id: 'profile', label: 'Perfil', icon: User, route: '/profile' },
   { id: 'pricing', label: 'Preços', icon: CreditCard, route: '/pricing' },
   { id: 'privacy', label: 'Privacidade', icon: Shield, route: '/privacy-policy' },
 ];
 
 // Route to menu item mapping
 const routeToMenuItem: Record<string, string> = {
   '/dashboard': 'diagnostico',
   '/strategy': 'estrategia',
   '/estrategia': 'estrategia',
   '/content-lab/sprints': 'planejamento',
   '/content-lab/ideas': 'conteudos',
   '/content-lab/frameworks': 'conteudos',
   '/content-lab/radar': 'insights',
   '/brand': 'brand',
   '/profile': 'profile',
   '/pricing': 'pricing',
   '/privacy-policy': 'privacy',
 };
 
 export function TopNavigation() {
   const { user, setIsAuthenticated } = useApp();
   const navigate = useNavigate();
   const location = useLocation();
   
   // Derive active menu item from current route
   const [activeMenuItem, setActiveMenuItem] = useState<string>(() => {
     return routeToMenuItem[location.pathname] || 'diagnostico';
   });
   
   // Update active menu item when route changes
   useEffect(() => {
     const menuItem = routeToMenuItem[location.pathname];
     if (menuItem) {
       setActiveMenuItem(menuItem);
     }
   }, [location.pathname]);
   
   // Derive diagnostic status from user context
   const diagnosticStatus = user.onboardingStatus === 'completed' ? 'concluido' : 'em_andamento';
   
   // AI Credits
   const remainingCredits = getRemainingCredits(user);
   const creditPercentage = getCreditPercentage(user);
 
   // Mobile drawer state
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   
   // Get user initials for avatar
   const getInitials = (name: string) => {
     return name
       .split(' ')
       .map((n) => n[0])
       .join('')
       .toUpperCase()
       .slice(0, 2);
   };
   
   // Handle menu item click with navigation
   const handleMenuItemClick = (itemId: string) => {
     setActiveMenuItem(itemId);
     setMobileMenuOpen(false);
     const item = menuItems.find((m) => m.id === itemId);
     if (item) {
       navigate(item.route);
     }
   };
   
   // Handle logout (visual only)
   const handleLogout = () => {
     setIsAuthenticated(false);
   };
   
   return (
     <header className="h-16 bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
       <div className="h-full max-w-full mx-auto px-4 md:px-6 flex items-center justify-between">
         {/* LEFT: Logo */}
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
             <span className="text-primary-foreground font-bold text-sm">F</span>
           </div>
             <button 
               onClick={() => navigate('/dashboard')}
               className="font-semibold text-foreground text-lg hidden sm:inline hover:text-primary transition-colors"
             >
               Flui
             </button>
         </div>
         
         {/* CENTER: Desktop Horizontal Menu */}
         <nav className="hidden lg:flex items-center gap-1">
           {menuItems.map((item) => {
             const Icon = item.icon;
             const isActive = activeMenuItem === item.id;
             
             // If item has children, render dropdown
             if (item.children && item.children.length > 0) {
               return (
                 <DropdownMenu key={item.id}>
                   <DropdownMenuTrigger asChild>
                     <button
                       className={cn(
                         'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative',
                         'hover:text-foreground/80',
                         isActive ? 'text-foreground' : 'text-muted-foreground'
                       )}
                     >
                       <Icon className="h-4 w-4" />
                       <span>{item.label}</span>
                       <ChevronDown className="h-3 w-3 ml-1" />
                       
                       {/* Active indicator - bottom border */}
                       {isActive && (
                         <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                       )}
                     </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="center" className="min-w-[140px]">
                     {item.children.map((child) => {
                       const ChildIcon = child.icon;
                       const isChildActive = location.pathname === child.route;
                       return (
                         <DropdownMenuItem
                           key={child.id}
                           onClick={() => navigate(child.route)}
                           className={cn(
                             'cursor-pointer',
                             isChildActive && 'text-primary'
                           )}
                         >
                           <ChildIcon className="h-4 w-4 mr-2" />
                           {child.label}
                         </DropdownMenuItem>
                       );
                     })}
                   </DropdownMenuContent>
                 </DropdownMenu>
               );
             }
             
             // If no children, render simple button
             return (
               <button
                 key={item.id}
                 onClick={() => handleMenuItemClick(item.id)}
                 className={cn(
                   'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative',
                   'hover:text-foreground/80',
                   isActive ? 'text-foreground' : 'text-muted-foreground'
                 )}
               >
                 <Icon className="h-4 w-4" />
                 <span>{item.label}</span>
                 
                 {/* Active indicator - bottom border */}
                 {isActive && (
                   <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                 )}
               </button>
             );
           })}
         </nav>
         
         {/* RIGHT: Status Badge + User Avatar */}
         <div className="flex items-center gap-3">
             {/* AI Credits Counter */}
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
               <Sparkles className="h-4 w-4 text-primary" />
               <div className="flex flex-col">
                 <div className="flex items-center gap-1">
                   <span className="text-sm font-medium text-foreground">
                     {remainingCredits.toLocaleString('pt-BR')}
                   </span>
                   <span className="text-xs text-muted-foreground">créditos</span>
                 </div>
                 <Progress value={100 - creditPercentage} className="h-1 w-20" />
               </div>
             </div>
 
           {/* Diagnostic Status Badge */}
           <Badge
             variant="outline"
             className={cn(
               'hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border',
               diagnosticStatus === 'concluido'
                 ? 'border-success/50 bg-success/10 text-success'
                 : 'border-warning/50 bg-warning/10 text-warning'
             )}
           >
             <span
               className={cn(
                 'w-1.5 h-1.5 rounded-full',
                 diagnosticStatus === 'concluido' ? 'bg-success' : 'bg-warning'
               )}
             />
             {diagnosticStatus === 'concluido' ? 'Concluído' : 'Em andamento'}
           </Badge>
           
           {/* User Avatar Dropdown */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
                 <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                     {getInitials(user.name)}
                   </AvatarFallback>
                 </Avatar>
                 <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem className="cursor-pointer">
                 <User className="h-4 w-4 mr-2" />
                 Perfil
               </DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer">
                 <Settings className="h-4 w-4 mr-2" />
                 Configurações
               </DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer">
                 <HelpCircle className="h-4 w-4 mr-2" />
                 Ajuda
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                 <LogOut className="h-4 w-4 mr-2" />
                 Sair
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
           
           {/* Mobile Hamburger Menu */}
           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="lg:hidden">
                 {mobileMenuOpen ? (
                   <X className="h-5 w-5" />
                 ) : (
                   <Menu className="h-5 w-5" />
                 )}
               </Button>
             </SheetTrigger>
             <SheetContent side="right" className="w-72 bg-card border-border">
               <SheetHeader className="pb-6">
                 <SheetTitle className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                     <span className="text-primary-foreground font-bold text-sm">F</span>
                   </div>
                   <span className="font-semibold text-foreground">Flui</span>
                 </SheetTitle>
               </SheetHeader>
               
                 {/* AI Credits - Mobile */}
                 <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg mb-4">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <div className="flex-1">
                     <div className="flex items-center gap-1">
                       <span className="text-sm font-medium text-foreground">
                         {remainingCredits.toLocaleString('pt-BR')}
                       </span>
                       <span className="text-xs text-muted-foreground">créditos IA</span>
                     </div>
                     <Progress value={100 - creditPercentage} className="h-1 mt-1" />
                   </div>
                 </div>
 
               {/* Mobile Menu Items */}
               <nav className="flex flex-col gap-1">
                 {menuItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = activeMenuItem === item.id;
                   
                   return (
                       <div key={item.id}>
                         <button
                           onClick={() => handleMenuItemClick(item.id)}
                           className={cn(
                             'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left',
                             isActive
                               ? 'bg-primary/10 text-foreground border-l-2 border-primary'
                               : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                           )}
                         >
                           <Icon className="h-5 w-5" />
                           <span>{item.label}</span>
                         </button>
                         {/* Sub-items */}
                         {item.children && (
                           <div className="ml-6 pl-3 border-l border-border space-y-1 mt-1">
                             {item.children.map((child) => {
                               const ChildIcon = child.icon;
                               const isChildActive = location.pathname === child.route;
                               return (
                                 <button
                                   key={child.id}
                                   onClick={() => {
                                     navigate(child.route);
                                     setMobileMenuOpen(false);
                                   }}
                                   className={cn(
                                     'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
                                     isChildActive
                                       ? 'text-primary'
                                       : 'text-muted-foreground hover:text-foreground'
                                   )}
                                 >
                                   <ChildIcon className="h-4 w-4" />
                                   <span>{child.label}</span>
                                 </button>
                               );
                             })}
                           </div>
                         )}
                       </div>
                   );
                 })}
               </nav>
               
                 {/* Secondary Links - Mobile */}
                 <div className="mt-4 pt-4 border-t border-border space-y-1">
                   <p className="text-xs text-muted-foreground px-3 mb-2">Mais</p>
                   {secondaryItems.map((item) => {
                     const Icon = item.icon;
                     const isActive = location.pathname === item.route;
                     return (
                       <button
                         key={item.id}
                         onClick={() => {
                           navigate(item.route);
                           setMobileMenuOpen(false);
                         }}
                         className={cn(
                           'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
                           isActive
                             ? 'bg-primary/10 text-foreground'
                             : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                         )}
                       >
                         <Icon className="h-5 w-5" />
                         <span>{item.label}</span>
                       </button>
                     );
                   })}
                 </div>
 
               {/* Mobile Diagnostic Status */}
               <div className="mt-6 pt-6 border-t border-border">
                 <Badge
                   variant="outline"
                   className={cn(
                     'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border w-full justify-center',
                     diagnosticStatus === 'concluido'
                       ? 'border-success/50 bg-success/10 text-success'
                       : 'border-warning/50 bg-warning/10 text-warning'
                   )}
                 >
                   <span
                     className={cn(
                       'w-1.5 h-1.5 rounded-full',
                       diagnosticStatus === 'concluido' ? 'bg-success' : 'bg-warning'
                     )}
                   />
                   {diagnosticStatus === 'concluido' ? 'Diagnóstico Concluído' : 'Diagnóstico Em Andamento'}
                 </Badge>
               </div>
             </SheetContent>
           </Sheet>
         </div>
       </div>
     </header>
   );
 }