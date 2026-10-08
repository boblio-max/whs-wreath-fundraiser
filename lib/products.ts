// ── Central product catalog ────────────────────────────────────────
// Real listings transcribed from the WHS Music Boosters 2026 flyer.
// To go live: replace each `image` with a photo of the actual product
// (same filename under /public/products/) and flip `photoStatus` to "real".

export interface Product {
  id: string;
  slug: string;
  name: string;
  size: string;
  price: number; // USD, trusted server-side
  description: string;
  details: string[];
  image: string;
  category: 'wreath' | 'swag' | 'decoration' | 'addon';
  available: boolean;
  featured?: boolean;
  photoStatus: 'placeholder-illustration' | 'real';
}

export const PRODUCTS: Product[] = [
  {
    id: 'wreath-20',
    slug: 'deluxe-noble-fir-wreath-20',
    name: 'Deluxe Noble Fir Wreath — 20″',
    size: '20 inch',
    price: 25,
    description:
      'Our classic front-door wreath, handcrafted right here for Falcon families — fresh noble fir with cedar, juniper, and natural pine cones.',
    details: [
      'Handcrafted noble fir, incense cedar & juniper',
      'Natural pine cone finish',
      '20″ — great for doors and windows',
      'Red velvet bow sold separately'
    ],
    image: '/products/wreath-20.svg',
    category: 'wreath',
    available: true,
    featured: true,
    photoStatus: 'placeholder-illustration'
  },
  {
    id: 'wreath-24',
    slug: 'deluxe-noble-fir-wreath-24',
    name: 'Deluxe Noble Fir Wreath — 24″',
    size: '24 inch',
    price: 29,
    description:
      'A fuller, grander take on the classic — the 24″ wreath our neighbors love for double doors and garage entries.',
    details: [
      'Handcrafted noble fir, incense cedar & juniper',
      'Natural pine cone finish',
      '24″ — extra-full holiday presence',
      'Red velvet bow sold separately'
    ],
    image: '/products/wreath-24.svg',
    category: 'wreath',
    available: true,
    featured: true,
    photoStatus: 'placeholder-illustration'
  },
  {
    id: 'swag-30',
    slug: 'deluxe-noble-fir-swag-30',
    name: 'Deluxe Noble Fir Swag — 30″',
    size: '30 inch',
    price: 33,
    description:
      'A graceful hanging swag for mailboxes, mantels, and stair rails — same fresh Woodinville-grown look as our wreaths.',
    details: [
      'Handcrafted noble fir & cedar',
      'Natural pine cone finish',
      '30″ hanging swag',
      'Red velvet bow sold separately'
    ],
    image: '/products/swag-30.svg',
    category: 'swag',
    available: true,
    featured: true,
    photoStatus: 'placeholder-illustration'
  },
  {
    id: 'cane-36',
    slug: 'deluxe-noble-fir-candy-cane-36',
    name: 'Deluxe Noble Fir Candy Cane — 36″',
    size: '36 inch',
    price: 30,
    description:
      'The kids’ favorite — a cheerful 36″ candy-cane-shaped swag that brightens any porch post or fence.',
    details: [
      'Handcrafted noble fir in candy-cane shape',
      'Natural pine cone finish',
      '36″ tall',
      'Red velvet bow sold separately'
    ],
    image: '/products/cane-36.svg',
    category: 'swag',
    available: true,
    photoStatus: 'placeholder-illustration'
  },
  {
    id: 'bow-red',
    slug: 'red-velvet-bow',
    name: 'Red Velvet Bow',
    size: 'One size',
    price: 3,
    description:
      'The finishing touch — a classic red velvet bow that clips onto any wreath, swag, or candy cane.',
    details: ['Rich red velvet', 'Fits any wreath or swag', 'Adds a classic holiday pop'],
    image: '/products/bow.svg',
    category: 'addon',
    available: true,
    photoStatus: 'placeholder-illustration'
  }
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export function totalsFor(items: { id: string; qty: number }[]) {
  let subtotal = 0;
  const lines = items.map(({ id, qty }) => {
    const p = productById(id);
    if (!p) throw new Error(`Unknown product: ${id}`);
    const lineTotal = p.price * qty;
    subtotal += lineTotal;
    return { id, name: p.name, size: p.size, unitPrice: p.price, qty, lineTotal };
  });
  return { lines, subtotal, total: subtotal };
}

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
