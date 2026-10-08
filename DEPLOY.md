# Deploy to Vercel (stable email-shareable URL)

## 1. Push + import
```powershell
cd "$env:USERPROFILE\OneDrive\Documents\github\whs-wreath-fundraiser"
git init; git add -A; git commit -m "WHS wreath fundraiser storefront"
gh repo create whs-wreath-fundraiser --public --source=. --push
```
Then https://vercel.com/new → import `whs-wreath-fundraiser` → framework auto-detected (Next.js).

## 2. Environment variables (Vercel → Settings → Environment Variables)
| Key | Value |
|---|---|
| `ORGANIZER_EMAIL` | `2010436@apps.nsd.org` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `2010436@apps.nsd.org` |
| `ADMIN_TOKEN` | long random string (organizers open `/admin?token=…`) |
| `NEXT_PUBLIC_SITE_URL` | your `https://…vercel.app` URL |
| `NEXT_PUBLIC_PAYPAL_LINK` | boosters’ public PayPal.me link (optional, after QR installed) |
| `RESEND_API_KEY` | from https://resend.com (required for automated emails) |
| `EMAIL_FROM` | `WHS Music Boosters <fundraiser@your-verified-domain>` |
| `EMAIL_REPLY_TO` | `2010436@apps.nsd.org` |

Without `RESEND_API_KEY`: orders still save + confirmation page gives a mailto fallback. The site never claims emails were sent unless Resend confirms.

## 3. Persistent orders on Vercel
`data/orders.json` works for local dev but Vercel serverless FS is ephemeral. For launch, pick one:
- **Simplest (recommended now):** rely on organizer notification emails via Resend + the admin list as a live view; export regularly.
- **Durable:** add Vercel KV or Postgres and extend `lib/store.ts` `readOrders/saveOrder` (integration point is isolated to that one file).

## 4. Test before emailing (`Testing` milestone)
```powershell
npm run build
npm start            # production mode locally
npm test             # smoke: totals, validation, tamper-proofing, auth, cash-gate
```
Then click through: shop → cart → checkout (PayPal path) → confirmation → `/admin?token=…`. Verify the request number, $53-style math, and that PayPal self-report stays “Payment Reported”.

## 5. Launch checklist (info still needed from organizers)
- Real photos → `public/products/` • official PayPal QR → `public/paypal-qr.svg` (+ flip `configured`)
- Cash-by-mail payee/address/deadline → `lib/site.ts`
- Pickup time window Nov 21 • order deadline confirmed Oct 30
- Fundraiser goal/sold figures (progress hidden until real)
