import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Palette, Type, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BrandAsset {
  id: string;
  name: string;
  asset_type: 'logo' | 'color' | 'font' | 'image';
  asset_value: string;
  metadata: Record<string, any>;
}

export function BrandAssetsView() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const assetTypes = [
    { id: 'all', label: 'All Assets', icon: ImageIcon },
    { id: 'logo', label: 'Logos', icon: ImageIcon },
    { id: 'color', label: 'Colors', icon: Palette },
    { id: 'font', label: 'Fonts', icon: Type },
  ];

  useEffect(() => {
    loadAssets();
  }, [user]);

  const loadAssets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brand_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);

      if (!data || data.length === 0) {
        await createDefaultAssets();
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultAssets = async () => {
    if (!user) return;

    const defaultAssets = [
      {
        user_id: user.id,
        name: 'Primary Blue',
        asset_type: 'color',
        asset_value: '#3B82F6',
        metadata: { hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
      },
      {
        user_id: user.id,
        name: 'Secondary Slate',
        asset_type: 'color',
        asset_value: '#64748B',
        metadata: { hex: '#64748B', rgb: 'rgb(100, 116, 139)' },
      },
      {
        user_id: user.id,
        name: 'Accent Green',
        asset_type: 'color',
        asset_value: '#10B981',
        metadata: { hex: '#10B981', rgb: 'rgb(16, 185, 129)' },
      },
      {
        user_id: user.id,
        name: 'Inter',
        asset_type: 'font',
        asset_value: 'Inter',
        metadata: { category: 'sans-serif', weight: '400-700' },
      },
      {
        user_id: user.id,
        name: 'Playfair Display',
        asset_type: 'font',
        asset_value: 'Playfair Display',
        metadata: { category: 'serif', weight: '400-900' },
      },
    ];

    try {
      const { error } = await supabase.from('brand_assets').insert(defaultAssets);
      if (error) throw error;
      await loadAssets();
    } catch (error) {
      console.error('Error creating default assets:', error);
    }
  };

  const filteredAssets =
    selectedType === 'all'
      ? assets
      : assets.filter((asset) => asset.asset_type === selectedType);

  const renderAssetPreview = (asset: BrandAsset) => {
    switch (asset.asset_type) {
      case 'color':
        return (
          <div className="h-32 rounded-t-lg" style={{ backgroundColor: asset.asset_value }} />
        );
      case 'font':
        return (
          <div
            className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-t-lg"
            style={{ fontFamily: asset.asset_value }}
          >
            <span className="text-3xl font-bold text-slate-700">Aa</span>
          </div>
        );
      case 'logo':
      case 'image':
        return (
          <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-t-lg">
            <ImageIcon className="w-12 h-12 text-blue-600" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Brand Assets</h1>
            <p className="text-slate-600 mt-1">Manage your logos, colors, and fonts</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </div>

        <div className="flex gap-2">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedType === type.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading assets...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No assets found</h3>
            <p className="text-slate-600 mb-4">Start by adding your brand assets</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Upload Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {renderAssetPreview(asset)}

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{asset.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {asset.asset_type.charAt(0).toUpperCase() + asset.asset_type.slice(1)}
                  </p>

                  {asset.asset_type === 'color' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">HEX</span>
                        <span className="font-mono font-medium text-slate-700">
                          {asset.asset_value}
                        </span>
                      </div>
                      {asset.metadata.rgb && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">RGB</span>
                          <span className="font-mono font-medium text-slate-700">
                            {asset.metadata.rgb}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {asset.asset_type === 'font' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Family</span>
                        <span className="font-medium text-slate-700">{asset.asset_value}</span>
                      </div>
                      {asset.metadata.category && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Category</span>
                          <span className="font-medium text-slate-700">
                            {asset.metadata.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button className="w-full mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm">
                    Use in Design
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
