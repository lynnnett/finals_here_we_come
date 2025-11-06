import { useState } from 'react';
import { Bell, User, LayoutDashboard, Sparkles, PenTool, Calendar, Image, BarChart3, Settings, Palette, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onToggleToolbar?: () => void;
}

export function Header({ activeView, onNavigate, onToggleToolbar }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-copilot', label: 'AI Co-Pilot', icon: Sparkles },
    { id: 'caption-generator', label: 'Captions', icon: PenTool },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'design-studio', label: 'Design', icon: Palette },
    { id: 'asset-studio', label: 'Assets', icon: Image },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ContentHub</h1>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleToolbar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Toggle Toolbar"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-3 pl-3 pr-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.email?.split('@')[0]}</span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 hidden group-hover:block">
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Billing
              </button>
              <hr className="my-2 border-slate-200" />
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}
