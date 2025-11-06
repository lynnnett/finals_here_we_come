import { useState, useEffect } from 'react';
import { Search, Filter, FolderOpen, Instagram, Linkedin, Twitter, Music, Clock, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduled_for: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
}

interface ContentLibraryViewProps {
  onEditPost: (post: Post) => void;
}

export function ContentLibraryView({ onEditPost }: ContentLibraryViewProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const statusFilters = [
    { id: 'all', label: 'All Posts', color: 'text-slate-600' },
    { id: 'draft', label: 'Drafts', color: 'text-slate-600' },
    { id: 'scheduled', label: 'Scheduled', color: 'text-blue-600' },
    { id: 'published', label: 'Published', color: 'text-green-600' },
  ];

  const platformIcons: Record<string, JSX.Element> = {
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    tiktok: <Music className="w-4 h-4" />,
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Content Library</h1>
            <p className="text-slate-600 mt-1">Browse and manage all your posts</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{filteredPosts.length} posts</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedStatus(filter.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === filter.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : `${filter.color} hover:text-slate-900`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-600">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-600">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first post to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {post.title && (
                          <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                      </div>

                      <span
                        className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'draft'
                            ? 'bg-slate-100 text-slate-700'
                            : post.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        {post.platforms.map((platform) => (
                          <div
                            key={platform}
                            className="p-1 bg-slate-100 rounded border border-slate-200"
                            title={platform}
                          >
                            {platformIcons[platform]}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {post.scheduled_for
                            ? `${formatDate(post.scheduled_for)} at ${formatTime(post.scheduled_for)}`
                            : formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onEditPost(post)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
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
