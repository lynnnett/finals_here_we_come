import { useState } from 'react';
import { PenTool, Copy, Check, Sparkles } from 'lucide-react';

interface GeneratedCaption {
  platform: string;
  caption: string;
  hashtags: string[];
}

export function CaptionGeneratorView() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<string>('professional');
  const [purpose, setPurpose] = useState<string>('announcement');
  const [platforms, setPlatforms] = useState<string[]>(['instagram']);
  const [loading, setLoading] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'witty', label: 'Witty' },
    { value: 'chill', label: 'Chill / Gen Z' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const purposeOptions = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'traffic', label: 'Drive Traffic' },
    { value: 'education', label: 'Education' },
  ];

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'X (Twitter)' },
  ];

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim() || platforms.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-caption`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            topic,
            tone,
            purpose,
            platforms,
          }),
        }
      );

      const data = await response.json();
      setGeneratedCaptions(data.captions || []);
    } catch (error) {
      console.error('Error generating captions:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = (caption: string, hashtags: string[], index: number) => {
    const fullText = `${caption}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Caption Generator</h1>
        <p className="text-slate-600">Create engaging, platform-optimized captions with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., New Feature Launch, Product Announcement..."
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-2">
              Purpose
            </label>
            <select
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {purposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Target Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => togglePlatform(option.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                    platforms.includes(option.value)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim() || platforms.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PenTool className="w-5 h-5" />
                Generate Captions
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {generatedCaptions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No captions generated yet
              </h3>
              <p className="text-slate-600">
                Fill out the form and click generate to create platform-optimized captions
              </p>
            </div>
          ) : (
            generatedCaptions.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 capitalize">{item.platform}</h3>
                  <button
                    onClick={() => copyCaption(item.caption, item.hashtags, index)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">{item.caption}</p>
                <div className="flex flex-wrap gap-2">
                  {item.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
