import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { SideToolbar } from './SideToolbar';
import { AIChatPanel } from '../AICoPilot/AIChatPanel';

interface MainLayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  onCreatePost?: (content?: string) => void;
  onAddToCalendar?: (content: string) => void;
}

export function MainLayout({ children, activeView, onNavigate, onCreatePost, onAddToCalendar }: MainLayoutProps) {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToolbarNavigate = (view: string) => {
    if (view === 'ai-chat') {
      setIsChatOpen(true);
    } else {
      onNavigate(view);
    }
  };

  const handleCreatePostFromChat = (idea: string) => {
    if (onCreatePost) {
      onCreatePost(idea);
      setIsChatOpen(false);
    }
  };

  const handleAddToCalendar = (content: string) => {
    if (onAddToCalendar) {
      onAddToCalendar(content);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeView={activeView}
        onNavigate={onNavigate}
        onToggleToolbar={() => setIsToolbarOpen(!isToolbarOpen)}
      />
      <main className="p-8">
        {children}
      </main>

      <SideToolbar
        isOpen={isToolbarOpen}
        onClose={() => setIsToolbarOpen(false)}
        onNavigate={handleToolbarNavigate}
      />

      <AIChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onCreatePost={handleCreatePostFromChat}
        onAddToCalendar={handleAddToCalendar}
      />
    </div>
  );
}
