 import { useState } from 'react';
 import { Activity, Target, Calendar, FileText, BarChart2, Menu, X, ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
 import { cn } from '@/lib/utils';
 import { useApp } from '@/contexts/AppContext';
 
 // Menu item type definition
 interface MenuItem {
   id: string;
   label: string;
   icon: React.ElementType;
 }
 
 // Menu items configuration (visual only, no routes)
 const menuItems: MenuItem[] = [
   { id: 'diagnostico', label: 'Diagnóstico', icon: Activity },
   { id: 'estrategia', label: 'Estratégia', icon: Target },
   { id: 'planejamento', label: 'Planejamento', icon: Calendar },
   { id: 'conteudos', label: 'Conteúdos', icon: FileText },
   { id: 'insights', label: 'Insights', icon: BarChart2 },
 ];
 
 // Diagnostic status type
 type DiagnosticStatus = 'em_andamento' | 'concluido';
 
 export function TopNavigation() {
   const { user, setIsAuthenticated } = useApp();
   
   // Local mock state for active menu item
   const [activeMenuItem, setActiveMenuItem] = useState<string>('diagnostico');
   
   // Local mock state for diagnostic status
   const [diagnosticStatus] = useState<DiagnosticStatus>('em_andamento');
   
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
   
   // Handle menu item click (visual state only)
   const handleMenuItemClick = (itemId: string) => {
     setActiveMenuItem(itemId);
     setMobileMenuOpen(false);
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
           <span className="font-semibold text-foreground text-lg hidden sm:inline">Flui</span>
         </div>
         
         {/* CENTER: Desktop Horizontal Menu */}
         <nav className="hidden lg:flex items-center gap-1">
           {menuItems.map((item) => {
             const Icon = item.icon;
             const isActive = activeMenuItem === item.id;
             
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
               
               {/* Mobile Menu Items */}
               <nav className="flex flex-col gap-1">
                 {menuItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = activeMenuItem === item.id;
                   
                   return (
                     <button
                       key={item.id}
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
                   );
                 })}
               </nav>
               
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