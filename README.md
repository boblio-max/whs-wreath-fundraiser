# WHS Music Boosters 2026 Wreath Fundraiser 🎄
### Woodinville High School — supporting our local music students

Fresh noble fir wreaths, swags & bows from your Woodinville neighbors. Order by **October 30**, pick up **Saturday, November 21st in the WHS upper parking lot**.

## Run locally

```powershell
cd "$env:USERPROFILE\OneDrive\Documents\github\whs-wreath-fundraiser"
npm install
npm run dev
# open http://localhost:3000
```

Also available: `npm run build`, `npm start`, `npm run typecheck`, `npm test` (needs `npm run dev` or deployed URL via `SMOKE_URL`).

## How ordering works (honest version)

1. Neighbors browse `/` → add wreaths → `/checkout` (no account, cart persists in localStorage).
2. They choose **PayPal QR** (scan official code, optionally tick “I’ve paid” → stored as `reported`, never `received`) or **cash by mail** (currently disabled until mailing instructions are configured).
3. `POST /api/orders` validates, reprices server-side from `lib/products.ts`, issues `WHS-2026-…`, saves to `data/orders.json` (local dev), then tries Resend email. Email failures never lose the order — confirmation page offers one-click “email the boosters”.
4. Organizers view `/admin?token=YOUR_TOKEN` (see DEPLOY.md).

## Replace before emailing the link (launch checklist)

See DEPLOY.md for the full list. Short version:

- [ ] Real wreath photos → `public/products/*.svg` (same names) — current art is labeled representative illustrations
- [ ] Official PayPal QR scan → `public/paypal-qr.svg` + set `paypal.configured = true` in `lib/site.ts` + `NEXT_PUBLIC_PAYPAL_LINK`
- [ ] Cash-by-mail payee/address/deadline → `lib/site.ts` + flip `enabled: true`
- [ ] Pickup time window for Nov 21 (currently `[NEEDS INFO]`)
- [ ] `ADMIN_TOKEN`, `ORGANIZER_EMAIL`, Resend keys in Vercel env
- [ ] Fundraiser goal/sold numbers (progress section intentionally shows no invented stats)

## Files

- `app/page.tsx` — storefront (hero, shop, mission, progress, ordering, footer)
- `lib/products.ts` — real flyer catalog ($25/$29/$33/$30/$3)
- `lib/site.ts` — all organizer-editable copy
- `app/checkout`, `app/confirmation` — order flow
- `app/api/orders/route.ts` — validation, server pricing, persistence, email
- `app/admin` — token-gated organizer list
