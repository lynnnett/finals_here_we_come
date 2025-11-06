import { Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Welcome back!</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
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
    </header>
  );
}
