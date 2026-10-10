// ── Server-side order storage ─────────────────────────────────────
// Local dev: JSON file at data/orders.json (git-ignored).
// Vercel: filesystem is ephemeral — wire Vercel KV/Postgres later; until
// then every order is ALSO emailed to the organizer so nothing is lost.
// This module never throws for a missing file; it degrades gracefully.

import { promises as fs } from 'fs';
import path from 'path';

export type PaymentStatus = 'awaited' | 'reported' | 'received';
export type FulfillmentStatus = 'pending' | 'confirmed' | 'fulfilled';

export interface OrderLine {
  id: string;
  name: string;
  size: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  requestNumber: string;
  createdAt: string;
  customer: { name: string; email: string; phone?: string; notes?: string };
  items: OrderLine[];
  subtotal: number;
  total: number;
  paymentMethod: 'paypal' | 'cash';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  emailStatus: { organizer: 'sent' | 'skipped' | 'failed'; customer: 'sent' | 'skipped' | 'failed' };
}

const filePath = () => path.join(process.cwd(), 'data', 'orders.json');

export async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(filePath(), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readOrders();
  orders.push(order);
  try {
    await fs.mkdir(path.dirname(filePath()), { recursive: true });
    await fs.writeFile(filePath(), JSON.stringify(orders, null, 2), 'utf8');
  } catch {
    // Ephemeral FS (Vercel) — order is still returned + emailed.
  }
}

export async function updateOrder(
  requestNumber: string,
  patch: Partial<Pick<Order, 'paymentStatus' | 'fulfillmentStatus'>>
): Promise<Order | null> {
  const orders = await readOrders();
  const order = orders.find((o) => o.requestNumber === requestNumber);
  if (!order) return null;
  if (patch.paymentStatus) order.paymentStatus = patch.paymentStatus;
  if (patch.fulfillmentStatus) order.fulfillmentStatus = patch.fulfillmentStatus;
  try {
    await fs.writeFile(filePath(), JSON.stringify(orders, null, 2), 'utf8');
  } catch {
    // Ephemeral FS — change applies to this response only.
  }
  return order;
}

export function newRequestNumber(): string {
  const d = new Date();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `WHS-2026-${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}-${rand}`;
}
