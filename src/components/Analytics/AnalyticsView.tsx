import { TrendingUp, TrendingDown, Heart, Share2, MessageCircle, Eye } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

function MetricCard({ icon, title, value, change, changeType }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
        <div className="flex items-center gap-1">
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

interface TopPostProps {
  platform: string;
  caption: string;
  engagement: number;
  date: string;
}

function TopPost({ platform, caption, engagement, date }: TopPostProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">
          {platform}
        </span>
        <span className="text-sm text-slate-600">{date}</span>
      </div>
      <p className="text-slate-900 font-medium mb-2">{caption}</p>
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{engagement.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{Math.floor(engagement * 0.1).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{Math.floor(engagement * 0.05).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const topPosts: TopPostProps[] = [
    {
      platform: 'instagram',
      caption: 'New product launch announcement',
      engagement: 5420,
      date: 'Oct 20',
    },
    {
      platform: 'tiktok',
      caption: 'Behind the scenes content',
      engagement: 4890,
      date: 'Oct 18',
    },
    {
      platform: 'linkedin',
      caption: 'Company milestone celebration',
      engagement: 3210,
      date: 'Oct 15',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-600">Track your social media performance</p>
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Heart className="w-6 h-6 text-blue-600" />}
          title="Total Likes"
          value="24.5K"
          change="+12.3%"
          changeType="positive"
        />
        <MetricCard
          icon={<Share2 className="w-6 h-6 text-blue-600" />}
          title="Shares"
          value="3.2K"
          change="+8.7%"
          changeType="positive"
        />
        <MetricCard
          icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
          title="Comments"
          value="1.8K"
          change="-2.1%"
          changeType="negative"
        />
        <MetricCard
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          title="Profile Visits"
          value="12.4K"
          change="+15.2%"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Engagement Rate by Platform
          </h3>
          <div className="space-y-4">
            {[
              { platform: 'Instagram', rate: 4.8, color: 'bg-pink-500' },
              { platform: 'TikTok', rate: 6.2, color: 'bg-slate-900' },
              { platform: 'LinkedIn', rate: 3.4, color: 'bg-blue-600' },
              { platform: 'Twitter', rate: 2.9, color: 'bg-sky-500' },
            ].map((item) => (
              <div key={item.platform}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{item.platform}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${(item.rate / 7) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Posting Times</h3>
          <div className="space-y-4">
            {[
              { day: 'Monday', time: '10:00 AM', engagement: '85%' },
              { day: 'Wednesday', time: '2:00 PM', engagement: '92%' },
              { day: 'Friday', time: '7:00 PM', engagement: '88%' },
              { day: 'Sunday', time: '11:00 AM', engagement: '79%' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{item.day}</h4>
                  <p className="text-sm text-slate-600">{item.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">{item.engagement}</span>
                  <p className="text-xs text-slate-600">avg engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPosts.map((post, index) => (
            <TopPost key={index} {...post} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Audience Growth</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 72, 68, 85, 91, 88, 95, 92, 98, 102, 108, 115].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors"
                style={{ height: `${(height / 115) * 100}%` }}
              />
              <span className="text-xs text-slate-600">
                {new Date(2025, 0, index * 2 + 1).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
