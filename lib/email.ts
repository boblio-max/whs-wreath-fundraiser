// ── Email delivery (Resend when configured, honest fallback) ──────
// Returns 'sent' | 'skipped' | 'failed' — the API never claims an email
// went out unless the provider confirms it.

import type { Order } from './store';
import { SITE } from './site';
import { money } from './products';

function orderHtml(order: Order): string {
  const rows = order.items
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e0cf">${l.name} <span style="color:#6b7280">(${l.size})</span> × ${l.qty}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #e8e0cf">${money(l.lineTotal)}</td></tr>`
    )
    .join('');
  const payBlock =
    order.paymentMethod === 'paypal'
      ? `<p><strong>Payment:</strong> PayPal QR — please scan the code on the confirmation page for <strong>${money(order.total)}</strong> and include request <strong>${order.requestNumber}</strong> in the payment note if possible.</p>`
      : `<p><strong>Payment:</strong> Cash by mail — please mail <strong>${money(order.total)}</strong> per the organizer’s instructions and include request <strong>${order.requestNumber}</strong>.</p>`;
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fffdf6;color:#1c2b21;padding:24px;border:1px solid #e8e0cf;border-radius:12px">
    <p style="color:#8a6d2b;letter-spacing:2px;font-size:12px">WHS MUSIC BOOSTERS • WOODINVILLE, WA</p>
    <h2 style="margin:4px 0 0">Holiday Wreath Request ${order.requestNumber}</h2>
    <p>Hi ${order.customer.name} — thank you for supporting our Woodinville High School musicians! Your request has been <strong>received</strong>. Payment is <strong>not confirmed</strong> until a booster verifies it.</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    <p align="right"><strong>Total due: ${money(order.total)}</strong></p>
    ${payBlock}
    <p><strong>Pickup:</strong> ${SITE.pickupLabel}. ${SITE.pickupTimeNote}</p>
    <p>Questions? Reply to this email or write <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>.</p>
    <p style="color:#6b7280;font-size:13px">Order deadline: ${SITE.orderDeadlineLabel}. ${SITE.paymentPolicy}</p>
  </div>`;
}

export async function sendOrderEmails(order: Order): Promise<Order['emailStatus']> {
  const key = process.env.RESEND_API_KEY;
  const status: Order['emailStatus'] = { organizer: 'skipped', customer: 'skipped' };
  if (!key) return status; // honest: not configured, not claimed

  try {
    const from = process.env.EMAIL_FROM || 'WHS Music Boosters <fundraiser@woodinville-music.example>';
    const organizer = process.env.ORGANIZER_EMAIL || SITE.organizerEmail;
    const subject = `Holiday Wreath Request ${order.requestNumber} — Confirmation and Payment Instructions`;
    const html = orderHtml(order);

    const send = async (to: string) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, html, reply_to: process.env.EMAIL_REPLY_TO || SITE.contactEmail })
      });
      return res.ok;
    };

    status.organizer = (await send(organizer)) ? 'sent' : 'failed';
    status.customer = (await send(order.customer.email)) ? 'sent' : 'failed';
  } catch {
    status.organizer = 'failed';
    status.customer = 'failed';
  }
  return status;
}
