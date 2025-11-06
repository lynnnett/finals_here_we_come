import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, conversationId, context } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    let conversationHistory: Array<{ role: string; content: string }> = [];

    if (conversationId) {
      const { data: messages } = await supabase
        .from("ai_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(20);

      if (messages) {
        conversationHistory = messages;
      }
    }

    const systemPrompt = `You are an expert AI assistant specialized in social media marketing, content strategy, and digital marketing. You provide thoughtful, comprehensive, and highly relevant responses.

# Your Core Expertise:
- Social Media Platforms: Instagram, TikTok, LinkedIn, Twitter/X, Facebook
- Content Creation: Ideation, copywriting, visual strategy, storytelling
- Marketing Strategy: Campaign planning, audience targeting, brand positioning
- Analytics & Optimization: Performance tracking, A/B testing, growth tactics
- Community Management: Engagement, customer service, reputation management
- Platform Algorithms: Understanding reach, virality, and ranking factors
- Trending Content: Current trends, viral formats, hashtag strategies

${context?.company ? `# User Context:\nCompany: ${context.company}` : ''}
${context?.industry ? `Industry: ${context.industry}\n` : ''}
${context?.platforms ? `Connected Platforms: ${context.platforms}\n` : ''}

# Response Guidelines:

1. **Understand Intent First**: Carefully analyze what the user is actually asking for. Consider:
   - Are they asking for ideas, advice, or execution help?
   - Is this a broad question or specific request?
   - What level of detail would be most helpful?

2. **Provide Relevant, Specific Answers**:
   - Address the exact question asked - don't provide generic advice
   - When asked for weekly content ideas, provide 7 distinct, detailed ideas (one per day)
   - When asked for strategy, provide comprehensive 30-day frameworks
   - When asked for product announcements, create platform-specific versions
   - When asked for posting times, give specific hours and reasoning
   - When asked for hashtags, provide categorized, relevant tags with explanations
   - When asked to improve captions, give concrete before/after examples

3. **Be Contextually Aware**:
   - Reference their industry when relevant
   - Tailor content to their company type and audience
   - Consider which platforms they're using
   - Build on previous conversation context
   - Remember what you've already suggested

4. **Format for Clarity**:
   - Use **bold headings** for main sections
   - Use ### for subsections
   - Use bullet points (•) for lists
   - Number steps for day-by-day or sequential processes
   - Keep paragraphs concise (2-3 sentences max)
   - Add blank lines between sections
   - Use emojis sparingly for visual breaks

5. **Tone & Style**:
   - Conversational and friendly, but professional
   - Confident but not condescending
   - Encouraging and positive
   - Direct and action-oriented
   - Specific and detailed

6. **When to Ask Questions**:
   - Only ask clarifying questions if the request is genuinely unclear
   - Don't ask unnecessary questions if you can provide value immediately
   - If you ask questions, still provide initial helpful information

7. **Avoid**:
   - Generic, one-size-fits-all advice
   - Vague suggestions without specifics
   - Repeating the same suggestions multiple times
   - Asking obvious questions you should already know from context
   - Overly promotional or salesy language

Remember: Your goal is to be HELPFUL, SPECIFIC, and ACTIONABLE. Give the user exactly what they need with concrete examples they can implement immediately.`;

    const messages_for_api = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    if (!OPENAI_API_KEY) {
      const fallbackResponse = generateIntelligentFallback(message, context);
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages_for_api,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.6,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
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
    const fallbackResponse = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or rephrase your question.";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        response: fallbackResponse
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateIntelligentFallback(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("content ideas") || lowerMessage.includes("brainstorm")) {
    return `Great! Let me help you brainstorm content ideas${context?.industry ? ` for the ${context.industry} industry` : ''}:

**Educational Content:**
• Behind-the-scenes of your process
• Tips and tricks in your niche
• Common mistakes to avoid
• How-to tutorials

**Engagement Content:**
• Ask your audience questions
• Polls and interactive stories
• User-generated content campaigns
• "This or That" comparisons

**Value-Driven Content:**
• Industry insights and trends
• Quick wins your audience can implement
• Case studies and success stories
• Expert interviews or collaborations

**Trending Content:**
• React to current events in your industry
• Participate in viral challenges (when relevant)
• Seasonal and holiday-themed posts
• Meme marketing (when appropriate)

Would you like me to dive deeper into any of these categories?`;
  }

  if (lowerMessage.includes("caption") || lowerMessage.includes("write")) {
    return `I'd love to help you write an engaging caption! To create the perfect caption, I need a bit more information:

**Tell me about:**
1. What's the post about? (product, announcement, behind-the-scenes, etc.)
2. What platform? (Instagram, LinkedIn, TikTok, Twitter)
3. What tone do you want? (professional, casual, witty, inspirational)
4. What action do you want people to take? (comment, share, visit link, buy)

**Caption Best Practices:**
• Start with a hook to grab attention
• Keep it concise but meaningful
• Include a clear call-to-action
• Use emojis strategically
• Add relevant hashtags (but not too many!)

Share those details and I'll craft something amazing for you!`;
  }

  if (lowerMessage.includes("hashtag")) {
    return `Let's talk hashtag strategy! Here's what you need to know:

**The Hashtag Formula:**
• 3-5 branded hashtags (your own)
• 5-10 niche hashtags (your specific industry)
• 5-10 community hashtags (broader but relevant)
• 2-5 trending hashtags (current popular ones)

**Best Practices:**
• Mix high-volume and low-volume hashtags
• Research hashtags before using them
• Create a branded hashtag for your business
• Avoid banned or spammy hashtags
• Update your hashtag sets regularly

**Where to Find Trending Hashtags:**
• Instagram Explore page
• TikTok Discover
• Twitter Trends
• Competitor analysis
• Industry-specific tools

What industry or niche are you in? I can suggest some specific hashtags!`;
  }

  if (lowerMessage.includes("post time") || lowerMessage.includes("when to post")) {
    return `Great question! Timing can significantly impact engagement. Here are the optimal posting times:

**Instagram:**
• Monday-Friday: 10 AM - 3 PM
• Best days: Tuesday, Wednesday, Thursday
• Peak times: 11 AM and 1-2 PM

**TikTok:**
• Tuesday-Thursday: 12 PM - 6 PM
• Friday: 9 AM - 12 PM
• Peak engagement: 6-10 PM

**LinkedIn:**
• Tuesday-Thursday: 9 AM - 12 PM
• Wednesday at 9 AM is optimal
• Avoid weekends

**Twitter/X:**
• Monday-Friday: 9 AM - 3 PM
• Wednesday at 12 PM is peak
• Engagement drops on weekends

**Pro Tip:** These are general guidelines. Your specific audience might be different! Check your analytics to find when YOUR audience is most active. Test different times and track what works best for you.

Would you like help creating a posting schedule?`;
  }

  if (lowerMessage.includes("strategy") || lowerMessage.includes("plan")) {
    return `Let's build a solid content strategy! Here's a framework to get started:

**1. Define Your Goals**
• Brand awareness?
• Lead generation?
• Community building?
• Sales/conversions?

**2. Content Pillars (3-5 themes)**
• Educational content
• Entertainment/engagement
• Promotional content
• Behind-the-scenes
• User-generated content

**3. Content Mix (The 80/20 Rule)**
• 80% value-driven content (educate, entertain, inspire)
• 20% promotional content (products, services)

**4. Posting Frequency**
• Instagram: 3-5 posts/week + daily stories
• TikTok: 1-3 videos/day
• LinkedIn: 2-3 posts/week
• Twitter: 3-10 tweets/day

**5. Engagement Strategy**
• Respond to all comments within 1 hour
• Engage with your community's content
• Use interactive features (polls, questions)

**6. Track & Optimize**
• Monitor analytics weekly
• Identify top-performing content
• Adjust strategy based on data

Want me to help you develop any of these areas in more detail?`;
  }

  return `I'm here to help with your social media marketing! I can assist with:

• **Content Ideas** - Brainstorm engaging posts
• **Caption Writing** - Craft compelling copy
• **Hashtag Strategy** - Find the right tags
• **Posting Schedule** - Optimize timing
• **Content Strategy** - Plan your approach
• **Platform Tips** - Best practices for each platform
• **Engagement Tactics** - Grow your community

What would you like to focus on? The more details you share about your business and goals, the better I can help!`;
}