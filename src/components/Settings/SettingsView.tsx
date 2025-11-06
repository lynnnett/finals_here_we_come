import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, Music, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getOAuthUrl, generateOAuthState } from '../../lib/oauth';

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
  platform_username: string;
  is_active: boolean;
  connected_at: string;
}

interface PlatformConfig {
  platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter';
  name: string;
  icon: any;
  color: string;
}

const PLATFORMS: PlatformConfig[] = [
  { platform: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { platform: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { platform: 'twitter', name: 'Twitter (X)', icon: Twitter, color: 'text-sky-500' },
  { platform: 'tiktok', name: 'TikTok', icon: Music, color: 'text-slate-900' },
];

export function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'preferences'>('profile');
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    company_name: '',
    industry: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadConnectedAccounts();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('full_name, company_name, industry')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data) {
      setUserProfile({
        full_name: data.full_name || '',
        company_name: data.company_name || '',
        industry: data.industry || '',
      });
    }
  };

  const loadConnectedAccounts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      setConnectedAccounts(data);
    }
    setLoading(false);
  };

  const handleConnectAccount = async (platform: string) => {
    if (!user) return;

    setConnectingPlatform(platform);

    const state = generateOAuthState(platform, user.id);
    const oauthUrl = getOAuthUrl(platform, state);

    if (!oauthUrl) {
      setSaveMessage({
        type: 'error',
        text: `OAuth is not configured for ${platform}. Please add your client credentials to enable this integration.`
      });
      setTimeout(() => {
        setConnectingPlatform(null);
        setSaveMessage(null);
      }, 4000);
      return;
    }

    window.location.href = oauthUrl;
  };

  const handleDisconnectAccount = async (accountId: string, platform: string) => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      return;
    }

    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', accountId);

    if (!error) {
      setSaveMessage({ type: 'success', text: `${platform} account disconnected successfully!` });
      loadConnectedAccounts();
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: 'Failed to disconnect account. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        full_name: userProfile.full_name,
        company_name: userProfile.company_name,
        industry: userProfile.industry,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (!error) {
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const getAccountForPlatform = (platform: string) => {
    return connectedAccounts.find(acc => acc.platform === platform && acc.is_active);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg border ${
          saveMessage.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{saveMessage.text}</span>
          </div>
        </div>
      )}

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
                value={userProfile.full_name}
                onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
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
                value={userProfile.company_name}
                onChange={(e) => setUserProfile({ ...userProfile, company_name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-2">
                Industry
              </label>
              <select
                id="industry"
                value={userProfile.industry}
                onChange={(e) => setUserProfile({ ...userProfile, industry: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="ecommerce">E-commerce</option>
                <option value="food_beverage">Food & Beverage</option>
                <option value="fashion">Fashion</option>
                <option value="health_wellness">Health & Wellness</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Social Media Accounts</h3>

          {loading ? (
            <div className="text-center py-8 text-slate-600">Loading accounts...</div>
          ) : (
            <div className="space-y-4">
              {PLATFORMS.map((platformConfig) => {
                const account = getAccountForPlatform(platformConfig.platform);
                const Icon = platformConfig.icon;
                const isConnecting = connectingPlatform === platformConfig.platform;

                return (
                  <div
                    key={platformConfig.platform}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <Icon className={`w-6 h-6 ${platformConfig.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{platformConfig.name}</h4>
                        {account ? (
                          <p className="text-sm text-slate-600">
                            @{account.platform_username}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-500">Not connected</p>
                        )}
                      </div>
                    </div>
                    {account ? (
                      <button
                        onClick={() => handleDisconnectAccount(account.id, platformConfig.name)}
                        className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectAccount(platformConfig.platform)}
                        disabled={isConnecting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                      >
                        {isConnecting ? 'Connecting...' : 'Connect'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">About Social Media Connections</h4>
            <p className="text-sm text-blue-800">
              Connect your social media accounts to enable automated posting, analytics tracking, and cross-platform content management.
              Your credentials are securely encrypted and stored.
            </p>
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
