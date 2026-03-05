export const DEFAULT_PRICES = {
  a4_bw_single: 0.50,
  a4_bw_double: 0.80,
  a4_color_single: 2.00,
  a4_color_double: 3.50,
  a3_bw: 1.00,
  a3_color: 4.00,
  binding_spiral: 5.00,
  binding_hardcover: 15.00,
  scanning: 0.50,
  delivery: 3.00,
};

export const BULK_DISCOUNT_THRESHOLD = 100;
export const BULK_DISCOUNT_RATE = 0.10;

export function getPrices() {
  try {
    const stored = localStorage.getItem('cp_prices');
    return stored ? { ...DEFAULT_PRICES, ...JSON.parse(stored) } : DEFAULT_PRICES;
  } catch {
    return DEFAULT_PRICES;
  }
}

export function getPricePerPage({ paperSize, colorMode, sides }) {
  const prices = getPrices();
  const key = `${paperSize.toLowerCase()}_${colorMode === 'color' ? 'color' : 'bw'}${
    paperSize === 'a3' ? '' : `_${sides}`
  }`;
  return prices[key] ?? prices.a4_bw_single;
}

export function calcFilePrice(file, opts) {
  const pages = file.pages || 1;
  const copies = opts.copies || 1;
  const pricePerPage = getPricePerPage(opts);
  return pages * copies * pricePerPage;
}

export function calcOrderTotal(files, opts, deliveryMethod) {
  const prices = getPrices();
  let subtotal = files.reduce((sum, f) => sum + calcFilePrice(f, opts), 0);

  const totalPages = files.reduce((s, f) => s + (f.pages || 1) * (opts.copies || 1), 0);
  if (totalPages >= BULK_DISCOUNT_THRESHOLD) {
    subtotal = subtotal * (1 - BULK_DISCOUNT_RATE);
  }

  if (opts.binding === 'spiral') subtotal += prices.binding_spiral;
  if (opts.binding === 'hardcover') subtotal += prices.binding_hardcover;
  if (deliveryMethod === 'delivery') subtotal += prices.delivery;

  return parseFloat(subtotal.toFixed(2));
}
