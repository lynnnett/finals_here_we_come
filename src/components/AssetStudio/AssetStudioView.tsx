import { useState } from 'react';
import { Upload, Image as ImageIcon, Wand2, Download } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  dimensions: { width: number; height: number };
}

interface PlatformVariant {
  platform: string;
  format: string;
  dimensions: string;
  url?: string;
}

export function AssetStudioView() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const platformVariants: PlatformVariant[] = [
    { platform: 'Instagram', format: 'Square Feed', dimensions: '1080x1080' },
    { platform: 'Instagram', format: 'Story/Reels', dimensions: '1080x1920' },
    { platform: 'TikTok', format: 'Video', dimensions: '1080x1920' },
    { platform: 'LinkedIn', format: 'Post', dimensions: '1200x627' },
    { platform: 'Twitter', format: 'Post', dimensions: '1200x675' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const asset: Asset = {
      id: crypto.randomUUID(),
      name: file.name,
      url,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      dimensions: { width: 1920, height: 1080 },
    };

    setSelectedAsset(asset);
  };

  const handleAutoResize = async () => {
    if (!selectedAsset) return;
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Asset Studio</h1>
        <p className="text-slate-600">Create and resize content for all platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Asset</h3>

            <label className="block">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  Upload your image or video
                </h4>
                <p className="text-slate-600 text-sm">
                  PNG, JPG, MP4 up to 50MB
                </p>
              </div>
            </label>
          </div>

          {selectedAsset && (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4">
                {selectedAsset.type === 'image' ? (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedAsset.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="text-sm text-slate-600 mb-4">
                <p><span className="font-medium">Name:</span> {selectedAsset.name}</p>
                <p><span className="font-medium">Dimensions:</span> {selectedAsset.dimensions.width}x{selectedAsset.dimensions.height}</p>
              </div>
              <button
                onClick={handleAutoResize}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Wand2 className="w-5 h-5 animate-spin" />
                    Generating Variants...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Auto-Resize for All Platforms
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Variants</h3>

          {!selectedAsset ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">Upload an asset to generate platform variants</p>
            </div>
          ) : (
            <div className="space-y-3">
              {platformVariants.map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{variant.platform}</h4>
                    <p className="text-sm text-slate-600">
                      {variant.format} • {variant.dimensions}
                    </p>
                  </div>
                  {isProcessing ? (
                    <div className="px-4 py-2 text-sm text-slate-600">
                      Processing...
                    </div>
                  ) : variant.url ? (
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-slate-600" />
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 text-sm rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 p-3 rounded-lg flex-shrink-0">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              AI Design Assistant
            </h3>
            <p className="text-slate-600 mb-4">
              The AI will automatically analyze your content and suggest optimal cropping, backgrounds, and visual themes for each platform.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                Smart cropping based on platform requirements
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                Automatic background suggestions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                Font and sticker recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
