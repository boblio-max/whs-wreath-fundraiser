// ── Site-wide fundraiser configuration ─────────────────────────────
// Everything an organizer must confirm before launch lives here.
// Nothing below invents policy — unknowns are explicit placeholders.

export const SITE = {
  fundraiserName: 'WHS Music Boosters 2026 Wreath Fundraiser',
  schoolShort: 'Woodinville High School',
  orgName: 'WHS Music Boosters',
  orgSupports: 'the WHS Music Department and its students',
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || '2010436@apps.nsd.org',
  organizerEmail: process.env.ORGANIZER_EMAIL || '2010436@apps.nsd.org',

  // From the printed flyer
  orderDeadlineLabel: 'October 30',
  pickupLabel:
    'Saturday, November 21st — Woodinville High School upper parking lot',
  pickupTimeNote:
    '[NEEDS INFO: pickup time window — e.g. "9am–1pm". Confirm with boosters before emailing the link.]',

  paymentPolicy:
    'Payment is due at time of order. Checks are payable to “WHS Music Boosters”.',
  craftNote:
    'Noble fir wreaths and swags are handcrafted with fresh noble fir, incense cedar, and juniper, finished with natural pine cones for a classic holiday look. Bows sold separately.',

  paypal: {
    // Official QR cropped + enlarged from the booster flyer (public/paypal-qr.png).
    // If phones struggle to scan it, replace with a sharp close-up scan (same filename).
    qrImage: '/paypal-qr.png',
    link: process.env.NEXT_PUBLIC_PAYPAL_LINK || '',
    configured: true
  },
  cashByMail: {
    // [NEEDS INFO] — cash-by-mail is OFF until the organizer supplies these.
    enabled: false,
    payee: '[NEEDS INFO: payee name for mailed cash]',
    addressLines: ['[NEEDS INFO: mailing address line 1]', '[NEEDS INFO: city/state/zip]'],
    deadline: 'Include with your [NEEDS INFO: cash-mail deadline]',
    instructions:
      'Cash-by-mail details are being finalized by the boosters. Please choose PayPal for now, or email us and we’ll help complete your request.'
  }
} as const;

export type PaymentMethod = 'paypal' | 'cash';
