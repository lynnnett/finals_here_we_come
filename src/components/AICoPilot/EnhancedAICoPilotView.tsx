import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader, PlusCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  actionable?: {
    type: 'create_post' | 'add_to_calendar';
    data: any;
  };
}

function FormattedMessage({ content }: { content: string }) {
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('**') && line.endsWith('**')) {
        const boldText = line.slice(2, -2);
        elements.push(
          <h3 key={key++} className="font-bold text-slate-900 mt-4 mb-2 text-base">
            {boldText}
          </h3>
        );
      } else if (line.startsWith('###')) {
        elements.push(
          <h4 key={key++} className="font-semibold text-slate-800 mt-3 mb-2">
            {line.replace('###', '').trim()}
          </h4>
        );
      } else if (line.startsWith('•')) {
        elements.push(
          <div key={key++} className="flex gap-2 ml-2 mb-1">
            <span className="text-blue-600 font-bold">•</span>
            <span className="flex-1 text-slate-700">{line.slice(1).trim()}</span>
          </div>
        );
      } else if (/^\d+\./.test(line)) {
        const match = line.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          elements.push(
            <div key={key++} className="flex gap-2 ml-2 mb-1">
              <span className="text-blue-600 font-semibold min-w-[1.5rem]">{match[1]}.</span>
              <span className="flex-1 text-slate-700">{match[2]}</span>
            </div>
          );
        }
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />);
      } else {
        const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
        elements.push(
          <p key={key++} className="text-slate-700 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
    }

    return elements;
  };

  return <div className="space-y-1">{formatContent(content)}</div>;
}

interface EnhancedAICoPilotViewProps {
  onCreatePost?: (data: any) => void;
}

export function EnhancedAICoPilotView({ onCreatePost }: EnhancedAICoPilotViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      createConversation();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setUserProfile(data);
    }
  };

  const createConversation = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        title: 'New Conversation',
      })
      .select()
      .single();

    if (data) {
      setConversationId(data.id);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
    });

    try {
      const contextInfo = userProfile ? {
        company: userProfile.company_name,
        industry: userProfile.industry,
      } : {};

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-copilot`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId,
            context: contextInfo,
          }),
        }
      );

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error.',
        created_at: new Date().toISOString(),
        actionable: data.actionable,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage.content,
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = (messageData: any) => {
    onCreatePost?.(messageData);
  };

  const quickPrompts = [
    {
      icon: '💡',
      text: 'Brainstorm a week of content ideas',
      prompt: `My company is ${userProfile?.company_name || 'a startup'} in the ${userProfile?.industry || 'tech'} industry. Give me 7 content ideas for this week across Instagram, TikTok, and LinkedIn.`,
    },
    {
      icon: '🎯',
      text: 'Create a content strategy',
      prompt: 'Help me create a 30-day content strategy for my social media channels.',
    },
    {
      icon: '📝',
      text: 'Write a product announcement',
      prompt: 'Help me write a compelling product announcement post for my new feature launch.',
    },
    {
      icon: '📊',
      text: 'Best posting times',
      prompt: 'What are the best times to post on Instagram, TikTok, and LinkedIn for maximum engagement?',
    },
    {
      icon: '🔥',
      text: 'Trending hashtags',
      prompt: 'What are the trending hashtags in my industry right now?',
    },
    {
      icon: '✍️',
      text: 'Improve my caption',
      prompt: 'I have a post caption that needs improvement. Can you help make it more engaging?',
    },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Co-Pilot</h1>
          <p className="text-slate-600">
            Get intelligent content ideas and marketing strategies
            {userProfile?.company_name && (
              <span className="text-blue-600 font-medium"> for {userProfile.company_name}</span>
            )}
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-2xl mb-6">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </div>
                <div className="text-center max-w-md mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-slate-600">
                    I'm your AI assistant specialized in social media marketing and content strategy
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none">
                          {message.role === 'assistant' ? (
                            <FormattedMessage content={message.content} />
                          ) : (
                            <p className="m-0">{message.content}</p>
                          )}
                        </div>
                      </div>
                      {message.role === 'assistant' && message.actionable && (
                        <div className="mt-2 flex gap-2">
                          {message.actionable.type === 'create_post' && (
                            <button
                              onClick={() => handleCreatePost(message.actionable?.data)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Create Post
                            </button>
                          )}
                          {message.actionable.type === 'add_to_calendar' && (
                            <button
                              onClick={() => handleCreatePost(message.actionable?.data)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Add to Calendar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-slate-300 rounded-full flex-shrink-0" />
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-100 p-4 rounded-2xl">
                      <Loader className="w-5 h-5 text-slate-600 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about content strategy..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-80 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Prompts</h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{prompt.icon}</span>
                  <span className="text-sm text-slate-700 group-hover:text-blue-700">
                    {prompt.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-slate-900 mb-2">Pro Tip</h4>
          <p className="text-sm text-slate-600">
            The more context you provide about your business and goals, the better recommendations I can give you!
          </p>
        </div>
      </div>
    </div>
  );
}
