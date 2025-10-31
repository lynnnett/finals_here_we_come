import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Post {
  id: string;
  title: string | null;
  caption: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for: string | null;
  created_at: string;
}

interface ContentLibraryProps {
  onSelectPost?: (post: Post) => void;
  onCreateNew?: () => void;
}

export function ContentLibrary({ onSelectPost, onCreateNew }: ContentLibraryProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, filter]);

  const loadPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4 text-slate-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Content Library</h3>
          <button
            onClick={onCreateNew}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'draft'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === 'scheduled'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">No posts yet</p>
            <p className="text-slate-500 text-xs mt-1">Create your first post to get started</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={(e) => {
                if (post.status === 'draft') {
                  e.stopPropagation();
                  onSelectPost?.(post);
                } else {
                  onSelectPost?.(post);
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSelectPost?.(post);
              }}
              draggable={post.status !== 'draft'}
              onDragStart={(e) => {
                e.dataTransfer.setData('postId', post.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-move"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-slate-900 text-sm line-clamp-1">
                  {post.title || 'Untitled Post'}
                </h4>
                <div className="flex items-center gap-1">
                  {getStatusIcon(post.status)}
                </div>
              </div>
              {post.caption && (
                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  {post.caption}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
