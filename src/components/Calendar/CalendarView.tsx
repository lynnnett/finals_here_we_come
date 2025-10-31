import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarPost {
  id: string;
  title: string;
  date: Date;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const posts: CalendarPost[] = [
    {
      id: '1',
      title: 'Product Launch Announcement',
      date: new Date(2025, 9, 28),
      platforms: ['instagram', 'twitter'],
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Halloween Special',
      date: new Date(2025, 9, 31),
      platforms: ['instagram', 'tiktok'],
      status: 'draft',
    },
  ];

  const getPostsForDate = (day: number) => {
    return posts.filter((post) => {
      const postDate = post.date;
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getFullYear() === currentDate.getFullYear()
      );
    });
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
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className="min-h-32 border border-slate-200 bg-white p-2 hover:bg-slate-50 transition-colors"
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
                setShowNewPostModal(true);
              }}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div className="space-y-1">
            {dayPosts.map((post) => (
              <div
                key={post.id}
                className={`text-xs p-2 rounded cursor-pointer ${
                  post.status === 'scheduled'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : post.status === 'published'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="font-medium truncate">{post.title}</div>
                <div className="flex gap-1 mt-1">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="text-xs opacity-75 capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Calendar</h1>
          <p className="text-slate-600">Plan and schedule your social media posts</p>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
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
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Posts</h3>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{post.title}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{post.date.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Scheduled Posts</span>
              <span className="text-2xl font-bold text-slate-900">12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Draft Posts</span>
              <span className="text-2xl font-bold text-slate-900">8</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Published This Month</span>
              <span className="text-2xl font-bold text-slate-900">24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
