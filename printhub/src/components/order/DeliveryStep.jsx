import { MapPin, Package } from 'lucide-react';

const TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
];

export default function DeliveryStep({ method, details, onMethodChange, onDetailsChange }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="label mb-3">Choose Delivery Method</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { value: 'pickup', icon: Package, title: 'Campus Pickup', desc: 'Collect from our desk — free of charge' },
            { value: 'delivery', icon: MapPin, title: 'Campus Delivery', desc: 'Delivered to your room or hostel — GH₵ 3.00' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onMethodChange(opt.value)}
              className={`p-5 rounded-xl border-2 text-left transition-all
                ${method === opt.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <opt.icon size={22} className={method === opt.value ? 'text-primary-600' : 'text-gray-400'} />
              <p className={`font-semibold mt-2 mb-1 ${method === opt.value ? 'text-primary-700' : 'text-gray-800'}`}>{opt.title}</p>
              <p className="text-sm text-gray-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {method === 'pickup' && (
        <div>
          <label htmlFor="timeSlot" className="label">Preferred Pickup Time</label>
          <select
            id="timeSlot"
            value={details.timeSlot}
            onChange={e => onDetailsChange({ timeSlot: e.target.value })}
            className="input"
          >
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {method === 'delivery' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="location" className="label">Delivery Location (Hostel/Room)</label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Volta Hall, Room 204"
              value={details.location}
              onChange={e => onDetailsChange({ location: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="deliveryTime" className="label">Preferred Delivery Time</label>
            <select
              id="deliveryTime"
              value={details.timeSlot}
              onChange={e => onDetailsChange({ timeSlot: e.target.value })}
              className="input"
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
