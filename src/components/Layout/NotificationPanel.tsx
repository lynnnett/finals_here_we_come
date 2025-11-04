import { useState, useEffect } from 'react';
import { X, Check, Calendar, FileText, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface PanelNotification {
  id: string;
  type: 'post_scheduled' | 'draft_saved' | 'post_published' | 'post_failed';
  title: string;
  message: string;
  post_id?: string;
  created_at: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PanelNotification[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen, user]);

  const loadNotifications = async () => {
    if (!user) return;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { data: recentPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .gte('updated_at', sevenDaysAgo.toISOString())
      .order('updated_at', { ascending: false })
      .limit(20);

    if (recentPosts) {
      const notifs: PanelNotification[] = [];

      recentPosts.forEach(post => {
        if (post.status === 'scheduled' && post.scheduled_for) {
          notifs.push({
            id: `scheduled-${post.id}`,
            type: 'post_scheduled',
            title: 'Post Scheduled',
            message: `"${post.title || 'Untitled Post'}" scheduled for ${new Date(post.scheduled_for).toLocaleDateString()}`,
            post_id: post.id,
            created_at: post.updated_at,
            read: false,
          });
        } else if (post.status === 'draft') {
          notifs.push({
            id: `draft-${post.id}`,
            type: 'draft_saved',
            title: 'Draft Saved',
            message: `Draft "${post.title || 'Untitled Post'}" was saved`,
            post_id: post.id,
            created_at: post.updated_at,
            read: false,
          });
        } else if (post.status === 'published') {
          notifs.push({
            id: `published-${post.id}`,
            type: 'post_published',
            title: 'Post Published',
            message: `"${post.title || 'Untitled Post'}" was published successfully`,
            post_id: post.id,
            created_at: post.published_at || post.updated_at,
            read: false,
          });
        } else if (post.status === 'failed') {
          notifs.push({
            id: `failed-${post.id}`,
            type: 'post_failed',
            title: 'Post Failed',
            message: `Failed to publish "${post.title || 'Untitled Post'}"`,
            post_id: post.id,
            created_at: post.updated_at,
            read: false,
          });
        }
      });

      setNotifications(notifs);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'post_scheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'draft_saved':
        return <FileText className="w-5 h-5 text-slate-600" />;
      case 'post_published':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'post_failed':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">All caught up!</h3>
              <p className="text-sm text-slate-600">You have no new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {notification.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNotification(notification.id);
                          }}
                          className="flex-shrink-0 p-1 hover:bg-slate-200 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                      <span className="text-xs text-slate-500">
                        {getTimeAgo(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
