import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function MainLayout({ children, activeView, onNavigate }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeView={activeView} onNavigate={onNavigate} />
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
