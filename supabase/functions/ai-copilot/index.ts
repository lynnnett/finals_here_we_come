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
    const { message, conversationId } = await req.json();

    const systemPrompt = `You are a helpful AI assistant specialized in social media marketing and content strategy. 
You help users brainstorm content ideas, create marketing strategies, and answer questions about social media best practices. 
Be creative, practical, and provide actionable advice.`;

    const mockResponse = {
      response: `Great question! Here are some ideas based on "${message}":\n\n1. Create engaging content that resonates with your audience\n2. Post consistently at optimal times\n3. Use relevant hashtags to increase discoverability\n4. Engage with your community through comments and stories\n5. Track your analytics to understand what works\n\nWould you like me to elaborate on any of these points?`,
    };

    return new Response(
      JSON.stringify(mockResponse),
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
      JSON.stringify({ error: 'Internal server error', response: 'Sorry, I encountered an error. Please try again.' }),
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