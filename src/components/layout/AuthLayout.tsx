import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-violet-600">Flui</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Sua estratégia de conteúdo em um lugar
          </p>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
