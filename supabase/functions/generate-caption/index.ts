import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { topic, tone, purpose, platforms } = await req.json();

    const generateCaption = (platform: string) => {
      const baseCaptions: Record<string, string> = {
        instagram: `✨ ${topic} is here! We're thrilled to share this exciting update with you. Swipe to learn more! 💫`,
        tiktok: `POV: You just discovered ${topic} 🔥 This is going to change everything! #trending #viral`,
        linkedin: `We're excited to announce ${topic}. This represents a significant milestone in our journey to deliver exceptional value to our community.`,
        twitter: `🚀 Big news! ${topic} is officially here. This is just the beginning. Stay tuned for more updates!`,
      };

      const hashtags: Record<string, string[]> = {
        instagram: ['#startup', '#innovation', '#newrelease', '#trending', '#instagood'],
        tiktok: ['#fyp', '#viral', '#trending', '#foryou', '#newrelease'],
        linkedin: ['#business', '#innovation', '#growth', '#professional', '#success'],
        twitter: ['#startup', '#tech', '#innovation', '#news', '#announcement'],
      };

      return {
        platform,
        caption: baseCaptions[platform] || baseCaptions.instagram,
        hashtags: hashtags[platform] || hashtags.instagram,
      };
    };

    const captions = platforms.map((platform: string) => generateCaption(platform));

    return new Response(
      JSON.stringify({ captions }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', captions: [] }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});