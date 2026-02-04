import { ReactNode } from 'react';
import { TopNavigation } from './TopNavigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavigation />
      <main
        className={cn(
          'flex-1 overflow-y-auto pt-16 p-6',
          'transition-all duration-300'
        )}
      >
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}