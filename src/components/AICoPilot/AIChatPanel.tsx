import { useState } from 'react';
import { X, Send, Sparkles, Plus, Calendar } from 'lucide-react';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (idea: string) => void;
  onAddToCalendar: (idea: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: {
    type: 'create_post' | 'add_to_calendar';
    data: string;
  }[];
}

export function AIChatPanel({ isOpen, onClose, onCreatePost, onAddToCalendar }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI content assistant. How can I help you create amazing content today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const quickPrompts = [
    { text: 'Generate weekly content ideas', icon: Sparkles },
    { text: 'Write LinkedIn feature launch caption', icon: Plus },
    { text: 'Get best hashtags for product launch', icon: Sparkles },
    { text: 'Create engagement post ideas', icon: Plus },
    { text: 'Suggest Instagram story ideas', icon: Sparkles },
    { text: 'Write Twitter thread about our product', icon: Plus },
  ];

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(message),
        timestamp: new Date(),
        actions: [
          { type: 'create_post', data: message },
          { type: 'add_to_calendar', data: message },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateMockResponse = (prompt: string): string => {
    if (prompt.toLowerCase().includes('weekly content')) {
      return `Here are 5 content ideas for this week:

1. **Monday Motivation**: Share a success story from your team or customer
2. **Tuesday Tips**: Create a carousel post with 5 quick tips for your audience
3. **Wednesday Wisdom**: Share an industry insight or trend analysis
4. **Thursday Throwback**: Highlight a milestone or past achievement
5. **Friday Feature**: Showcase a product feature with a video demo

Would you like me to create detailed posts for any of these?`;
    }

    if (prompt.toLowerCase().includes('linkedin') && prompt.toLowerCase().includes('feature')) {
      return `Here's a LinkedIn caption for your feature launch:

🚀 Excited to introduce [Feature Name] – the tool that will transform how you [solve problem]!

After months of development and feedback from our amazing community, we're thrilled to launch this game-changing feature that helps you:

✅ [Key benefit 1]
✅ [Key benefit 2]
✅ [Key benefit 3]

Early adopters are already seeing [impressive metric]. Ready to experience it yourself?

👉 Learn more: [link]

#ProductLaunch #Innovation #TechNews`;
    }

    if (prompt.toLowerCase().includes('hashtag')) {
      return `Here are the best hashtags for a product launch:

**High Engagement (500K-2M posts):**
#ProductLaunch #NewProduct #Innovation #TechLaunch

**Medium Engagement (100K-500K posts):**
#LaunchDay #StartupLife #ProductDesign #TechStartup

**Niche/Industry Specific:**
#SaaS #B2BSoftware #ProductManagement #TechInnovation

**Trending:**
#MadeForYou #GameChanger #FutureOfWork

Recommendation: Use 5-7 hashtags, mixing high and medium engagement tags.`;
    }

    return `Great question! I can help you with that. Based on your input, I suggest:

• Creating engaging content that resonates with your audience
• Using data-driven insights to optimize timing
• Testing different formats to see what works best

Would you like me to create a specific post or add this to your content calendar?`;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">AI Co-Pilot</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {message.actions && message.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                    <button
                      onClick={() => onCreatePost(message.content)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Post
                    </button>
                    <button
                      onClick={() => onAddToCalendar(message.content)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Add to Calendar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-3">
            <p className="text-xs font-medium text-slate-600 mb-2">Quick Prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.slice(0, 3).map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSend(prompt.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors"
                  >
                    <Icon className="w-3 h-3" />
                    {prompt.text.split(' ').slice(0, 3).join(' ')}...
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isGenerating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
