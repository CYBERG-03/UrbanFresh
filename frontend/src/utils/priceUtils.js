/**
 * Utility – Formats a product price in LKR (Sri Lankan Rupees) with the
 * correct pricing unit suffix for display throughout the UI.
 *
 * Examples:
 *   formatPrice(450, 'PER_KG')   → "Rs. 450.00 / kg"
 *   formatPrice(120, 'PER_ITEM') → "Rs. 120.00"
 *   formatPrice(12.5, 'PER_L')   → "Rs. 12.50 / L"
 *
 * @param {number|string} price - numeric price value
 * @param {string}        unit  - PricingUnit enum string from the API
 * @returns {string} formatted price string
 */
const UNIT_LABELS = {
  PER_KG:   '/ kg',
  PER_G:    '/ g',
  PER_L:    '/ L',
  PER_ML:   '/ ml',
  PER_ITEM: '',
};

export function formatPrice(price, unit) {
  const amount = `Rs. ${Number(price).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const suffix = UNIT_LABELS[unit] ?? '';
  return suffix ? `${amount} ${suffix}` : amount;
}
