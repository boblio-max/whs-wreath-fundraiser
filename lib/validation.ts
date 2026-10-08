// ── Shared order validation (client + server must agree) ──────────

export interface OrderItemInput {
  id: string;
  qty: number;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  paymentMethod: 'paypal' | 'cash';
  paymentReported?: boolean;
}

export function validateCustomer(c: CustomerInput): string[] {
  const errors: string[] = [];
  if (!c.name || c.name.trim().length < 2) errors.push('Please enter your full name.');
  if (!c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()))
    errors.push('Please enter a valid email address.');
  if (c.phone && c.phone.trim() && !/^[+()\-.\s\d]{7,20}$/.test(c.phone.trim()))
    errors.push('That phone number doesn’t look right — check it and try again.');
  if (!['paypal', 'cash'].includes(c.paymentMethod)) errors.push('Please choose a payment method.');
  if ((c.notes || '').length > 1000) errors.push('Notes must be under 1,000 characters.');
  return errors;
}

export function validateItems(items: OrderItemInput[]): string[] {
  const errors: string[] = [];
  if (!Array.isArray(items) || items.length === 0) errors.push('Your cart is empty.');
  if (items.length > 20) errors.push('Too many line items — please keep it under 20.');
  for (const it of items) {
    if (typeof it.id !== 'string' || !it.id) errors.push('Invalid product in cart.');
    if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 25)
      errors.push('Quantities must be between 1 and 25.');
  }
  return errors;
}
