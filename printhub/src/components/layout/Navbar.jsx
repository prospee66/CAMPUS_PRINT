import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Printer, Menu, X, User, LogOut, LayoutDashboard,
  Bell, CheckCheck, Trash2, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/order', label: 'Order Now' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/track', label: 'Track Order' },
  { to: '/contact', label: 'Contact' },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);
    return () => {
      document.removeEventListener('mousedown', fn);
      document.removeEventListener('touchstart', fn);
    };
  }, [ref, handler]);
}

function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));

  const ICON = { new_order: '🖨️', payment: '💳', cancelled: '❌', delivery: '📦' };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        /* Responsive: full-width on mobile, fixed 320px on sm+ */
        <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[65px] sm:top-auto sm:mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden sm:w-80">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-primary-600" />
              <span className="font-semibold text-gray-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <button onClick={markAllRead} title="Mark all read"
                  className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <CheckCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} title="Clear all"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-300 mt-1">New orders appear here instantly</p>
              </div>
            ) : (
              notifications.map(n => (
                <button key={n.id} onClick={() => markRead(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border-b border-gray-50 text-left hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{ICON[n.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />}
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
              <Link to="/admin" onClick={() => setOpen(false)}
                className="text-xs text-primary-600 hover:underline font-semibold">
                View all in dashboard →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const dropRef = useRef(null);
  useOutsideClick(dropRef, () => setDropOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 shrink-0">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Printer size={20} /></div>
            CampusPrint
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`
                }
              >{l.label}</NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'admin' && <NotificationBell />}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[110px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{user.name}</p>
                      </div>
                      <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={15} className="text-gray-400" /> Dashboard
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <User size={15} /> Sign In
                </Link>
                <Link to="/order"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors inline-flex items-center gap-1.5">
                  Upload & Print
                </Link>
              </>
            )}
          </div>

          {/* Mobile: bell (admin) + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            {user?.role === 'admin' && <NotificationBell />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-0.5">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center py-3 px-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >{l.label}</NavLink>
            ))}
          </nav>
          <div className="px-4 pb-5 pt-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-3 px-3 py-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <LayoutDashboard size={16} className="text-gray-400" /> Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={15} /> Sign In
                </Link>
                <Link to="/order" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                  Upload & Print Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
