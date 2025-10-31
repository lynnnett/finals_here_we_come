import {
  LayoutDashboard,
  MessageSquare,
  PenTool,
  Calendar,
  Image,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', id: 'dashboard' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'AI Co-Pilot', id: 'ai-copilot' },
  { icon: <PenTool className="w-5 h-5" />, label: 'Caption Generator', id: 'caption-generator' },
  { icon: <Calendar className="w-5 h-5" />, label: 'Content Calendar', id: 'calendar' },
  { icon: <Image className="w-5 h-5" />, label: 'Asset Studio', id: 'asset-studio' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', id: 'analytics' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', id: 'settings' },
];

interface SidebarProps {
  activeView?: string;
  onNavigate?: (viewId: string) => void;
}

export function Sidebar({ activeView = 'dashboard', onNavigate }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">SocialHub AI</h1>
            <p className="text-xs text-slate-500">Content Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === item.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 text-sm mb-1">Upgrade to Pro</h3>
          <p className="text-xs text-slate-600 mb-3">Unlock unlimited AI generations</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
