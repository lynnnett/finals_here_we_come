import { Instagram, Linkedin, Twitter, Music } from 'lucide-react';

interface PlatformPreviewsProps {
  caption: string;
  platforms: string[];
  imageUrl?: string;
}

export function PlatformPreviews({ caption, platforms, imageUrl }: PlatformPreviewsProps) {
  const renderInstagramPreview = () => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full" />
        <div className="flex-1">
          <div className="font-semibold text-sm">your_brand</div>
          <div className="text-xs text-slate-500">Sponsored</div>
        </div>
        <div className="text-2xl">⋯</div>
      </div>
      {imageUrl && (
        <div className="aspect-square bg-slate-100">
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-3">
        <div className="flex gap-4 mb-2">
          <button className="text-2xl">♡</button>
          <button className="text-2xl">💬</button>
          <button className="text-2xl">✈</button>
        </div>
        <div className="text-sm">
          <span className="font-semibold">your_brand</span>{' '}
          <span className="text-slate-700">{caption.slice(0, 100)}{caption.length > 100 && '...'}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">2 hours ago</div>
      </div>
    </div>
  );

  const renderTikTokPreview = () => (
    <div className="bg-slate-900 rounded-lg overflow-hidden relative aspect-[9/16] max-w-[300px]">
      {imageUrl ? (
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full" />
          <div className="font-semibold">@yourbrand</div>
          <button className="px-4 py-1 bg-red-500 rounded-full text-sm font-semibold">
            Follow
          </button>
        </div>
        <p className="text-sm mb-2">{caption.slice(0, 80)}{caption.length > 80 && '...'}</p>
        <div className="flex items-center gap-2 text-xs">
          <Music className="w-3 h-3" />
          <span>Original Audio</span>
        </div>
      </div>
      <div className="absolute right-2 bottom-20 flex flex-col gap-4 text-white">
        <div className="text-center">
          <div className="text-2xl mb-1">♡</div>
          <div className="text-xs">125K</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">💬</div>
          <div className="text-xs">1,234</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">↗</div>
          <div className="text-xs">567</div>
        </div>
      </div>
    </div>
  );

  const renderLinkedInPreview = () => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            YB
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Your Brand</div>
            <div className="text-xs text-slate-500">1,234 followers</div>
            <div className="text-xs text-slate-500">2h • 🌍</div>
          </div>
          <button className="text-xl text-slate-600">⋯</button>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{caption}</p>
      </div>
      {imageUrl && (
        <div className="aspect-video bg-slate-100">
          <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-6 text-slate-600">
          <button className="flex items-center gap-2 text-sm hover:text-blue-600">
            <span>👍</span> Like
          </button>
          <button className="flex items-center gap-2 text-sm hover:text-blue-600">
            <span>💬</span> Comment
          </button>
          <button className="flex items-center gap-2 text-sm hover:text-blue-600">
            <span>↗</span> Share
          </button>
        </div>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          YB
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">Your Brand</span>
            <span className="text-slate-500 text-sm">@yourbrand</span>
            <span className="text-slate-500 text-sm">· 2h</span>
          </div>
          <p className="text-sm text-slate-900 mb-3 whitespace-pre-wrap">{caption}</p>
          {imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 mb-3">
              <img src={imageUrl} alt="Post" className="w-full" />
            </div>
          )}
          <div className="flex items-center justify-between text-slate-500 text-sm max-w-md">
            <button className="flex items-center gap-2 hover:text-blue-500">
              <span>💬</span> 42
            </button>
            <button className="flex items-center gap-2 hover:text-green-500">
              <span>🔄</span> 128
            </button>
            <button className="flex items-center gap-2 hover:text-red-500">
              <span>♡</span> 1.2K
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500">
              <span>📊</span> 5.4K
            </button>
            <button className="hover:text-blue-500">
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Platform Previews</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.includes('instagram') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-sm">Instagram</span>
            </div>
            {renderInstagramPreview()}
          </div>
        )}
        {platforms.includes('tiktok') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-5 h-5 text-slate-900" />
              <span className="font-medium text-sm">TikTok</span>
            </div>
            {renderTikTokPreview()}
          </div>
        )}
        {platforms.includes('linkedin') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-sm">LinkedIn</span>
            </div>
            {renderLinkedInPreview()}
          </div>
        )}
        {platforms.includes('twitter') && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="font-medium text-sm">X (Twitter)</span>
            </div>
            {renderTwitterPreview()}
          </div>
        )}
      </div>
    </div>
  );
}
