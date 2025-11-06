import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Instagram, Linkedin, Twitter, Music } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  platforms: string[];
  category: string;
  thumbnail_url?: string;
}

interface TemplatesViewProps {
  onUseTemplate: (template: Template) => void;
}

export function TemplatesView({ onUseTemplate }: TemplatesViewProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'social', 'promotional', 'educational', 'engagement'];

  const platformIcons: Record<string, JSX.Element> = {
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    tiktok: <Music className="w-4 h-4" />,
  };

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);

      if (!data || data.length === 0) {
        await createDefaultTemplates();
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultTemplates = async () => {
    if (!user) return;

    const defaultTemplates = [
      {
        user_id: user.id,
        name: 'Product Launch Announcement',
        description: 'Perfect for announcing new products or features',
        content: '🚀 Introducing [Product Name]!\n\nWe\'re thrilled to announce [brief description]. This game-changing [product/feature] will help you [key benefit].\n\n✨ Key Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\nReady to experience the future? Link in bio!\n\n#ProductLaunch #Innovation',
        platforms: ['instagram', 'linkedin', 'twitter'],
        category: 'promotional',
      },
      {
        user_id: user.id,
        name: 'Educational Tips Post',
        description: 'Share valuable tips with your audience',
        content: '💡 5 Tips for [Topic]:\n\n1. [Tip 1 with brief explanation]\n2. [Tip 2 with brief explanation]\n3. [Tip 3 with brief explanation]\n4. [Tip 4 with brief explanation]\n5. [Tip 5 with brief explanation]\n\nWhich tip will you try first? Let us know in the comments!\n\n#Tips #Education #Learning',
        platforms: ['instagram', 'linkedin'],
        category: 'educational',
      },
      {
        user_id: user.id,
        name: 'Behind the Scenes',
        description: 'Show your audience what goes on behind the scenes',
        content: '👀 Behind the scenes at [Company]!\n\nEver wondered how we [process/create something]? Here\'s a sneak peek into our [day/process].\n\n[Brief story or insight]\n\nWhat would you like to see more of? Drop your suggestions below!\n\n#BehindTheScenes #TeamLife',
        platforms: ['instagram', 'tiktok', 'twitter'],
        category: 'engagement',
      },
      {
        user_id: user.id,
        name: 'Customer Success Story',
        description: 'Highlight customer achievements and testimonials',
        content: '⭐ Success Story Alert!\n\nMeet [Customer Name], who achieved [impressive result] using [your product/service].\n\n"[Customer quote about their experience]"\n\nWant results like these? [Call to action]\n\n#SuccessStory #CustomerLove #Results',
        platforms: ['linkedin', 'twitter'],
        category: 'social',
      },
      {
        user_id: user.id,
        name: 'Engagement Question Post',
        description: 'Boost engagement with thought-provoking questions',
        content: '🤔 Question of the day:\n\n[Engaging question related to your industry]\n\nWe\'d love to hear your thoughts! Comment below and let\'s start a conversation.\n\n#CommunityEngagement #Discussion #YourThoughts',
        platforms: ['instagram', 'linkedin', 'twitter'],
        category: 'engagement',
      },
    ];

    try {
      const { error } = await supabase.from('templates').insert(defaultTemplates);
      if (error) throw error;
      await loadTemplates();
    } catch (error) {
      console.error('Error creating default templates:', error);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
            <p className="text-slate-600 mt-1">Pre-made post templates to save you time</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading templates...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-600">Try adjusting your search or create a new template</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-white" />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{template.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    {template.platforms.map((platform) => (
                      <div
                        key={platform}
                        className="p-1.5 bg-slate-100 rounded border border-slate-200"
                        title={platform}
                      >
                        {platformIcons[platform]}
                      </div>
                    ))}
                    <span className="ml-auto text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
                      {template.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onUseTemplate(template)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
