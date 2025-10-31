import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Instagram, Linkedin, Twitter, Music } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { PostComposerModal } from '../PostComposer/PostComposerModal';
import { ContentLibrary } from '../ContentLibrary/ContentLibrary';
import { PostDetailModal } from './PostDetailModal';

interface CalendarPost {
  id: string;
  title: string | null;
  caption: string | null;
  platform_captions?: Record<string, string> | null;
  selected_platforms?: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for: string | null;
  platforms: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  event_date: string;
  event_type: 'holiday' | 'product_launch' | 'industry_event' | 'custom';
}

export function EnhancedCalendarView() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dragOverDate, setDragOverDate] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (user) {
      loadPosts();
      loadEvents();
    }
  }, [user, currentDate]);

  const loadPosts = async () => {
    if (!user) return;

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .gte('scheduled_for', startOfMonth.toISOString())
      .lte('scheduled_for', endOfMonth.toISOString())
      .order('scheduled_for', { ascending: true });

    if (!error && data) {
      setPosts(data.map(post => ({
        ...post,
        platforms: post.selected_platforms || ['instagram', 'twitter'],
      })));
    }
  };

  const loadEvents = async () => {
    if (!user) return;

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('event_date', startOfMonth.toISOString().split('T')[0])
      .lte('event_date', endOfMonth.toISOString().split('T')[0]);

    if (!error && data) {
      setEvents(data);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getPostsForDate = (day: number) => {
    return posts.filter((post) => {
      if (!post.scheduled_for) return false;
      const postDate = new Date(post.scheduled_for);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getFullYear() === currentDate.getFullYear()
      );
    }).sort((a, b) => {
      const timeA = new Date(a.scheduled_for!).getTime();
      const timeB = new Date(b.scheduled_for!).getTime();
      return timeA - timeB;
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const getEventsForDate = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDrop = async (e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDate(null);

    const postId = e.dataTransfer.getData('postId');
    if (!postId) return;

    const scheduledDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 10, 0);

    await supabase
      .from('posts')
      .update({
        scheduled_for: scheduledDate.toISOString(),
        status: 'scheduled',
      })
      .eq('id', postId);

    loadPosts();
  };

  const handleDragOver = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    setDragOverDate(day);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handlePostClick = (post: CalendarPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    await supabase
      .from('posts')
      .delete()
      .eq('id', selectedPost.id);

    loadPosts();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3 h-3 text-pink-600" />;
      case 'linkedin':
        return <Linkedin className="w-3 h-3 text-blue-600" />;
      case 'twitter':
        return <Twitter className="w-3 h-3 text-sky-500" />;
      case 'tiktok':
        return <Music className="w-3 h-3 text-slate-900" />;
      default:
        return null;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'holiday':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'product_launch':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'industry_event':
        return 'bg-green-100 border-green-300 text-green-700';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 bg-slate-50 border border-slate-200" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayPosts = getPostsForDate(day);
      const dayEvents = getEventsForDate(day);
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const isDragOver = dragOverDate === day;

      days.push(
        <div
          key={day}
          onDrop={(e) => handleDrop(e, day)}
          onDragOver={(e) => handleDragOver(e, day)}
          onDragLeave={handleDragLeave}
          className={`min-h-32 border border-slate-200 p-2 transition-all ${
            isDragOver
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
              : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm font-medium ${
                isToday
                  ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                  : 'text-slate-700'
              }`}
            >
              {day}
            </span>
            <button
              onClick={() => {
                setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                setShowPostComposer(true);
              }}
              className="p-1 hover:bg-slate-200 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <Plus className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-1.5">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1.5 rounded border ${getEventColor(event.event_type)}`}
              >
                <div className="font-medium truncate">{event.title}</div>
              </div>
            ))}

            {dayPosts.map((post) => (
              <div
                key={post.id}
                draggable
                onClick={(e) => handlePostClick(post, e)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('postId', post.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className={`text-xs p-2 rounded cursor-pointer transition-all hover:shadow-md group ${
                  post.status === 'scheduled'
                    ? 'bg-blue-50 border-l-4 border-l-blue-500 border border-blue-200 hover:bg-blue-100'
                    : post.status === 'published'
                    ? 'bg-green-50 border-l-4 border-l-green-500 border border-green-200 hover:bg-green-100'
                    : post.status === 'failed'
                    ? 'bg-red-50 border-l-4 border-l-red-500 border border-red-200 hover:bg-red-100'
                    : 'bg-slate-50 border-l-4 border-l-slate-400 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  {post.scheduled_for && (
                    <span className={`font-semibold text-xs ${
                      post.status === 'scheduled'
                        ? 'text-blue-700'
                        : post.status === 'published'
                        ? 'text-green-700'
                        : post.status === 'failed'
                        ? 'text-red-700'
                        : 'text-slate-700'
                    }`}>
                      {formatTime(post.scheduled_for)}
                    </span>
                  )}
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <div key={platform}>{getPlatformIcon(platform)}</div>
                    ))}
                  </div>
                </div>
                <div className={`font-medium truncate ${
                  post.status === 'scheduled'
                    ? 'text-blue-900'
                    : post.status === 'published'
                    ? 'text-green-900'
                    : post.status === 'failed'
                    ? 'text-red-900'
                    : 'text-slate-900'
                }`}>
                  {post.title || 'Untitled Post'}
                </div>
                {post.caption && (
                  <div className={`text-xs mt-1 truncate ${
                    post.status === 'scheduled'
                      ? 'text-blue-600'
                      : post.status === 'published'
                      ? 'text-green-600'
                      : post.status === 'failed'
                      ? 'text-red-600'
                      : 'text-slate-600'
                  }`}>
                    {post.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <div className="w-80 flex-shrink-0">
        <ContentLibrary
          onCreateNew={() => setShowPostComposer(true)}
          onSelectPost={(post: any) => {
            if (post.status === 'draft') {
              setEditingDraft(post);
              setShowPostComposer(true);
            } else {
              setSelectedPost(post as CalendarPost);
              setShowPostDetail(true);
            }
          }}
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Calendar</h1>
            <p className="text-slate-600">Drag posts from the library to schedule them</p>
          </div>
          <button
            onClick={() => setShowPostComposer(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-semibold text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-px mb-px">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-slate-700 text-sm py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-200 group">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded" />
              <span className="text-slate-700">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded" />
              <span className="text-slate-700">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded" />
              <span className="text-slate-700">Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded" />
              <span className="text-slate-700">Calendar Event</span>
            </div>
          </div>
        </div>
      </div>

      <PostComposerModal
        isOpen={showPostComposer}
        onClose={() => {
          setShowPostComposer(false);
          setSelectedDate(null);
          setEditingDraft(null);
        }}
        initialDate={selectedDate || undefined}
        initialDraft={editingDraft}
        onPostCreated={loadPosts}
      />

      <PostDetailModal
        isOpen={showPostDetail}
        onClose={() => {
          setShowPostDetail(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
