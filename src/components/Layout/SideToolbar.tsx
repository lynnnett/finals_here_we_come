import { X, FolderOpen, FileText, Image, Settings, MessageSquare } from 'lucide-react';

interface SideToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export function SideToolbar({ isOpen, onClose, onNavigate }: SideToolbarProps) {
  const menuItems = [
    { id: 'content-library', label: 'Content Library', icon: FolderOpen, description: 'Browse saved posts and drafts' },
    { id: 'templates', label: 'Templates', icon: FileText, description: 'Pre-made post templates' },
    { id: 'brand-assets', label: 'Brand Assets', icon: Image, description: 'Logos, colors, and fonts' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Account and preferences' },
    { id: 'ai-chat', label: 'AI Co-Pilot Chat', icon: MessageSquare, description: 'Get content ideas instantly' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Quick Access</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-slate-900">{item.label}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-gradient-to-t from-slate-50">
          <div className="bg-blue-600 text-white rounded-lg p-4">
            <h3 className="font-semibold mb-1">Need help?</h3>
            <p className="text-sm text-blue-100 mb-3">Chat with our AI assistant for content ideas</p>
            <button
              onClick={() => {
                onNavigate('ai-chat');
                onClose();
              }}
              className="w-full bg-white text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Open AI Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
