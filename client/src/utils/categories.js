/**
 * TRANSACTION_CATEGORIES
 * Map category slugs → display label + emoji icon.
 * Used by TransactionItem and the Send/Request forms.
 */
export const TRANSACTION_CATEGORIES = {
  food:       { label: 'Food & Dining',  icon: '🍔' },
  shopping:   { label: 'Shopping',       icon: '🛍️' },
  rent:       { label: 'Rent',           icon: '🏠' },
  travel:     { label: 'Travel',         icon: '✈️' },
  utilities:  { label: 'Utilities',      icon: '💡' },
  health:     { label: 'Health',         icon: '🏥' },
  education:  { label: 'Education',      icon: '📚' },
  entertainment:{ label: 'Entertainment',icon: '🎬' },
  other:      { label: 'Other',          icon: '💼' },
};

export const CATEGORY_LIST = Object.entries(TRANSACTION_CATEGORIES).map(
  ([value, { label, icon }]) => ({ value, label, icon })
);
