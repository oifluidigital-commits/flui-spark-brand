import { ReactNode } from 'react';
 import { TopNavigation } from './TopNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
     <div className="min-h-screen bg-background">
       {/* Top Navigation Bar */}
       <TopNavigation />
       
       {/* Main Content Area - with top padding for fixed header */}
       <main className="pt-16">
         <div className="p-6">
          {children}
         </div>
       </main>
    </div>
  );
}
