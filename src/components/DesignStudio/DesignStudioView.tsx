import { useState } from 'react';
import { Sparkles, Layout, Image, Type, Palette, Download, Wand2, Grid3x3, Search, Filter } from 'lucide-react';
import { EnhancedInteractiveCanvas } from './EnhancedInteractiveCanvas';
import { useNotifications } from '../../contexts/NotificationContext';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  width: number;
  height: number;
  platform: string;
}

interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
}

export function DesignStudioView() {
  const { addNotification } = useNotifications();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'design'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid3x3 },
    { id: 'announcement', name: 'Announcements', icon: Layout },
    { id: 'promotion', name: 'Promotions', icon: Sparkles },
    { id: 'quote', name: 'Quotes', icon: Type },
    { id: 'product', name: 'Products', icon: Image },
    { id: 'story', name: 'Stories', icon: Layout },
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Bold Announcement',
      category: 'announcement',
      thumbnail: 'https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1080,
      platform: 'instagram',
    },
    {
      id: '2',
      name: 'Modern Gradient',
      category: 'promotion',
      thumbnail: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1080,
      platform: 'instagram',
    },
    {
      id: '3',
      name: 'Minimalist Quote',
      category: 'quote',
      thumbnail: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1080,
      platform: 'instagram',
    },
    {
      id: '4',
      name: 'Product Showcase',
      category: 'product',
      thumbnail: 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1080,
      platform: 'instagram',
    },
    {
      id: '5',
      name: 'Story Template',
      category: 'story',
      thumbnail: 'https://images.pexels.com/photos/6929049/pexels-photo-6929049.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1920,
      platform: 'instagram',
    },
    {
      id: '6',
      name: 'Vibrant Promo',
      category: 'promotion',
      thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1080,
      height: 1080,
      platform: 'instagram',
    },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('design');
    addNotification({
      type: 'success',
      title: 'Template Selected',
      message: `"${template.name}" is ready for editing`,
      duration: 3000,
    });
  };

  const handleExport = () => {
    addNotification({
      type: 'success',
      title: 'Design Exported',
      message: 'Your design has been exported successfully',
      duration: 3000,
    });
  };

  const generateAiSuggestions = () => {
    setShowAiPanel(true);
    setAiSuggestions([
      'Try a bold gradient background with contrasting text',
      'Add your brand colors for consistency',
      'Use larger font size for the headline (80px+)',
      'Include a subtle shadow effect for depth',
      'Center align text for better balance',
    ]);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Design Studio</h1>
          <p className="text-slate-600">Create stunning visuals with templates or AI assistance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAiSuggestions}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Sparkles className="w-5 h-5" />
            AI Designer
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-2 font-medium rounded-lg transition-colors ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('design')}
          disabled={!selectedTemplate}
          className={`px-6 py-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            activeTab === 'design'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Design Editor
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-64 bg-white rounded-xl border border-slate-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <Filter className="w-4 h-4" />
                Categories
              </div>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-blue-500 transition-all mb-3 shadow-sm group-hover:shadow-xl">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <button className="w-full bg-white text-slate-900 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600">
                    {template.width} × {template.height}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'design' && selectedTemplate && (
        <EnhancedInteractiveCanvas template={selectedTemplate} onExport={handleExport} />
      )}
    </div>
  );
}
