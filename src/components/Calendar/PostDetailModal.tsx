import { X, Calendar, Clock, Instagram, Linkedin, Twitter, Music, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    title: string | null;
    caption: string | null;
    platform_captions?: Record<string, string> | null;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduled_for: string | null;
    platforms: string[];
  } | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostDetailModal({ isOpen, onClose, post, onEdit, onDelete }: PostDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');

  if (!isOpen || !post) return null;

  if (selectedPlatform === '' && post.platforms.length > 0) {
    setSelectedPlatform(post.platforms[0]);
  }

  const getCurrentCaption = () => {
    if (isEditing) return editedCaption;
    if (post.platform_captions && selectedPlatform) {
      return post.platform_captions[selectedPlatform] || post.caption || '';
    }
    return post.caption || '';
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedCaption(getCurrentCaption());
  };

  const handleSaveEdit = async () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCaption('');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return {
      date: date.toLocaleDateString('en-US', dateOptions),
      time: date.toLocaleTimeString('en-US', timeOptions),
    };
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-sky-500" />;
      case 'tiktok':
        return <Music className="w-5 h-5 text-slate-900" />;
      default:
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
      published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
      draft: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const dateTime = post.scheduled_for ? formatDateTime(post.scheduled_for) : null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Post Details</h2>
            {getStatusBadge(post.status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {post.title || 'Untitled Post'}
            </h3>
          </div>

          {post.scheduled_for && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Scheduled Date</p>
                  <p className="text-base font-semibold text-slate-900">{dateTime?.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Scheduled Time</p>
                  <p className="text-base font-semibold text-slate-900">{dateTime?.time}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Platforms</h4>
            <div className="flex flex-wrap gap-3">
              {post.platforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {getPlatformIcon(platform)}
                  <span className="font-medium text-slate-700">{getPlatformName(platform)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">Caption</h4>
              {post.platform_captions && post.platforms.length > 1 && (
                <div className="flex gap-2">
                  {post.platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        selectedPlatform === platform
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              {isEditing ? (
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {getCurrentCaption() || 'No caption'}
                </p>
              )}
            </div>
            {isEditing ? (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEdit}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Caption
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
                Edit Post
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Post?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
