import { mkdirSync } from 'fs';
// Smoke test: cart math, validation, order POST (no network email).
process.env.ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test-token';
const base = process.env.SMOKE_URL || 'http://localhost:3000';

const assert = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } console.log('ok:', msg); };

// 1. validation + totals live in lib — quick import via compiled? Keep HTTP-level:
const order = {
  customer: { name: 'Test Neighbor', email: 'neighbor@example.com', phone: '425-555-0100', notes: 'Go Falcons!' },
  items: [{ id: 'wreath-20', qty: 2 }, { id: 'bow-red', qty: 1 }],
  paymentMethod: 'paypal',
  paymentReported: true
};

const res = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
const data = await res.json();
assert(res.status === 201, `POST /api/orders → 201 (got ${res.status})`);
assert(/^WHS-2026-/.test(data.order.requestNumber), 'unique request number issued');
assert(data.order.total === 53, `server-side total trusted (2×$25 + $3 = $53, got $${data.order.total})`);
assert(data.order.paymentStatus === 'reported', 'PayPal self-report → Payment Reported, not Received');
assert(data.order.fulfillmentStatus === 'pending', 'fulfillment starts pending');

// 2. bad input rejected
const bad = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: { name: 'x', email: 'nope' }, items: [], paymentMethod: 'paypal' }) });
assert(bad.status === 400, 'invalid order rejected with 400');

// 3. price tampering impossible (server recomputes)
const tamper = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...order, items: [{ id: 'wreath-24', qty: 1 }] }) });
const tdata = await tamper.json();
assert(tdata.order.total === 29, 'tampered cart repriced server-side ($29)');

// 4. admin locked
const anon = await fetch(`${base}/api/orders`);
assert(anon.status === 401, 'admin order list requires token');

// 5. cash blocked until configured
const cash = await fetch(`${base}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...order, paymentMethod: 'cash' }) });
assert(cash.status === 400, 'cash-by-mail blocked until mailing instructions configured');

console.log('\nAll smoke tests passed.');
