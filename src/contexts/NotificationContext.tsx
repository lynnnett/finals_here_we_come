import { createContext, useContext, useState, ReactNode } from 'react';
import { Check, X, Info, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    const duration = notification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

function NotificationContainer({ notifications, onRemove }: { notifications: Notification[]; onRemove: (id: string) => void }) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onRemove={onRemove} />
      ))}
    </div>
  );
}

function NotificationToast({ notification, onRemove }: { notification: Notification; onRemove: (id: string) => void }) {
  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div
      className={`${styles[notification.type]} border-2 rounded-xl p-4 shadow-lg animate-slide-in-right flex items-start gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 mb-1">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm text-slate-600">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
