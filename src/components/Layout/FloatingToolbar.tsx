import { useState } from 'react';
import { X, Sparkles, PenTool, Image as ImageIcon, BarChart3, FileText, Zap, Wrench, Palette } from 'lucide-react';

export function FloatingToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: Sparkles,
      color: 'bg-blue-600',
      description: 'Get instant content ideas and strategy advice'
    },
    {
      id: 'caption-gen',
      label: 'Caption Generator',
      icon: PenTool,
      color: 'bg-purple-600',
      description: 'Create captions in seconds'
    },
    {
      id: 'design-studio',
      label: 'Design Studio',
      icon: Palette,
      color: 'bg-indigo-600',
      description: 'Create visuals with templates & AI'
    },
    {
      id: 'asset-resize',
      label: 'Asset Resizer',
      icon: ImageIcon,
      color: 'bg-green-600',
      description: 'Resize for all platforms'
    },
    {
      id: 'analytics',
      label: 'Quick Stats',
      icon: BarChart3,
      color: 'bg-orange-600',
      description: 'View performance metrics'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: FileText,
      color: 'bg-pink-600',
      description: 'Use pre-built templates'
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      color: 'bg-yellow-600',
      description: 'Manage auto-features'
    },
  ];

  const handleToolClick = (toolId: string) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  const renderToolContent = () => {
    if (!activeTool) return null;

    const tool = tools.find(t => t.id === activeTool);
    if (!tool) return null;

    const Icon = tool.icon;

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className={`${tool.color} p-2 rounded-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{tool.label}</h3>
              <p className="text-xs text-slate-600">{tool.description}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTool === 'ai-assistant' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-4">Ask me anything about your content strategy:</p>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <span className="text-sm text-slate-700">💡 Brainstorm content ideas</span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <span className="text-sm text-slate-700">📝 Write a caption</span>
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <span className="text-sm text-slate-700">🎯 Create posting schedule</span>
              </button>
            </div>
          )}

          {activeTool === 'caption-gen' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Topic</label>
                <input
                  type="text"
                  placeholder="What's your post about?"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Tone</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Professional</option>
                  <option>Witty</option>
                  <option>Chill / Gen Z</option>
                  <option>Inspirational</option>
                  <option>Urgent</option>
                </select>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors">
                Generate Caption
              </button>
            </div>
          )}

          {activeTool === 'asset-resize' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900">Upload Asset</p>
                <p className="text-xs text-slate-600 mt-1">PNG, JPG, MP4</p>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                Auto-Resize for All Platforms
              </button>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                  <span>Instagram Square</span>
                  <span className="text-slate-500">1080x1080</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                  <span>TikTok Portrait</span>
                  <span className="text-slate-500">1080x1920</span>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'design-studio' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-900">AI-Powered Design</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">Create professional visuals with templates and AI assistance</p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                  Open Design Studio
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">Quick Templates</div>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
                    <div className="font-medium text-sm text-slate-900 mb-1">Instagram Post</div>
                    <div className="text-xs text-slate-600">1080 × 1080 square</div>
                  </button>
                  <button className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
                    <div className="font-medium text-sm text-slate-900 mb-1">Story Template</div>
                    <div className="text-xs text-slate-600">1080 × 1920 portrait</div>
                  </button>
                  <button className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
                    <div className="font-medium text-sm text-slate-900 mb-1">Product Showcase</div>
                    <div className="text-xs text-slate-600">Multi-platform ready</div>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-2 mb-2">
                  <Palette className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-900">Features</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li>• 50+ professional templates</li>
                  <li>• AI design suggestions</li>
                  <li>• Custom branding tools</li>
                  <li>• One-click export</li>
                </ul>
              </div>
            </div>
          )}

          {activeTool === 'analytics' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-xs text-blue-700 font-medium mb-1">Total Engagement</div>
                <div className="text-2xl font-bold text-slate-900">24.5K</div>
                <div className="text-xs text-green-600 font-medium">+12.3%</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="text-xs text-green-700 font-medium mb-1">Scheduled Posts</div>
                <div className="text-2xl font-bold text-slate-900">18</div>
                <div className="text-xs text-green-600 font-medium">+5 this week</div>
              </div>
            </div>
          )}

          {activeTool === 'templates' && (
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200">
                <div className="font-medium text-sm text-slate-900 mb-1">Product Launch</div>
                <div className="text-xs text-slate-600">Announcement template</div>
              </button>
              <button className="w-full text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200">
                <div className="font-medium text-sm text-slate-900 mb-1">Behind the Scenes</div>
                <div className="text-xs text-slate-600">Engagement template</div>
              </button>
              <button className="w-full text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200">
                <div className="font-medium text-sm text-slate-900 mb-1">Educational Post</div>
                <div className="text-xs text-slate-600">Value-driven template</div>
              </button>
            </div>
          )}

          {activeTool === 'automation' && (
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Auto-Publish</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-600">Automatically publish scheduled posts</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Smart Hashtags</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-600">AI suggests trending hashtags</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 bottom-6 p-4 rounded-full shadow-2xl transition-all z-50 group ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-110'
        }`}
        title="Quick Tools"
      >
        <Wrench
          className={`w-6 h-6 text-white transition-transform duration-300 ${
            isOpen ? 'rotate-90' : 'group-hover:rotate-12'
          }`}
        />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => {
            setIsOpen(false);
            setActiveTool(null);
          }}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${activeTool ? 'w-[32rem]' : 'w-80'}`}
      >
        <div className="h-full flex">
          <div className="w-80 border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quick Tools</h2>
                <p className="text-sm text-slate-600 mt-1">Access features instantly</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTool(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;

                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={`w-full p-4 rounded-xl transition-all border-2 text-left ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                          : 'border-transparent bg-slate-50 hover:bg-slate-100 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${tool.color} p-3 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm">{tool.label}</h3>
                          <p className="text-xs text-slate-600 mt-0.5">{tool.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Pro Tip</h4>
                    <p className="text-xs text-slate-600">
                      Click any tool to expand its features on the right
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activeTool && (
            <div className="flex-1">
              {renderToolContent()}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
