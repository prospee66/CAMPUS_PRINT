export function generateOrderRef() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PH-${timestamp}-${random}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
}
