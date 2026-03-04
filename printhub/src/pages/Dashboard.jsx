import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FileText, RefreshCw, Download, Settings, Clock, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/orderRef';

const MOCK_ORDERS = [
  { id: 'PH-LQK1B-XY92', date: '2026-03-04', files: ['Thesis_Chapter1.pdf', 'Appendix.docx'], total: 24.50, status: 'printing', pages: 48, colorMode: 'bw' },
  { id: 'PH-DEMO1-TEST', date: '2026-03-03', files: ['Assignment3.pdf'], total: 3.50, status: 'completed', pages: 7, colorMode: 'bw' },
  { id: 'PH-AB12C-GH45', date: '2026-02-28', files: ['Presentation.pptx'], total: 14.00, status: 'completed', pages: 7, colorMode: 'color' },
  { id: 'PH-ZQ9X1-LK77', date: '2026-02-20', files: ['Lab_Report.docx', 'Data.xlsx'], total: 6.00, status: 'cancelled', pages: 12, colorMode: 'bw' },
];

const STATUS_BADGE = {
  pending: 'badge-pending',
  printing: 'badge-printing',
  ready: 'badge-ready',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: 'student@uni.edu',
    studentId: 'UG-2024-001',
    campus: 'Legon',
    defaultDelivery: 'pickup',
  });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const totalSpent = MOCK_ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const completedCount = MOCK_ORDERS.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your print orders and profile</p>
          </div>
          <Link to="/order" className="btn-primary text-sm">
            + New Order
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: MOCK_ORDERS.length, icon: FileText, color: 'text-primary-600 bg-primary-50' },
            { label: 'Completed', value: completedCount, icon: Package, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Total Spent', value: formatCurrency(totalSpent), icon: Clock, color: 'text-amber-600 bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className="card">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[['orders', 'Order History'], ['profile', 'Profile Settings']].map(([tab, label]) => (
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
          <div className="space-y-3">
            {MOCK_ORDERS.map(order => (
              <div key={order.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-bold text-gray-800">{order.id}</span>
                      <span className={STATUS_BADGE[order.status]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {order.files.map(f => (
                        <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">📄 {f}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{order.pages} pages • {order.colorMode === 'color' ? 'Color' : 'B&W'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary-600 text-lg">{formatCurrency(order.total)}</p>
                    <div className="flex gap-2 mt-2">
                      {order.status === 'completed' && (
                        <>
                          <button className="btn-outline text-xs py-1.5 px-3">
                            <Download size={13} /> Receipt
                          </button>
                          <Link to="/order" className="btn-outline text-xs py-1.5 px-3">
                            <RefreshCw size={13} /> Reorder
                          </Link>
                        </>
                      )}
                      {(order.status === 'printing' || order.status === 'pending') && (
                        <Link to="/track" className="btn-outline text-xs py-1.5 px-3">
                          Track
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={18} className="text-primary-600" />
              <h3 className="font-semibold text-gray-800">Profile Settings</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'name', label: 'Full Name', type: 'text', field: 'name' },
                { id: 'email', label: 'Email Address', type: 'email', field: 'email' },
                { id: 'studentId', label: 'Student ID', type: 'text', field: 'studentId' },
                { id: 'campus', label: 'Campus', type: 'text', field: 'campus' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="label">{f.label}</label>
                  <input
                    id={f.id}
                    type={f.type}
                    value={profile[f.field]}
                    onChange={e => setProfile(p => ({ ...p, [f.field]: e.target.value }))}
                    className="input"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="defaultDelivery" className="label">Default Delivery Preference</label>
                <select
                  id="defaultDelivery"
                  value={profile.defaultDelivery}
                  onChange={e => setProfile(p => ({ ...p, defaultDelivery: e.target.value }))}
                  className="input"
                >
                  <option value="pickup">Campus Pickup</option>
                  <option value="delivery">Campus Delivery</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn-primary">Save Changes</button>
              <button onClick={logout} className="btn-outline text-red-600 border-red-200 hover:bg-red-50">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
