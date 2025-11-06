import { Instagram, Linkedin, Twitter, Music, Clock, MoreVertical } from 'lucide-react';

interface CalendarPostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    platforms: string[];
    scheduled_for: string;
    status: 'draft' | 'scheduled' | 'published';
  };
  onClick: () => void;
}

export function CalendarPostCard({ post, onClick }: CalendarPostCardProps) {
  const platformIcons: Record<string, JSX.Element> = {
    instagram: <Instagram className="w-3 h-3" />,
    linkedin: <Linkedin className="w-3 h-3" />,
    twitter: <Twitter className="w-3 h-3" />,
    tiktok: <Music className="w-3 h-3" />,
  };

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    published: 'bg-green-50 text-green-700 border-green-200',
  };

  const timeString = new Date(post.scheduled_for).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border-2 ${statusColors[post.status]} hover:shadow-md transition-all group mb-2`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {post.platforms.map((platform) => (
            <div
              key={platform}
              className="p-1 bg-white rounded border border-slate-200"
              title={platform}
            >
              {platformIcons[platform]}
            </div>
          ))}
        </div>
        <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="font-medium text-sm line-clamp-2 mb-1">
        {post.title || post.content.substring(0, 50)}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Clock className="w-3 h-3" />
        <span>{timeString}</span>
        <span className="ml-auto px-2 py-0.5 bg-white rounded font-medium">
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>
    </button>
  );
}
