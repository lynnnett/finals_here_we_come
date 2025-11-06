import { Heart, MessageCircle, Send, Bookmark, Share2, MoreHorizontal, ThumbsUp, Repeat2 } from 'lucide-react';

interface PlatformPostPreviewsProps {
  platforms: string[];
  caption: string;
  assets?: Array<{ url: string; type: string }>;
  postTitle?: string;
}

export function PlatformPostPreviews({ platforms, caption }: PlatformPostPreviewsProps) {

  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
      <div className="flex items-center p-3 border-b border-slate-200">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
          U
        </div>
        <div className="ml-3 flex-1">
          <div className="font-semibold text-sm">your_account</div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-600" />
      </div>

      <div className="aspect-square bg-gradient-to-br from-purple-400 via-pink-500 to-red-500" />

      <div className="p-3">
        <div className="flex items-center gap-4 mb-3">
          <Heart className="w-6 h-6 text-slate-700" />
          <MessageCircle className="w-6 h-6 text-slate-700" />
          <Send className="w-6 h-6 text-slate-700" />
          <Bookmark className="w-6 h-6 ml-auto text-slate-700" />
        </div>
        <div className="text-sm">
          <span className="font-semibold">your_account</span>
          <span className="ml-2 text-slate-800">{caption}</span>
        </div>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bold text-sm">Your Name</span>
              <span className="text-slate-500 text-sm">@yourhandle · 2m</span>
            </div>
            <p className="text-sm text-slate-900 mb-3 whitespace-pre-wrap">{caption}</p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 mb-3">
              <div className="aspect-video bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600" />
            </div>
            <div className="flex items-center justify-between text-slate-500 max-w-md">
              <button className="flex items-center gap-2 hover:text-blue-500 group">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-green-500 group">
                <Repeat2 className="w-4 h-4" />
                <span className="text-xs">0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-red-500 group">
                <Heart className="w-4 h-4" />
                <span className="text-xs">0</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 group">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-semibold flex-shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Your Name</div>
            <div className="text-xs text-slate-600">Your Title | Company</div>
            <div className="text-xs text-slate-500">2m · 🌐</div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm text-slate-900 mb-3 whitespace-pre-wrap">{caption}</p>
        <div className="rounded-lg overflow-hidden border border-slate-200 mb-3 -mx-4">
          <div className="aspect-video bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600" />
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-2 flex items-center justify-around text-slate-600">
        <button className="flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 px-3 py-2 rounded">
          <ThumbsUp className="w-4 h-4" />
          Like
        </button>
        <button className="flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 px-3 py-2 rounded">
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>
        <button className="flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 px-3 py-2 rounded">
          <Repeat2 className="w-4 h-4" />
          Repost
        </button>
        <button className="flex items-center gap-2 text-xs font-semibold hover:bg-slate-100 px-3 py-2 rounded">
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );

  const renderTikTokPreview = () => (
    <div className="bg-black rounded-lg overflow-hidden shadow-lg aspect-[9/16] max-w-[280px] mx-auto relative">
      <div className="w-full h-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-pink-500" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="mb-3">
          <div className="font-semibold mb-1">@your_username</div>
          <p className="text-sm">{caption.substring(0, 100)}{caption.length > 100 ? '...' : ''}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">🎵 Original Sound</span>
        </div>
      </div>

      <div className="absolute right-3 bottom-20 flex flex-col gap-4 items-center">
        <button className="flex flex-col items-center text-white">
          <Heart className="w-7 h-7 mb-1" />
          <span className="text-xs">0</span>
        </button>
        <button className="flex flex-col items-center text-white">
          <MessageCircle className="w-7 h-7 mb-1" />
          <span className="text-xs">0</span>
        </button>
        <button className="flex flex-col items-center text-white">
          <Share2 className="w-7 h-7 mb-1" />
          <span className="text-xs">0</span>
        </button>
      </div>
    </div>
  );

  const platformRenderers: Record<string, () => JSX.Element> = {
    instagram: renderInstagramPreview,
    twitter: renderTwitterPreview,
    linkedin: renderLinkedInPreview,
    tiktok: renderTikTokPreview,
  };

  const platformNames: Record<string, string> = {
    instagram: 'Instagram',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-900">Platform Previews</h4>
        <span className="text-sm text-slate-600">{platforms.length} platform{platforms.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const renderer = platformRenderers[platform];
          if (!renderer) return null;

          return (
            <div key={platform} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {platformNames[platform] || platform}
                </div>
              </div>
              {renderer()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
