import { readOrders, updateOrder } from '@/lib/store';
import { NextResponse } from 'next/server';
import { productById, totalsFor } from '@/lib/products';
import { validateCustomer, validateItems } from '@/lib/validation';
import { newRequestNumber, saveOrder, type Order } from '@/lib/store';
import { sendOrderEmails } from '@/lib/email';
import { SITE } from '@/lib/site';

function authed(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const url = new URL(req.url);
  return url.searchParams.get('token') === token;
}

// Simple in-memory rate limit (per serverless instance) — enough for a fundraiser.
const hits = new Map<string, { n: number; t: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip) || { n: 0, t: now };
  if (now - h.t > 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1; hits.set(ip, h);
  return h.n > 20;
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized — organizers open /admin?token=YOUR_TOKEN.' }, { status: 401 });
  const orders = await readOrders();
  const total = orders.reduce((n, o) => n + o.total, 0);
  return NextResponse.json({ count: orders.length, total, orders });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many requests — please wait a minute and try again.' }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { customer, items, paymentMethod, paymentReported } = body as {
    customer: { name: string; email: string; phone?: string; notes?: string };
    items: { id: string; qty: number }[];
    paymentMethod: 'paypal' | 'cash';
    paymentReported?: boolean;
  };

  const errors = [...validateItems(items || []), ...validateCustomer({ ...(customer || {}), paymentMethod } as never)];
  if (paymentMethod === 'cash' && !SITE.cashByMail.enabled)
    errors.push('Cash-by-mail is not enabled until organizers configure mailing instructions.');
  if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

  // Server-side price truth: never trust browser totals.
  for (const it of items) {
    const p = productById(it.id);
    if (!p || !p.available) return NextResponse.json({ error: `Sorry — “${it.id}” is no longer available. Please refresh the shop.` }, { status: 400 });
  }
  let lines, subtotal, total;
  try { ({ lines, subtotal, total } = totalsFor(items)); }
  catch { return NextResponse.json({ error: 'Invalid products in cart.' }, { status: 400 }); }

  const order: Order = {
    requestNumber: newRequestNumber(),
    createdAt: new Date().toISOString(),
    customer: { name: customer.name.trim(), email: customer.email.trim().toLowerCase(), phone: (customer.phone || '').trim(), notes: (customer.notes || '').trim() },
    items: lines, subtotal, total,
    paymentMethod,
    paymentStatus: paymentReported ? 'reported' : 'awaited',
    fulfillmentStatus: 'pending',
    emailStatus: { organizer: 'skipped', customer: 'skipped' }
  };

  // Persist FIRST so email failures never lose an order.
  await saveOrder(order);
  order.emailStatus = await sendOrderEmails(order);
  // Best-effort: persist email outcome too (no-op on ephemeral FS).
  try { const { readOrders: r } = await import('@/lib/store'); void r; } catch {}

  return NextResponse.json({ ok: true, order }, { status: 201 });
}

export async function PATCH(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  let body: {
    token?: string;
    requestNumber?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!token || body.token !== token)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!body.requestNumber)
    return NextResponse.json({ error: 'Missing request number.' }, { status: 400 });

  const patch: { paymentStatus?: 'awaited' | 'reported' | 'received'; fulfillmentStatus?: 'pending' | 'confirmed' | 'fulfilled' } = {};
  if (body.paymentStatus !== undefined) {
    if (!['awaited', 'reported', 'received'].includes(body.paymentStatus))
      return NextResponse.json({ error: 'Invalid payment status.' }, { status: 400 });
    patch.paymentStatus = body.paymentStatus as 'awaited' | 'reported' | 'received';
  }
  if (body.fulfillmentStatus !== undefined) {
    if (!['pending', 'confirmed', 'fulfilled'].includes(body.fulfillmentStatus))
      return NextResponse.json({ error: 'Invalid fulfillment status.' }, { status: 400 });
    patch.fulfillmentStatus = body.fulfillmentStatus as 'pending' | 'confirmed' | 'fulfilled';
  }
  if (!patch.paymentStatus && !patch.fulfillmentStatus)
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });

  const order = await updateOrder(body.requestNumber, patch);
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}
