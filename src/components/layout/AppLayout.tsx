 import { ReactNode } from 'react';
 import { TopNavigation } from './TopNavigation';
 
 interface AppLayoutProps {
   children: ReactNode;
 }
 
 /**
  * AppLayout component
  * 
  * Responsibilities:
  * - Renders the TopNavigation at the top
  * - Renders page content via {children}
  * - Does NOT include any page-specific logic
  */
 export function AppLayout({ children }: AppLayoutProps) {
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