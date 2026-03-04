import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart2, Package, Users, DollarSign,
  Download, Filter, TrendingUp, Bell, CheckCheck, Trash2, Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { formatCurrency, formatDate } from '../utils/orderRef';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const MOCK_ORDERS = [
  { id: 'PH-LQK1B-XY92', student: 'Kofi Mensah', email: 'kofi@uni.edu', date: '2026-03-04T09:00:00', files: ['Thesis_Chapter1.pdf', 'Appendix.docx'], total: 24.50, status: 'printing', pages: 48, paid: true },
  { id: 'PH-DEMO1-TEST', student: 'Abena K.', email: 'abena@uni.edu', date: '2026-03-03T07:00:00', files: ['Assignment3.pdf'], total: 3.50, status: 'completed', pages: 7, paid: true },
  { id: 'PH-AB12C-GH45', student: 'Kwame A.', email: 'kwame@knust.edu.gh', date: '2026-02-28T11:00:00', files: ['Presentation.pptx'], total: 14.00, status: 'completed', pages: 7, paid: true },
  { id: 'PH-ZQ9X1-LK77', student: 'Ama O.', email: 'ama@ashesi.edu.gh', date: '2026-02-20T08:30:00', files: ['Lab_Report.docx'], total: 6.00, status: 'cancelled', pages: 12, paid: false },
  { id: 'PH-MN23P-RT56', student: 'Yaw B.', email: 'yaw@ucc.edu.gh', date: '2026-03-04T08:00:00', files: ['Research.pdf'], total: 8.00, status: 'received', pages: 16, paid: true },
];

const STATUS_BADGE = {
  received: 'badge-pending',
  pending: 'badge-pending',
  printing: 'badge-printing',
  ready: 'badge-ready',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const STATUS_FLOW = ['received', 'printing', 'ready', 'completed'];

export default function Admin() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const revenue = orders.filter(o => o.paid && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const todayRevenue = orders.filter(o => o.paid && o.status !== 'cancelled' && o.date.startsWith('2026-03-04')).reduce((s, o) => s + o.total, 0);

  const advanceStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const cur = STATUS_FLOW.indexOf(o.status);
      if (cur === -1 || cur === STATUS_FLOW.length - 1) return o;
      return { ...o, status: STATUS_FLOW[cur + 1] };
    }));
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all print orders and revenue</p>
          </div>
          <span className="badge bg-primary-100 text-primary-800 text-sm px-3 py-1">Admin</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-primary-600 bg-primary-50' },
            { label: 'Today\'s Revenue', value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'All-Time Revenue', value: formatCurrency(revenue), icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
            { label: 'Active Orders', value: orders.filter(o => ['received', 'printing', 'ready'].includes(o.status)).length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          ].map((s, i) => (
            <div key={i} className="card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto pb-px -mx-1 px-1 scrollbar-none">
          {[['orders', 'Orders'], ['notifications', `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`], ['revenue', 'Revenue'], ['pricing', 'Manage Pricing']].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Filter size={16} className="text-gray-400" />
              {['all', 'received', 'printing', 'ready', 'completed', 'cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${filterStatus === s ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map(order => (
                <div key={order.id} className="card">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-sm font-bold text-gray-800">{order.id}</span>
                        <span className={STATUS_BADGE[order.status]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        {!order.paid && <span className="badge bg-red-100 text-red-700">Unpaid</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{order.student}</p>
                      <p className="text-xs text-gray-400">{order.email} • {formatDate(order.date)}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {order.files.map(f => (
                          <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">📄 {f}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{order.pages} pages</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary-600 text-lg mb-2">{formatCurrency(order.total)}</p>
                      <div className="flex flex-col gap-1.5">
                        <button className="btn-outline text-xs py-1.5 px-3">
                          <Download size={13} /> Download Files
                        </button>
                        {STATUS_FLOW.includes(order.status) && order.status !== 'completed' && (
                          <button
                            onClick={() => advanceStatus(order.id)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-primary-600" />
                <h3 className="font-semibold text-gray-800">Order Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="btn-outline text-xs py-1.5 px-3 text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-1">
                    <Trash2 size={13} /> Clear all
                  </button>
                )}
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-300 mt-1">New print orders will appear here instantly</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all
                      ${!n.read ? 'bg-blue-50 border-blue-100 hover:bg-blue-100/60' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg
                      ${!n.read ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      🖨️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {n.title}
                        </p>
                        {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1 shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {n.files?.map(f => (
                          <span key={f} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">📄 {f}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{timeAgo(n.createdAt)}</span>
                        {n.orderRef && <span className="font-mono">{n.orderRef}</span>}
                        {n.amount && <span className="font-semibold text-primary-600">{formatCurrency(n.amount)}</span>}
                        {n.delivery && <span className="capitalize">{n.delivery}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="btn-outline text-xs py-1.5 px-3 shrink-0 flex items-center gap-1.5 min-h-0 h-auto"
                      title="Print order details"
                    >
                      <Printer size={12} /> Print
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 size={18} className="text-primary-600" />
              <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Today', value: formatCurrency(todayRevenue) },
                { label: 'This Week', value: formatCurrency(revenue * 0.4) },
                { label: 'This Month', value: formatCurrency(revenue) },
              ].map((r, i) => (
                <div key={i} className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">{r.label}</p>
                  <p className="text-2xl font-bold text-primary-600">{r.value}</p>
                </div>
              ))}
            </div>
            {/* Simple bar visualization */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Orders by Status</p>
              <div className="space-y-2">
                {['completed', 'printing', 'received', 'cancelled'].map(s => {
                  const count = orders.filter(o => o.status === s).length;
                  const pct = (count / orders.length) * 100;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 capitalize">{s}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Management Tab */}
        {activeTab === 'pricing' && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-5">Manage Pricing Rates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'A4 B&W Single (GH₵/page)', defaultVal: '0.50' },
                { label: 'A4 B&W Double (GH₵/page)', defaultVal: '0.80' },
                { label: 'A4 Color Single (GH₵/page)', defaultVal: '2.00' },
                { label: 'A4 Color Double (GH₵/page)', defaultVal: '3.50' },
                { label: 'A3 B&W (GH₵/page)', defaultVal: '1.00' },
                { label: 'A3 Color (GH₵/page)', defaultVal: '4.00' },
                { label: 'Spiral Binding (GH₵)', defaultVal: '5.00' },
                { label: 'Hardcover Binding (GH₵)', defaultVal: '15.00' },
                { label: 'Campus Delivery (GH₵)', defaultVal: '3.00' },
              ].map((f, i) => (
                <div key={i}>
                  <label className="label">{f.label}</label>
                  <input type="number" step="0.10" defaultValue={f.defaultVal} className="input" />
                </div>
              ))}
            </div>
            <button className="btn-primary mt-6">Save Pricing Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}
