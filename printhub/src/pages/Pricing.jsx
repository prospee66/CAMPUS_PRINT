import { useState } from 'react';
import { Calculator, Tag, CheckCircle2 } from 'lucide-react';
import { PRICES, getPricePerPage, BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_RATE } from '../utils/priceCalc';
import { formatCurrency } from '../utils/orderRef';
import { Link } from 'react-router-dom';

const pricingRows = [
  { service: 'A4 B&W Print', price: 'GH₵ 0.50 / page', note: 'Single-sided' },
  { service: 'A4 B&W Print', price: 'GH₵ 0.80 / page', note: 'Double-sided' },
  { service: 'A4 Color Print', price: 'GH₵ 2.00 / page', note: 'Single-sided' },
  { service: 'A4 Color Print', price: 'GH₵ 3.50 / page', note: 'Double-sided' },
  { service: 'A3 B&W Print', price: 'GH₵ 1.00 / page', note: 'Single-sided' },
  { service: 'A3 Color Print', price: 'GH₵ 4.00 / page', note: 'Single-sided' },
  { service: 'Spiral Binding', price: `GH₵ ${PRICES.binding_spiral.toFixed(2)}`, note: 'Per document' },
  { service: 'Hardcover Binding', price: `GH₵ ${PRICES.binding_hardcover.toFixed(2)}`, note: 'Per document' },
  { service: 'Scanning', price: `GH₵ ${PRICES.scanning.toFixed(2)} / page`, note: 'Up to A4' },
  { service: 'Campus Delivery', price: `GH₵ ${PRICES.delivery.toFixed(2)}`, note: 'Flat rate' },
  { service: 'Bulk Discount', price: `${BULK_DISCOUNT_RATE * 100}% off`, note: `${BULK_DISCOUNT_THRESHOLD}+ pages, auto-applied` },
];

const tiers = [
  { label: '1–49 pages', discount: '0%', badge: null },
  { label: '50–99 pages', discount: '5% off', badge: null },
  { label: '100+ pages', discount: '10% off', badge: 'Most Popular' },
  { label: '500+ pages', discount: '15% off', badge: null },
];

export default function Pricing() {
  const [pages, setPages] = useState(20);
  const [colorMode, setColorMode] = useState('bw');
  const [paperSize, setPaperSize] = useState('a4');
  const [sides, setSides] = useState('single');
  const [copies, setCopies] = useState(1);
  const [binding, setBinding] = useState('none');
  const [delivery, setDelivery] = useState(false);

  const pricePerPage = getPricePerPage({ paperSize, colorMode, sides });
  const totalPages = pages * copies;
  const baseCost = pricePerPage * totalPages;
  const bulkOff = totalPages >= BULK_DISCOUNT_THRESHOLD ? baseCost * BULK_DISCOUNT_RATE : 0;
  const bindingCost = binding === 'spiral' ? PRICES.binding_spiral : binding === 'hardcover' ? PRICES.binding_hardcover : 0;
  const deliveryCost = delivery ? PRICES.delivery : 0;
  const total = baseCost - bulkOff + bindingCost + deliveryCost;

  const RadioGroup = ({ label, value, onChange, opts }) => (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {opts.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all
              ${value === o.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Transparent Pricing</h1>
          <p className="section-subtitle">No hidden fees. Pay exactly what you see.</p>
        </div>

        {/* Pricing Table */}
        <div className="card overflow-hidden mb-10 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold">Service</th>
                  <th className="text-center px-5 py-3.5 font-semibold">Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-medium text-gray-800">{row.service}</td>
                    <td className="px-5 py-3.5 text-center text-primary-600 font-bold">{row.price}</td>
                    <td className="px-5 py-3.5 text-gray-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bulk Discount Tiers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tiers.map((t, i) => (
              <div key={i} className={`card text-center relative ${t.badge ? 'border-primary-300 bg-primary-50' : ''}`}>
                {t.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {t.badge}
                  </span>
                )}
                <p className="text-sm text-gray-500 mb-1 mt-1">{t.label}</p>
                <p className="text-xl font-bold text-primary-600">{t.discount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Calculator */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Calculator size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Price Calculator</h2>
              <p className="text-sm text-gray-500">Get an instant quote for your print job</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label htmlFor="pages" className="label">Number of Pages</label>
              <input
                id="pages"
                type="number"
                min={1}
                max={10000}
                value={pages}
                onChange={e => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="copiesCalc" className="label">Copies</label>
              <input
                id="copiesCalc"
                type="number"
                min={1}
                max={100}
                value={copies}
                onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="input"
              />
            </div>

            <RadioGroup label="Paper Size" value={paperSize} onChange={setPaperSize} opts={[
              { value: 'a4', label: 'A4' },
              { value: 'a3', label: 'A3' },
            ]} />
            <RadioGroup label="Color Mode" value={colorMode} onChange={setColorMode} opts={[
              { value: 'bw', label: 'B&W' },
              { value: 'color', label: 'Color' },
            ]} />
            <RadioGroup label="Sides" value={sides} onChange={setSides} opts={[
              { value: 'single', label: 'Single-sided' },
              { value: 'double', label: 'Double-sided' },
            ]} />
            <RadioGroup label="Binding" value={binding} onChange={setBinding} opts={[
              { value: 'none', label: 'None' },
              { value: 'spiral', label: 'Spiral' },
              { value: 'hardcover', label: 'Hardcover' },
            ]} />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              id="delivery"
              type="checkbox"
              checked={delivery}
              onChange={e => setDelivery(e.target.checked)}
              className="w-4 h-4 text-primary-600"
            />
            <label htmlFor="delivery" className="text-sm font-medium text-gray-700">
              Add campus delivery (+GH₵ {PRICES.delivery.toFixed(2)})
            </label>
          </div>

          {/* Result */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-5 text-white">
            <div className="space-y-1.5 mb-3 text-sm text-blue-100">
              <div className="flex justify-between">
                <span>{totalPages} pages × GH₵ {pricePerPage.toFixed(2)}</span>
                <span>{formatCurrency(baseCost)}</span>
              </div>
              {bulkOff > 0 && (
                <div className="flex justify-between text-emerald-300">
                  <span className="flex items-center gap-1"><Tag size={13} /> Bulk discount (10%)</span>
                  <span>–{formatCurrency(bulkOff)}</span>
                </div>
              )}
              {bindingCost > 0 && (
                <div className="flex justify-between">
                  <span>{binding.charAt(0).toUpperCase() + binding.slice(1)} binding</span>
                  <span>{formatCurrency(bindingCost)}</span>
                </div>
              )}
              {deliveryCost > 0 && (
                <div className="flex justify-between">
                  <span>Campus delivery</span>
                  <span>{formatCurrency(deliveryCost)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center border-t border-white/20 pt-3">
              <span className="text-lg font-semibold">Estimated Total</span>
              <span className="text-3xl font-extrabold">{formatCurrency(total)}</span>
            </div>
            {totalPages >= BULK_DISCOUNT_THRESHOLD && (
              <div className="mt-2 flex items-center gap-1.5 text-emerald-300 text-sm">
                <CheckCircle2 size={14} /> Bulk discount applied!
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link to="/order" className="btn-primary w-full justify-center">
              Place This Order Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
