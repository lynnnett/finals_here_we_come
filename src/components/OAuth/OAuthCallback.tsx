import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/settings'), 3000);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Invalid callback parameters');
      setTimeout(() => navigate('/settings'), 3000);
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/oauth-callback?code=${code}&state=${state}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(`Successfully connected your ${data.platform} account!`);
        setTimeout(() => navigate('/settings'), 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to connect account');
        setTimeout(() => navigate('/settings'), 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred');
      setTimeout(() => navigate('/settings'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <h2 className="text-2xl font-bold text-slate-900">Connecting...</h2>
              <p className="text-slate-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Success!</h2>
              <p className="text-slate-600">{message}</p>
              <p className="text-sm text-slate-500">Redirecting to settings...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Connection Failed</h2>
              <p className="text-slate-600">{message}</p>
              <p className="text-sm text-slate-500">Redirecting to settings...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
