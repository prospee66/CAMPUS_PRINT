import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

function load() {
  try { return JSON.parse(localStorage.getItem('ph_notifications') || '[]'); } catch { return []; }
}
function save(items) {
  localStorage.setItem('ph_notifications', JSON.stringify(items));
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(load);

  const addNotification = useCallback((notification) => {
    const item = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications(prev => {
      const updated = [item, ...prev];
      save(updated);
      return updated;
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      save(updated);
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      save(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('ph_notifications');
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
