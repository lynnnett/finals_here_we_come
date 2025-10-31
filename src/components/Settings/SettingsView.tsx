import { useState } from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'preferences'>('profile');

  const connectedAccounts = [
    { platform: 'instagram', username: '@mystartup', connected: true, icon: Instagram, color: 'text-pink-600' },
    { platform: 'linkedin', username: 'My Startup', connected: true, icon: Linkedin, color: 'text-blue-600' },
    { platform: 'twitter', username: '@mystartup', connected: false, icon: Twitter, color: 'text-sky-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'accounts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Connected Accounts
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-3 font-medium transition-all ${
            activeTab === 'preferences'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Preferences
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Profile Information</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                placeholder="My Startup"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-2">
                Industry
              </label>
              <select
                id="industry"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option>Select an industry</option>
                <option>Technology</option>
                <option>E-commerce</option>
                <option>Food & Beverage</option>
                <option>Fashion</option>
                <option>Health & Wellness</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Social Media Accounts</h3>
          <div className="space-y-4">
            {connectedAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.platform}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <Icon className={`w-6 h-6 ${account.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 capitalize">{account.platform}</h4>
                      {account.connected && (
                        <p className="text-sm text-slate-600">{account.username}</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                    <button className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors">
                      Disconnect
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Preferences</h3>
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h4 className="font-medium text-slate-900">Email Notifications</h4>
                <p className="text-sm text-slate-600">Receive email updates about your posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h4 className="font-medium text-slate-900">Auto-save Drafts</h4>
                <p className="text-sm text-slate-600">Automatically save your work</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h4 className="font-medium text-slate-900">Calendar Sync</h4>
                <p className="text-sm text-slate-600">Sync with Google Calendar</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Connect Calendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
