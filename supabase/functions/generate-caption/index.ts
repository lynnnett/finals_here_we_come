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
      const toneVariations: Record<string, Record<string, any>> = {
        professional: {
          instagram: {
            caption: `We're pleased to announce ${topic}. This marks an important milestone in our journey. Stay tuned for more updates. ✨`,
            emojis: ['✨', '💼', '🎯', '📈', '🌟'],
          },
          tiktok: {
            caption: `Introducing ${topic}! Here's what you need to know 👇 #professional #business`,
            emojis: ['👇', '💡', '📱', '✅', '🎬'],
          },
          linkedin: {
            caption: `We're excited to announce ${topic}. This represents a significant milestone in our journey to deliver exceptional value to our community. Looking forward to the positive impact this will have.`,
            emojis: ['💼', '📊', '🎯', '🚀', '💡'],
          },
          twitter: {
            caption: `Announcing ${topic}. This is an important step forward for us. More details coming soon. 📢`,
            emojis: ['📢', '🚀', '💼', '✨', '🎯'],
          },
        },
        witty: {
          instagram: {
            caption: `Plot twist: ${topic} just dropped and it's better than your morning coffee ☕✨ You're welcome.`,
            emojis: ['☕', '😎', '🎉', '💯', '🔥'],
          },
          tiktok: {
            caption: `POV: You just discovered ${topic} and your life is about to change 🔥 No pressure though 😅`,
            emojis: ['🔥', '😅', '👀', '💀', '✨'],
          },
          linkedin: {
            caption: `Turns out, ${topic} wasn't just a crazy idea after all. Here's what happens when passion meets execution. 🚀`,
            emojis: ['🚀', '💡', '😄', '🎯', '✨'],
          },
          twitter: {
            caption: `${topic} is here and honestly, we're pretty stoked about it 🎉 (Understatement of the year)`,
            emojis: ['🎉', '😎', '🔥', '💯', '✨'],
          },
        },
        chill: {
          instagram: {
            caption: `so basically ${topic} is here and it's kinda fire ngl 🔥 check it out when u get a sec ✨`,
            emojis: ['🔥', '✨', '💫', '😌', '👌'],
          },
          tiktok: {
            caption: `${topic} just dropped and its giving main character energy fr fr 💁✨ no cap`,
            emojis: ['💁', '✨', '😌', '🔥', '💫'],
          },
          linkedin: {
            caption: `Excited to share ${topic} with everyone. It's been quite the journey getting here, and we're grateful for the support. 🙏`,
            emojis: ['🙏', '✨', '💫', '😊', '🌟'],
          },
          twitter: {
            caption: `${topic} is live and we're just vibing with it rn ✨ come hang`,
            emojis: ['✨', '😌', '💫', '🌊', '✌️'],
          },
        },
        inspirational: {
          instagram: {
            caption: `Every great achievement starts with a decision to try. Today, we're proud to share ${topic} with you. Dream big, act boldly. 💫✨`,
            emojis: ['💫', '✨', '🌟', '💪', '🦋'],
          },
          tiktok: {
            caption: `Your reminder that ${topic} started as just an idea. What dreams are you bringing to life today? 💭✨`,
            emojis: ['💭', '✨', '🌟', '💫', '🦋'],
          },
          linkedin: {
            caption: `${topic} represents more than just a launch—it's a testament to perseverance, innovation, and the power of collective effort. Here's to breaking barriers and creating meaningful impact. 🌟`,
            emojis: ['🌟', '💪', '✨', '🚀', '💡'],
          },
          twitter: {
            caption: `The journey to ${topic} taught us that the only limits are the ones we accept. Keep pushing boundaries. 🚀✨`,
            emojis: ['🚀', '✨', '💫', '🌟', '💪'],
          },
        },
        urgent: {
          instagram: {
            caption: `🚨 MAJOR ANNOUNCEMENT: ${topic} is HERE and you need to see this NOW! Don't miss out! ⚡`,
            emojis: ['🚨', '⚡', '🔥', '⏰', '💥'],
          },
          tiktok: {
            caption: `WAIT!! ${topic} just dropped and you NEED to see this right now!! 🚨🔥 RUN don't walk`,
            emojis: ['🚨', '🔥', '⚡', '💥', '⏰'],
          },
          linkedin: {
            caption: `URGENT UPDATE: ${topic} is now available. This is time-sensitive and requires immediate attention. Act now to take advantage of this opportunity.`,
            emojis: ['🚨', '⚡', '⏰', '🔔', '📢'],
          },
          twitter: {
            caption: `🚨 BREAKING: ${topic} just launched! This is what you've been waiting for. Time-sensitive—don't delay! ⚡`,
            emojis: ['🚨', '⚡', '🔥', '⏰', '💥'],
          },
        },
      };

      const hashtags: Record<string, string[]> = {
        instagram: ['#innovation', '#newrelease', '#announcement', '#exciting', '#staycreative'],
        tiktok: ['#fyp', '#viral', '#trending', '#foryou', '#new'],
        linkedin: ['#business', '#innovation', '#growth', '#professional', '#leadership'],
        twitter: ['#breaking', '#announcement', '#news', '#update', '#launch'],
      };

      const toneData = toneVariations[tone]?.[platform] || toneVariations.professional[platform];

      return {
        platform,
        caption: toneData.caption,
        hashtags: hashtags[platform] || hashtags.instagram,
        suggestedEmojis: toneData.emojis,
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