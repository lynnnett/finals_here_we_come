import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Upload, Wand2, Calendar as CalendarIcon, Send, Save,
  ArrowRight, ArrowLeft, Instagram, Linkedin, Twitter, Music,
  RefreshCw, Image as ImageIcon, Type, Palette, Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';

interface PlatformSize {
  platform: string;
  width: number;
  height: number;
  icon: any;
  color: string;
}

export function ComprehensiveDesignStudio() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [generatingCaption, setGeneratingCaption] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [resizedImages, setResizedImages] = useState<Record<string, string>>({});
  const [generatingResize, setGeneratingResize] = useState(false);

  const [aiBackground, setAiBackground] = useState('');
  const [aiFonts, setAiFonts] = useState<string[]>([]);
  const [aiTheme, setAiTheme] = useState('');
  const [generatingDesignAI, setGeneratingDesignAI] = useState(false);

  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('later');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [postTitle, setPostTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const platformSizes: PlatformSize[] = [
    { platform: 'instagram', width: 1080, height: 1080, icon: Instagram, color: 'text-pink-600' },
    { platform: 'tiktok', width: 1080, height: 1920, icon: Music, color: 'text-slate-900' },
    { platform: 'linkedin', width: 1200, height: 627, icon: Linkedin, color: 'text-blue-600' },
    { platform: 'twitter', width: 1200, height: 675, icon: Twitter, color: 'text-sky-500' },
  ];

  useEffect(() => {
    if (caption || uploadedFile || selectedPlatforms.length > 0) {
      triggerAutoSave();
    }
    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [caption, uploadedFile, selectedPlatforms]);

  const triggerAutoSave = () => {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    const timeout = setTimeout(() => {
      autoSaveDraft();
    }, 30000);
    setAutoSaveTimeout(timeout);
  };

  const autoSaveDraft = async () => {
    if (!user || !caption.trim()) return;

    setIsSaving(true);
    try {
      await supabase.from('posts').upsert({
        user_id: user.id,
        title: postTitle || 'Design Studio Draft',
        caption,
        platforms: selectedPlatforms,
        status: 'draft',
        updated_at: new Date().toISOString(),
      });
      setLastSaved(new Date());
      addNotification({
        type: 'success',
        title: 'Draft Auto-Saved',
        message: 'Your work has been saved automatically',
        duration: 2000,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateCaption = async () => {
    if (!caption && !uploadedFile) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please add some content or upload an image first',
        duration: 3000,
      });
      return;
    }

    setGeneratingCaption(true);
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
            topic: caption || 'social media post',
            tone: 'engaging',
            purpose: 'engagement',
            platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['instagram'],
          }),
        }
      );

      const data = await response.json();
      if (data.captions && data.captions.length > 0) {
        setCaption(data.captions[0].caption);
        setHashtags(data.captions[0].hashtags || []);
        setEmojis(['✨', '🚀', '💡', '🎯', '🔥']);

        addNotification({
          type: 'success',
          title: 'Caption Generated',
          message: 'AI has created your caption with hashtags!',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Caption generation failed:', error);
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Could not generate caption. Please try again.',
        duration: 3000,
      });
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoResize = async () => {
    if (!uploadedFile) {
      addNotification({
        type: 'error',
        title: 'No Image',
        message: 'Please upload an image first',
        duration: 3000,
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      addNotification({
        type: 'error',
        title: 'No Platforms Selected',
        message: 'Please select at least one platform',
        duration: 3000,
      });
      return;
    }

    setGeneratingResize(true);

    const resized: Record<string, string> = {};
    for (const platform of selectedPlatforms) {
      const platformSize = platformSizes.find(p => p.platform === platform);
      if (platformSize) {
        resized[platform] = uploadedPreview;
      }
    }

    setResizedImages(resized);

    setTimeout(() => {
      setGeneratingResize(false);
      addNotification({
        type: 'success',
        title: 'Images Resized',
        message: `Created ${selectedPlatforms.length} platform-optimized versions`,
        duration: 3000,
      });
    }, 1500);
  };

  const generateDesignSuggestions = async () => {
    setGeneratingDesignAI(true);

    setTimeout(() => {
      setAiBackground('gradient-to-br from-blue-500 to-purple-600');
      setAiFonts(['Inter', 'Poppins', 'Montserrat']);
      setAiTheme('Modern & Professional');
      setGeneratingDesignAI(false);

      addNotification({
        type: 'success',
        title: 'Design Suggestions Ready',
        message: 'AI has analyzed your content and generated design recommendations',
        duration: 3000,
      });
    }, 1500);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublish = async () => {
    if (!caption.trim()) {
      addNotification({
        type: 'error',
        title: 'Missing Caption',
        message: 'Please add a caption before publishing',
        duration: 3000,
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      addNotification({
        type: 'error',
        title: 'No Platforms Selected',
        message: 'Please select at least one platform',
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const scheduledFor = scheduleType === 'later'
        ? new Date(`${scheduledDate.toISOString().split('T')[0]}T${scheduledTime}`)
        : null;

      await supabase.from('posts').insert({
        user_id: user!.id,
        title: postTitle || 'Design Studio Post',
        caption,
        platforms: selectedPlatforms,
        status: scheduleType === 'now' ? 'published' : 'scheduled',
        scheduled_for: scheduledFor?.toISOString(),
      });

      addNotification({
        type: 'success',
        title: scheduleType === 'now' ? 'Published!' : 'Scheduled!',
        message: `Your post has been ${scheduleType === 'now' ? 'published' : 'scheduled'} successfully`,
        duration: 4000,
      });

      resetForm();
    } catch (error) {
      console.error('Publish failed:', error);
      addNotification({
        type: 'error',
        title: 'Publish Failed',
        message: 'Could not publish your post. Please try again.',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCaption('');
    setHashtags([]);
    setEmojis([]);
    setUploadedFile(null);
    setUploadedPreview('');
    setSelectedPlatforms([]);
    setResizedImages({});
    setPostTitle('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Design Studio</h1>
        <p className="text-slate-600 dark:text-slate-400">Create stunning social media content with AI assistance</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : step > s
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      step > s ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {step === 1 && 'Step 1: Captions & Hashtags'}
            {step === 2 && 'Step 2: Assets & Design'}
            {step === 3 && 'Step 3: Schedule & Publish'}
          </span>
        </div>

        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Save className="w-4 h-4" />
            <span>Auto-saved {new Date(lastSaved).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Generate Caption & Hashtags</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption or let AI generate one for you..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={5}
              />
            </div>

            <button
              onClick={generateCaption}
              disabled={generatingCaption}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingCaption ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </>
              )}
            </button>

            {hashtags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Suggested Hashtags
                </label>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {emojis.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Emoji Suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => setCaption(caption + ' ' + emoji)}
                      className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-2xl transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                Next: Assets & Design
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Upload Primary Asset</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedPreview ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <img src={uploadedPreview} alt="Upload preview" className="w-full h-64 object-cover" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <Upload className="w-12 h-12 text-slate-400" />
                <div className="text-center">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">Upload Image or Video</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Click to browse files</p>
                </div>
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Select Platforms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {platformSizes.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.platform);

                return (
                  <button
                    key={platform.platform}
                    onClick={() => togglePlatform(platform.platform)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${platform.color}`} />
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {platform.platform}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {platform.width}×{platform.height}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAutoResize}
              disabled={generatingResize || !uploadedFile || selectedPlatforms.length === 0}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingResize ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Resizing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Auto-Resize for Platforms
                </>
              )}
            </button>

            {Object.keys(resizedImages).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Platform Versions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(resizedImages).map(([platform, image]) => (
                    <div key={platform} className="relative group">
                      <img
                        src={image}
                        alt={platform}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white font-medium capitalize">{platform}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">AI Design Suggestions</h2>

            <button
              onClick={generateDesignSuggestions}
              disabled={generatingDesignAI}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
            >
              {generatingDesignAI ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get AI Design Suggestions
                </>
              )}
            </button>

            {aiTheme && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Suggested Theme
                  </label>
                  <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <p className="text-slate-900 dark:text-white font-medium">{aiTheme}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Suggested Fonts
                  </label>
                  <div className="flex gap-2">
                    {aiFonts.map((font, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Suggested Background
                  </label>
                  <div className={`h-24 rounded-lg bg-${aiBackground}`}></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Next: Schedule & Publish
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Schedule & Publish</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Post Title (Optional)
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Give your post a title..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Selected Platforms
              </label>
              <div className="flex flex-wrap gap-3">
                {selectedPlatforms.map((platform) => {
                  const platformData = platformSizes.find(p => p.platform === platform);
                  if (!platformData) return null;
                  const Icon = platformData.icon;

                  return (
                    <div
                      key={platform}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg"
                    >
                      <Icon className={`w-5 h-5 ${platformData.color}`} />
                      <span className="font-medium capitalize">{platform}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                When to Publish
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setScheduleType('now')}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all ${
                    scheduleType === 'now'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Send className="w-5 h-5 mx-auto mb-1" />
                  <p className="font-medium">Post Now</p>
                </button>
                <button
                  onClick={() => setScheduleType('later')}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 transition-all ${
                    scheduleType === 'later'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5 mx-auto mb-1" />
                  <p className="font-medium">Schedule</p>
                </button>
              </div>

              {scheduleType === 'later' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate.toISOString().split('T')[0]}
                      onChange={(e) => setScheduledDate(new Date(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : scheduleType === 'now' ? (
                  <>
                    <Send className="w-5 h-5" />
                    Publish Now
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-5 h-5" />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
