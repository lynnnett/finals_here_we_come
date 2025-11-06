export interface OAuthConfig {
  authUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string[];
}

const OAUTH_CONFIGS: Record<string, Partial<OAuthConfig>> = {
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scope: ['user_profile', 'user_media'],
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    scope: ['user.info.basic', 'video.publish', 'video.list'],
  },
};

export function getOAuthUrl(platform: string, state: string): string | null {
  const config = OAUTH_CONFIGS[platform];
  if (!config || !config.authUrl) return null;

  const clientId = getClientId(platform);
  if (!clientId) return null;

  const redirectUri = getRedirectUri();
  const scope = config.scope?.join(' ') || '';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: state,
  });

  return `${config.authUrl}?${params.toString()}`;
}

function getClientId(platform: string): string | null {
  const envKey = `VITE_${platform.toUpperCase()}_CLIENT_ID`;
  return import.meta.env[envKey] || null;
}

function getRedirectUri(): string {
  return `${window.location.origin}/oauth/callback`;
}

export function generateOAuthState(platform: string, userId: string): string {
  const state = {
    platform,
    userId,
    timestamp: Date.now(),
  };
  return btoa(JSON.stringify(state));
}

export function parseOAuthState(stateString: string): { platform: string; userId: string; timestamp: number } | null {
  try {
    return JSON.parse(atob(stateString));
  } catch {
    return null;
  }
}
