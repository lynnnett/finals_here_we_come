import { useState } from 'react';
import { Sparkles, Layout, Image, Type, Palette, Download, Wand2, Grid3x3, Search, Filter } from 'lucide-react';

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
    setElements([
      {
        id: '1',
        type: 'text',
        content: 'Your Headline Here',
        x: 50,
        y: 100,
        width: 980,
        height: 120,
        fontSize: 72,
        color: '#1e293b',
        fontWeight: 'bold',
      },
      {
        id: '2',
        type: 'text',
        content: 'Add your message here',
        x: 50,
        y: 250,
        width: 980,
        height: 60,
        fontSize: 32,
        color: '#64748b',
        fontWeight: 'normal',
      },
    ]);
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
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-20 bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center gap-4">
            <button className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors group">
              <Type className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors group">
              <Image className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors group">
              <Layout className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors group">
              <Palette className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <button
              onClick={generateAiSuggestions}
              className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all"
            >
              <Wand2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-8 flex items-center justify-center overflow-auto">
            <div
              className="bg-white shadow-2xl relative"
              style={{
                width: selectedTemplate.width / 2,
                height: selectedTemplate.height / 2,
              }}
            >
              <img
                src={selectedTemplate.thumbnail}
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute border-2 border-dashed border-blue-500 hover:border-blue-600 cursor-move"
                  style={{
                    left: element.x / 2,
                    top: element.y / 2,
                    width: element.width / 2,
                    height: element.height / 2,
                  }}
                >
                  {element.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        fontSize: element.fontSize ? element.fontSize / 2 : 16,
                        color: element.color,
                        fontWeight: element.fontWeight,
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showAiPanel && (
            <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">AI Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Wand2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Smart Design Tips</h4>
                      <p className="text-sm text-slate-600">
                        Based on your content and platform, here are AI-powered suggestions
                      </p>
                    </div>
                  </div>
                </div>

                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-700 group-hover:text-slate-900">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                <Wand2 className="w-5 h-5" />
                Apply All Suggestions
              </button>
            </div>
          )}

          {!showAiPanel && (
            <div className="w-80 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
              <h3 className="font-semibold text-slate-900 mb-6">Properties</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Canvas Size
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-900 font-medium">
                      {selectedTemplate.width} × {selectedTemplate.height}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedTemplate.platform === 'instagram' ? 'Instagram Post' : selectedTemplate.platform}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Background
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'].map((color) => (
                      <button
                        key={color}
                        className="aspect-square rounded-lg border-2 border-slate-200 hover:border-slate-400 transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Text Style
                  </label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Inter</option>
                      <option>Helvetica</option>
                      <option>Arial</option>
                      <option>Georgia</option>
                    </select>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-bold">
                        B
                      </button>
                      <button className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 italic">
                        I
                      </button>
                      <button className="flex-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 underline">
                        U
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Design
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
