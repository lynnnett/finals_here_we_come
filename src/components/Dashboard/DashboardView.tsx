import { TrendingUp, Calendar, Image as ImageIcon, BarChart } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

function StatCard({ icon, title, value, change, changeType }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function DashboardView() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your social media performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Total Engagement"
          value="24.5K"
          change="+12.3%"
          changeType="positive"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          title="Scheduled Posts"
          value="18"
          change="+5"
          changeType="positive"
        />
        <StatCard
          icon={<ImageIcon className="w-6 h-6 text-blue-600" />}
          title="Assets Created"
          value="142"
          change="+28"
          changeType="positive"
        />
        <StatCard
          icon={<BarChart className="w-6 h-6 text-blue-600" />}
          title="Reach"
          value="89.2K"
          change="-2.1%"
          changeType="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Post published to Instagram</h4>
                  <p className="text-sm text-slate-600">2 hours ago</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { title: 'Product Launch', date: 'Oct 28', type: 'launch' },
              { title: 'Halloween', date: 'Oct 31', type: 'holiday' },
              { title: 'Black Friday', date: 'Nov 29', type: 'holiday' },
            ].map((event, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">{event.title}</span>
                </div>
                <p className="text-xs text-slate-600 ml-6">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
