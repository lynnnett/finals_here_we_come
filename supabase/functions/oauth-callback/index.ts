import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OAuthState {
  platform: string;
  userId: string;
  timestamp: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      return new Response(
        JSON.stringify({ error: `OAuth error: ${error}` }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!code || !state) {
      return new Response(
        JSON.stringify({ error: "Missing code or state parameter" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const parsedState: OAuthState = JSON.parse(atob(state));
    const { platform, userId } = parsedState;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const tokenResponse = await exchangeCodeForToken(platform, code);

    if (!tokenResponse) {
      return new Response(
        JSON.stringify({ error: "Failed to exchange code for token" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const profileData = await fetchUserProfile(platform, tokenResponse.access_token);

    if (!profileData) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user profile" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
      : null;

    const { error: dbError } = await supabase
      .from("social_accounts")
      .upsert({
        user_id: userId,
        platform: platform,
        platform_user_id: profileData.id,
        platform_username: profileData.username,
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token || null,
        token_expires_at: expiresAt,
        is_active: true,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform,platform_user_id'
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save account connection" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        platform,
        username: profileData.username
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function exchangeCodeForToken(platform: string, code: string): Promise<any> {
  const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
  const clientSecret = Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`);
  const redirectUri = Deno.env.get("OAUTH_REDIRECT_URI");

  if (!clientId || !clientSecret || !redirectUri) {
    console.error(`Missing OAuth credentials for ${platform}`);
    return null;
  }

  const tokenUrls: Record<string, string> = {
    instagram: "https://api.instagram.com/oauth/access_token",
    linkedin: "https://www.linkedin.com/oauth/v2/accessToken",
    twitter: "https://api.twitter.com/2/oauth2/token",
    tiktok: "https://open-api.tiktok.com/oauth/access_token/",
  };

  const tokenUrl = tokenUrls[platform];
  if (!tokenUrl) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(`Token exchange failed: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Token exchange error:", error);
    return null;
  }
}

async function fetchUserProfile(platform: string, accessToken: string): Promise<any> {
  const profileUrls: Record<string, string> = {
    instagram: "https://graph.instagram.com/me?fields=id,username",
    linkedin: "https://api.linkedin.com/v2/me",
    twitter: "https://api.twitter.com/2/users/me",
    tiktok: "https://open-api.tiktok.com/user/info/",
  };

  const profileUrl = profileUrls[platform];
  if (!profileUrl) return null;

  try {
    const response = await fetch(profileUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(`Profile fetch failed: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    const normalizedData: Record<string, any> = {
      instagram: { id: data.id, username: data.username },
      linkedin: { id: data.id, username: data.localizedFirstName || data.id },
      twitter: { id: data.data?.id, username: data.data?.username },
      tiktok: { id: data.data?.user?.union_id, username: data.data?.user?.display_name },
    };

    return normalizedData[platform] || null;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}
