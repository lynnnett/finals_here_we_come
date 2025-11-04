import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoginForm } from './components/Auth/LoginForm';
import { MainLayout } from './components/Layout/MainLayout';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { EnhancedAICoPilotView } from './components/AICoPilot/EnhancedAICoPilotView';
import { CaptionGeneratorView } from './components/CaptionGenerator/CaptionGeneratorView';
import { EnhancedCalendarView } from './components/Calendar/EnhancedCalendarView';
import { DesignStudioView } from './components/DesignStudio/DesignStudioView';
import { AssetStudioView } from './components/AssetStudio/AssetStudioView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { SettingsView } from './components/Settings/SettingsView';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { FloatingToolbar } from './components/Layout/FloatingToolbar';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      checkOnboarding();
    }
  }, [user]);

  const checkOnboarding = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();

    if (data && !data.onboarding_completed) {
      setShowOnboarding(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'ai-copilot':
        return <EnhancedAICoPilotView />;
      case 'caption-generator':
        return <CaptionGeneratorView />;
      case 'calendar':
        return <EnhancedCalendarView />;
      case 'design-studio':
        return <DesignStudioView />;
      case 'asset-studio':
        return <AssetStudioView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <MainLayout activeView={activeView} onNavigate={setActiveView}>
          {renderView()}
        </MainLayout>
      </div>

      <FloatingToolbar />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
