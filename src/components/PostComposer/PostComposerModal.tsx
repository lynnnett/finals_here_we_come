import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Upload, Wand2, Calendar as CalendarIcon, Send, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { supabase } from '../../lib/supabase';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialDraft?: any;
  onPostCreated?: () => void;
}

interface GeneratedCaption {
  platform: string;
  caption: string;
  hashtags: string[];
}

export function PostComposerModal({ isOpen, onClose, initialDate, initialDraft, onPostCreated }: PostComposerModalProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState(1);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [purpose, setPurpose] = useState('announcement');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<string>('');
  const [customCaption, setCustomCaption] = useState('');
  const [platformCaptions, setPlatformCaptions] = useState<Record<string, string>>({});

  const [uploadedAssets, setUploadedAssets] = useState<File[]>([]);
  const [assetPreviews, setAssetPreviews] = useState<string[]>([]);
  const [generatingVariants, setGeneratingVariants] = useState(false);

  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('later');
  const [scheduledDate, setScheduledDate] = useState(initialDate || new Date());
  const [scheduledTime, setScheduledTime] = useState('10:00');

  const [postTitle, setPostTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasUnsavedChanges(true);
      triggerAutoSave();
    }
    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [topic, customCaption, selectedPlatforms, uploadedAssets]);

  useEffect(() => {
    if (isOpen) {
      setHasUnsavedChanges(false);
      if (initialDraft) {
        setPostTitle(initialDraft.title || '');
        setTopic(initialDraft.title || '');
        setCustomCaption(initialDraft.caption || '');
        setSelectedPlatforms(initialDraft.platforms || []);
        if (initialDraft.platform_captions) {
          setPlatformCaptions(initialDraft.platform_captions);
        }
        if (initialDraft.scheduled_for) {
          setScheduledDate(new Date(initialDraft.scheduled_for));
          setScheduleType('later');
        }
      }
    }
  }, [isOpen, initialDraft]);

  const triggerAutoSave = () => {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);

    const timeout = setTimeout(() => {
      autoSaveDraft();
    }, 30000);

    setAutoSaveTimeout(timeout);
  };

  const autoSaveDraft = async () => {
    if (!user || !topic.trim()) return;

    setIsSaving(true);
    try {
      const caption = customCaption || selectedCaption;
      const platformCaptionsData = Object.keys(platformCaptions).length > 0 ? platformCaptions : null;

      await supabase.from('posts').upsert({
        user_id: user.id,
        title: postTitle || topic,
        caption,
        platform_captions: platformCaptionsData,
        platforms: selectedPlatforms,
        status: 'draft',
        updated_at: new Date().toISOString(),
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      addNotification({
        type: 'success',
        title: 'Draft Saved',
        message: `"${postTitle || topic}" has been saved as a draft`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save your draft. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    await autoSaveDraft();
  };

  const handleClose = () => {
    if (hasUnsavedChanges && (topic.trim() || customCaption.trim())) {
      setShowExitConfirm(true);
    } else {
      onClose();
      resetForm();
    }
  };

  const handleExitWithoutSaving = () => {
    setShowExitConfirm(false);
    onClose();
    resetForm();
  };

  const handleSaveAndExit = async () => {
    await autoSaveDraft();
    setShowExitConfirm(false);
    onClose();
    resetForm();
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const generateCaptions = async () => {
    if (!topic.trim()) return;

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
            platforms: selectedPlatforms,
          }),
        }
      );

      const data = await response.json();
      setGeneratedCaptions(data.captions || []);
      if (data.captions && data.captions.length > 0) {
        setSelectedCaption(data.captions[0].caption);
        const captionsMap: Record<string, string> = {};
        data.captions.forEach((item: GeneratedCaption) => {
          captionsMap[item.platform] = item.caption;
        });
        setPlatformCaptions(captionsMap);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedAssets(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setAssetPreviews(previews);
  };

  const handleAutoResize = async () => {
    setGeneratingVariants(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingVariants(false);
  };

  const handleCreatePost = async () => {
    if (!user) return;

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform before scheduling your post.');
      return;
    }

    setIsSaving(true);
    try {
      const caption = customCaption || selectedCaption;
      const scheduledFor = scheduleType === 'later'
        ? (() => {
            const [hours, minutes] = scheduledTime.split(':').map(Number);
            const date = new Date(scheduledDate);
            date.setHours(hours, minutes, 0, 0);
            return date;
          })()
        : null;

      const platformCaptionsData = Object.keys(platformCaptions).length > 0 ? platformCaptions : null;

      const postData = {
        user_id: user.id,
        title: postTitle || topic,
        caption,
        platform_captions: platformCaptionsData,
        platforms: selectedPlatforms,
        status: scheduleType === 'now' ? 'published' : 'scheduled',
        scheduled_for: scheduledFor?.toISOString(),
        published_at: scheduleType === 'now' ? new Date().toISOString() : null,
      };

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) throw postError;

      addNotification({
        type: 'success',
        title: scheduleType === 'now' ? 'Post Published' : 'Post Scheduled',
        message: scheduleType === 'now'
          ? `"${postTitle || topic}" has been published`
          : `"${postTitle || topic}" scheduled for ${scheduledFor?.toLocaleDateString()}`,
        duration: 5000,
      });

      onPostCreated?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
      addNotification({
        type: 'error',
        title: 'Post Creation Failed',
        message: 'Could not create your post. Please try again.',
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTopic('');
    setCustomCaption('');
    setSelectedCaption('');
    setGeneratedCaptions([]);
    setPlatformCaptions({});
    setUploadedAssets([]);
    setAssetPreviews([]);
    setPostTitle('');
    setSelectedPlatforms([]);
  };

  if (!isOpen) return null;

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create Post</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : step > 1 ? 'bg-green-600' : 'bg-slate-300'}`} />
                <span className={step === 1 ? 'text-blue-600 font-medium' : step > 1 ? 'text-slate-700' : 'text-slate-400'}>
                  Copy
                </span>
              </div>
              <div className={`w-8 h-0.5 ${step > 1 ? 'bg-green-600' : 'bg-slate-300'}`} />
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : step > 2 ? 'bg-green-600' : 'bg-slate-300'}`} />
                <span className={step === 2 ? 'text-blue-600 font-medium' : step > 2 ? 'text-slate-700' : 'text-slate-400'}>
                  Assets
                </span>
              </div>
              <div className={`w-8 h-0.5 ${step > 2 ? 'bg-green-600' : 'bg-slate-300'}`} />
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                <span className={step === 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                  Schedule
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isSaving && (
              <span className="text-sm text-slate-600">Saving...</span>
            )}
            {lastSaved && (
              <span className="text-sm text-slate-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleManualSave}
              disabled={isSaving || !topic.trim()}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Step 1: Concept & Copy</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Post Title (Internal)
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g., Product Launch Announcement"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What's this post about?"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="witty">Witty</option>
                    <option value="chill">Chill / Gen Z</option>
                    <option value="inspirational">Inspirational</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Purpose</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="engagement">Engagement</option>
                    <option value="traffic">Drive Traffic</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Target Platforms <span className="text-red-600">*</span>
                </label>
                {selectedPlatforms.length === 0 && (
                  <p className="text-sm text-red-600 mb-2">
                    Please select at least one platform
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platformOptions.map(platform => (
                    <button
                      key={platform.value}
                      onClick={() => togglePlatform(platform.value)}
                      className={`p-4 rounded-lg border-2 transition-all font-medium ${
                        selectedPlatforms.includes(platform.value)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{platform.icon}</div>
                      <div className="text-sm">{platform.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateCaptions}
                disabled={!topic.trim() || selectedPlatforms.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Captions
              </button>

              {generatedCaptions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Generated Captions</h4>
                  {generatedCaptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedCaption(item.caption)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCaption === item.caption
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{item.platform}</span>
                      </div>
                      <p className="text-slate-700 mb-3">{item.caption}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.hashtags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Edit Caption (Optional)
                    </label>
                    <textarea
                      value={customCaption || selectedCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Customize your caption..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Step 2: Assets & Design</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Upload Media</label>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      Upload Images or Videos
                    </h4>
                    <p className="text-slate-600 text-sm">
                      PNG, JPG, MP4 up to 50MB
                    </p>
                  </div>
                </label>
              </div>

              {assetPreviews.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {assetPreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAutoResize}
                    disabled={generatingVariants}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generatingVariants ? (
                      <>
                        <Wand2 className="w-5 h-5 animate-spin" />
                        Generating Platform Variants...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Auto-Resize for All Platforms
                      </>
                    )}
                  </button>

                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-6 border border-blue-100">
                    <h4 className="font-semibold text-slate-900 mb-2">AI Design Assistant</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Based on your caption, we recommend:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-slate-700">Modern gradient backgrounds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-slate-700">Bold sans-serif typography</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        <span className="text-slate-700">Celebration-themed stickers</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Step 3: Schedule & Publish</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Publishing Options</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setScheduleType('now')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scheduleType === 'now'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Send className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="font-medium text-slate-900">Post Now</div>
                    <div className="text-sm text-slate-600">Publish immediately</div>
                  </button>
                  <button
                    onClick={() => setScheduleType('later')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scheduleType === 'later'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CalendarIcon className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="font-medium text-slate-900">Schedule</div>
                    <div className="text-sm text-slate-600">Pick date & time</div>
                  </button>
                </div>
              </div>

              {scheduleType === 'later' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={`${scheduledDate.getFullYear()}-${String(scheduledDate.getMonth() + 1).padStart(2, '0')}-${String(scheduledDate.getDate()).padStart(2, '0')}`}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        if (newDate) {
                          try {
                            const [year, month, day] = newDate.split('-').map(Number);
                            const updatedDate = new Date(scheduledDate);
                            updatedDate.setFullYear(year);
                            updatedDate.setMonth(month - 1);
                            updatedDate.setDate(day);
                            setScheduledDate(updatedDate);
                          } catch (error) {
                            console.error('Invalid date:', error);
                          }
                        }
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Post Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Title:</span>
                    <span className="font-medium text-slate-900">{postTitle || topic}</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Platforms:</span>
                      <span className="font-medium text-slate-900">{selectedPlatforms.length} selected</span>
                    </div>
                    {selectedPlatforms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPlatforms.map(platform => {
                          const platformOption = platformOptions.find(p => p.value === platform);
                          return (
                            <span
                              key={platform}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium"
                            >
                              {platformOption?.icon} {platformOption?.label}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-red-600 text-xs">No platforms selected</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assets:</span>
                    <span className="font-medium text-slate-900">{uploadedAssets.length}</span>
                  </div>
                  {scheduleType === 'later' && scheduledDate && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-600">Scheduled for:</span>
                      </div>
                      <div className="text-slate-900 font-medium">
                        {selectedPlatforms.length > 0 ? (
                          <>
                            {selectedPlatforms.map(platform => {
                              const platformOption = platformOptions.find(p => p.value === platform);
                              return platformOption?.label;
                            }).join(', ')} on{' '}
                            {scheduledDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {scheduledTime}
                          </>
                        ) : (
                          <>
                            {scheduledDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {scheduledTime}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium text-slate-900">
                      {scheduleType === 'now' ? 'Will publish immediately' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleCreatePost()}
            disabled={
              (step === 1 && (!selectedCaption && !customCaption)) ||
              (step === 1 && selectedPlatforms.length === 0) ||
              (step === 3 && (isSaving || selectedPlatforms.length === 0))
            }
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {step === 3 ? (
              isSaving ? 'Creating...' : scheduleType === 'now' ? 'Publish Now' : 'Add to Calendar'
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {showExitConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 rounded-2xl">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Save Draft?</h3>
            <p className="text-slate-600 mb-6">
              You have unsaved changes. Would you like to save this as a draft before closing?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExitWithoutSaving}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Don't Save
              </button>
              <button
                onClick={handleSaveAndExit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
