import { FileText, Printer, Package, Tag } from 'lucide-react';
import { calcFilePrice, calcOrderTotal, PRICES, BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_RATE } from '../../utils/priceCalc';
import { formatCurrency } from '../../utils/orderRef';

export default function OrderSummary({ files, options, deliveryMethod }) {
  const total = calcOrderTotal(files, options, deliveryMethod);
  const totalPages = files.reduce((s, f) => s + (f.pages || 1) * options.copies, 0);
  const bulkDiscount = totalPages >= BULK_DISCOUNT_THRESHOLD;

  const modeLabel = options.colorMode === 'color' ? 'Color' : 'B&W';
  const sideLabel = options.sides === 'double' ? 'Double-sided' : 'Single-sided';

  return (
    <div className="space-y-4">
      {/* Print Config Summary */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Printer size={18} className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">Print Configuration</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['Paper Size', options.paperSize.toUpperCase()],
            ['Color Mode', modeLabel],
            ['Sides', sideLabel],
            ['Copies', options.copies],
            ['Binding', options.binding === 'none' ? 'None' : options.binding.charAt(0).toUpperCase() + options.binding.slice(1)],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-gray-500">{k}: </span>
              <span className="font-medium text-gray-800">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">Files ({files.length})</h3>
        </div>
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-700 truncate max-w-[60%]">{f.name}</span>
              <span className="text-primary-600 font-semibold shrink-0">{formatCurrency(calcFilePrice(f, options))}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Package size={18} className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">Delivery</h3>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{deliveryMethod === 'delivery' ? 'Campus Delivery' : 'Campus Pickup'}</span>
          <span className="font-medium">{deliveryMethod === 'delivery' ? formatCurrency(PRICES.delivery) : 'Free'}</span>
        </div>
      </div>

      {/* Total */}
      <div className="card bg-primary-50 border-primary-100">
        {bulkDiscount && (
          <div className="flex items-center gap-2 mb-3 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
            <Tag size={14} />
            <span>Bulk discount applied ({BULK_DISCOUNT_RATE * 100}% off — {totalPages}+ pages)</span>
          </div>
        )}
        {options.binding !== 'none' && (
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{options.binding.charAt(0).toUpperCase() + options.binding.slice(1)} Binding</span>
            <span>{formatCurrency(options.binding === 'spiral' ? PRICES.binding_spiral : PRICES.binding_hardcover)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-primary-100">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-extrabold text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
