import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Grid3x3, List } from 'lucide-react';
import { CalendarPostCard } from './CalendarPostCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduled_for: string;
  status: 'draft' | 'scheduled' | 'published';
  user_id: string;
}

interface EnhancedCalendarProps {
  onCreatePost: () => void;
  onOpenPost: (post: Post) => void;
}

export function EnhancedCalendar({ onCreatePost, onOpenPost }: EnhancedCalendarProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user, currentDate]);

  const loadPosts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_for', startOfMonth.toISOString())
        .lte('scheduled_for', endOfMonth.toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduled_for);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-slate-200">
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (view === 'month' ? navigateMonth('prev') : navigateWeek('prev'))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => (view === 'month' ? navigateMonth('next') : navigateWeek('next'))}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'week'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              Week
            </button>
          </div>

          <button
            onClick={onCreatePost}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="flex-1 p-6">
          <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {dayNames.map((day) => (
              <div
                key={day}
                className="bg-slate-50 p-3 text-center text-sm font-semibold text-slate-700"
              >
                {day}
              </div>
            ))}

            {getDaysInMonth().map((day, index) => {
              if (!day) {
                return (
                  <div key={`empty-${index}`} className="bg-white min-h-[120px]" />
                );
              }

              const dayPosts = getPostsForDate(day);
              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div key={day.toISOString()} className="bg-white p-3 min-h-[120px] overflow-y-auto">
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? 'w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white'
                        : 'text-slate-700'
                    }`}
                  >
                    {day.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dayPosts.map((post) => (
                      <CalendarPostCard
                        key={post.id}
                        post={post}
                        onClick={() => onOpenPost(post)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6">
          <div className="grid grid-cols-7 gap-4">
            {getWeekDays().map((day) => {
              const dayPosts = getPostsForDate(day);
              const isToday =
                day.getDate() === new Date().getDate() &&
                day.getMonth() === new Date().getMonth() &&
                day.getFullYear() === new Date().getFullYear();

              return (
                <div key={day.toISOString()} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div
                    className={`p-3 text-center border-b border-slate-200 ${
                      isToday ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm font-medium">{dayNames[day.getDay()]}</div>
                    <div className="text-2xl font-bold">{day.getDate()}</div>
                  </div>

                  <div className="p-3 space-y-2 min-h-[400px] max-h-[600px] overflow-y-auto">
                    {dayPosts.length > 0 ? (
                      dayPosts.map((post) => (
                        <CalendarPostCard
                          key={post.id}
                          post={post}
                          onClick={() => onOpenPost(post)}
                        />
                      ))
                    ) : (
                      <div className="text-center text-slate-400 text-sm py-8">No posts</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-slate-600">Loading posts...</div>
        </div>
      )}
    </div>
  );
}
