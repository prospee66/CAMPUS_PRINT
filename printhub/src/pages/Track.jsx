import { useState } from 'react';
import { Search, Package, Printer, CheckCircle2, Truck, Clock, AlertCircle } from 'lucide-react';

// Mock order data
const MOCK_ORDERS = {
  'PH-LQK1B-XY92': {
    ref: 'PH-LQK1B-XY92',
    status: 'printing',
    files: ['Thesis_Chapter1.pdf', 'Appendix.docx'],
    total: 24.50,
    placed: '2026-03-04T09:00:00',
    eta: '11:00 AM',
    delivery: 'pickup',
    updates: [
      { time: '9:00 AM', label: 'Order received & payment confirmed', done: true },
      { time: '9:15 AM', label: 'Printing in progress', done: true },
      { time: '~11:00 AM', label: 'Ready for collection', done: false },
    ],
  },
  'PH-DEMO1-TEST': {
    ref: 'PH-DEMO1-TEST',
    status: 'ready',
    files: ['Assignment3.pdf'],
    total: 3.50,
    placed: '2026-03-04T07:00:00',
    eta: 'Ready now',
    delivery: 'pickup',
    updates: [
      { time: '7:00 AM', label: 'Order received & payment confirmed', done: true },
      { time: '7:10 AM', label: 'Printing in progress', done: true },
      { time: '7:35 AM', label: 'Ready for collection', done: true },
    ],
  },
};

const STATUS_CONFIG = {
  received: { icon: Package, label: 'Order Received', color: 'text-amber-600 bg-amber-50', step: 0 },
  printing: { icon: Printer, label: 'Printing', color: 'text-blue-600 bg-blue-50', step: 1 },
  ready: { icon: CheckCircle2, label: 'Ready for Collection', color: 'text-emerald-600 bg-emerald-50', step: 2 },
  delivery: { icon: Truck, label: 'Out for Delivery', color: 'text-purple-600 bg-purple-50', step: 2 },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-gray-600 bg-gray-100', step: 3 },
};

export default function Track() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = MOCK_ORDERS[query.trim().toUpperCase()];
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const cfg = order ? STATUS_CONFIG[order.status] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your order reference number or email to check status</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="card mb-6">
          <label htmlFor="orderQuery" className="label">Order Reference or Email</label>
          <div className="flex gap-3">
            <input
              id="orderQuery"
              type="text"
              placeholder="e.g. PH-LQK1B-XY92"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-4 py-2.5">
              <Search size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Try: PH-LQK1B-XY92 or PH-DEMO1-TEST</p>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="card flex items-center gap-3 text-red-700 border-red-100">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Order not found</p>
              <p className="text-sm text-red-500">Check your reference number and try again.</p>
            </div>
          </div>
        )}

        {/* Order found */}
        {order && cfg && (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Reference</p>
                  <p className="font-bold text-lg font-mono text-gray-900">{order.ref}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${cfg.color}`}>
                  <cfg.icon size={15} />
                  {cfg.label}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Received</span><span>Printing</span><span>Ready</span><span>Done</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-2 bg-primary-600 rounded-full transition-all"
                    style={{ width: `${(cfg.step / 3) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={15} className="text-amber-500" />
                <span>Estimated time: <strong>{order.eta}</strong></span>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Status Updates</h3>
              <div className="space-y-4">
                {order.updates.map((u, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
                      ${u.done ? 'bg-accent' : 'bg-gray-200'}`}>
                      {u.done && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${u.done ? 'text-gray-900' : 'text-gray-400'}`}>{u.label}</p>
                      <p className="text-xs text-gray-400">{u.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
              <div className="space-y-1 text-sm">
                {order.files.map(f => (
                  <div key={f} className="text-gray-600">📄 {f}</div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-primary-600">GH₵ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Collection</span>
                <span className="font-medium text-gray-700 capitalize">{order.delivery}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
