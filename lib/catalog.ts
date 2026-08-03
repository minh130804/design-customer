/**
 * Danh mục hàng cho các màn DUYỆT — trang chủ, tìm kiếm, danh mục, trang shop.
 *
 * Đây là kiểu dữ liệu NHẸ, cố tình khác `Product` ở lib/products.ts. Thẻ sản
 * phẩm trong lưới không cần mô tả, không cần đánh giá chi tiết, không cần trục
 * biến thể — và một trang danh mục 60 thẻ mà tải nguyên `Product` thì payload
 * gấp khoảng 20 lần.
 *
 * Ở bản thật: `GET /v1/listings?q=&facets=` trả đúng hình dạng này, và
 * `GET /v1/products/{slug}` mới trả `Product` đầy đủ.
 */

import { CATEGORY_TREE, filterableFor, type CategoryNode } from './categories';
import { demoPhoto } from './utils';
import type { FulfilmentKind } from './products';

export type Listing = {
  slug: string;
  title: string;
  shopSlug: string;
  shopName: string;
  kind: FulfilmentKind;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviewCount: number;
  soldCount: number;
  image: string;
  /**
   * Ảnh đại diện dạng CHUYỂN ĐỘNG, nếu seller có tải lên.
   *
   * `image` vẫn là khung hình tĩnh và vẫn bắt buộc: nó là thứ hiện lúc chưa
   * phát, trong thẻ chia sẻ, và trên thiết bị đã bật "giảm chuyển động". Thẻ
   * sản phẩm chỉ đổi sang `motion` khi người dùng chủ động rê chuột vào.
   */
  motion?: string;
  freeShipping: boolean;
  /** Hàng số không có khoảng giao — để null thay vì để 0 */
  leadDays: [number, number] | null;
  /** Do HỆ THỐNG cấp, seller không tự gắn được. Nhãn tự khai thì mất giá trị. */
  badges: ('bestseller' | 'star-seller' | 'low-stock')[];
  categoryPath: string[];
  /**
   * Thuộc tính động — nguồn của bộ lọc mặt (facet).
   *
   * Khoá là `code` CHUẨN HOÁ trong lib/categories.ts (`colour`, `material`),
   * giá trị là `value` chuẩn hoá (`black`, `organic-cotton`) — KHÔNG phải nhãn
   * hiển thị. Lọc và đối chiếu chạy trên `value`; đổi nhãn hiển thị hay dịch
   * sang tiếng khác không được làm hỏng dữ liệu cũ.
   */
  attributes: Record<string, string>;
};

export type Shop = {
  slug: string;
  name: string;
  owner: string;
  location: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  sales: number;
  /** Số người đã bấm theo dõi shop */
  admirers: number;
  joinedYear: number;
  onTimeRate: number;
  replyRate: number;
  starSeller: boolean;
  /** Tab "About" — do seller tự viết, khác hẳn các chỉ số do hệ thống tính */
  story: string[];
  /**
   * Tab "Shop policies".
   *
   * Chính sách của SHOP nằm trên nền chính sách sàn, không thay thế nó: shop
   * được phép rộng rãi hơn mức tối thiểu, không được hẹp hơn. Vì vậy mỗi mục
   * ở đây là phần seller tự khai, còn mức sàn nằm ở /help/returns.
   */
  policies: { shipping: string; returns: string; payment: string; privacy: string };
};

export const SHOPS: Shop[] = [
  {
    slug: 'lotus-studio',
    name: 'Lotus Studio',
    owner: 'Thu',
    location: 'Ha Noi, Viet Nam',
    tagline: 'Hand-drawn botanical prints, made to order in small batches.',
    rating: 4.8,
    reviewCount: 2610,
    sales: 12400,
    admirers: 4180,
    joinedYear: 2020,
    onTimeRate: 97,
    replyRate: 98,
    starSeller: true,
    story: [
      'Lotus Studio started as a sketchbook. Thu drew botanicals for years before anyone suggested putting them on anything, and the first shirt was made because a friend asked for one.',
      'Everything is still drawn by hand, then printed to order in a workshop twenty minutes from the studio. Printing after the order arrives means nothing sits in a box unsold — and it means we can keep drawing new things instead of clearing old stock.',
      'If a print comes out wrong, tell us. We would rather remake it than have it live in a drawer.',
    ],
    policies: {
      shipping:
        'Printed items leave the workshop in 3–5 working days, then travel with tracking. Design files are sent the moment payment clears.',
      returns:
        'Returns accepted within 30 days. Personalised items are only returnable if they arrive damaged or differ from what was ordered.',
      payment: 'Card and digital wallets, handled by the marketplace. The shop never sees your card details.',
      privacy:
        'We see the delivery address on parcels we send you, and nothing else — not your other addresses, not your orders from other shops.',
    },
  },
  {
    slug: 'carp-atelier',
    name: 'Carp Atelier',
    owner: 'Nam',
    location: 'Da Nang, Viet Nam',
    tagline: 'Folk motifs redrawn for modern apparel.',
    rating: 4.6,
    reviewCount: 840,
    sales: 3100,
    admirers: 970,
    joinedYear: 2022,
    onTimeRate: 93,
    replyRate: 91,
    starSeller: false,
    story: [
      'Carp Atelier redraws folk motifs — carp, waves, temple tilework — for things people actually wear. Nam grew up around them and got tired of seeing them only on souvenirs.',
      'Most designs are screen-printed by hand in Da Nang, which is why the palettes are small: every colour is another screen, another pass, another chance to misalign. The limit is the point.',
    ],
    policies: {
      shipping:
        'Screen-printed items take 5–7 working days to make. Stocked items leave the next working day.',
      returns:
        'Returns accepted within 30 days. Send a photo first — most print faults we can fix without you posting anything back.',
      payment: 'Card and digital wallets, handled by the marketplace.',
      privacy: 'Delivery address only, used for the parcel and nothing else.',
    },
  },
  {
    slug: 'paper-north',
    name: 'Paper North',
    owner: 'Linh',
    location: 'Ha Noi, Viet Nam',
    tagline: 'Vector packs and print-ready files for makers.',
    rating: 4.9,
    reviewCount: 1520,
    sales: 8800,
    admirers: 3240,
    joinedYear: 2021,
    onTimeRate: 100,
    replyRate: 99,
    starSeller: true,
    story: [
      'Paper North makes files, not objects. Icon sets, brushes, seamless patterns and type — the things other makers build their own work on top of.',
      'Every pack is checked the way it will actually be used: icons dropped into an interface at 16 px, patterns tiled four across, fonts typed out with full Vietnamese diacritics. A file that only looks right in the preview is not finished.',
    ],
    policies: {
      shipping:
        'Nothing is shipped. Download links appear on the confirmation page and in your email the moment payment clears.',
      returns:
        'Full refund while the files are still undownloaded. After that we cannot take them back, so a refund would mean giving them away.',
      payment: 'Card and digital wallets, handled by the marketplace.',
      privacy: 'We only see the email the download links go to.',
    },
  },
  {
    slug: 'cyber-crafts',
    name: 'Cyber Crafts Studio',
    owner: 'Kenji & Minh',
    location: 'Ho Chi Minh, Viet Nam',
    tagline: 'Futuristic POD apparel, tech accessories, and urban streetwear.',
    rating: 4.95,
    reviewCount: 3820,
    sales: 15900,
    admirers: 6400,
    joinedYear: 2020,
    onTimeRate: 99,
    replyRate: 100,
    starSeller: true,
    story: [
      'Cyber Crafts Studio blends cyberpunk aesthetics with high-grade heavyweight fabrics.',
      'Printed on demand using eco-friendly water-based inks and ships with express tracking worldwide.',
    ],
    policies: {
      shipping: 'Express production within 2-4 days.',
      returns: '30-day money-back guarantee.',
      payment: 'All major credit cards, Apple Pay, Google Pay.',
      privacy: 'Strict buyer data encryption.',
    },
  },
  {
    slug: 'nexus-digital',
    name: 'Nexus Digital Labs',
    owner: 'Elena',
    location: 'Singapore',
    tagline: '3D assets, UI design systems, and pro sound libraries.',
    rating: 4.9,
    reviewCount: 2900,
    sales: 11200,
    admirers: 4500,
    joinedYear: 2021,
    onTimeRate: 100,
    replyRate: 99,
    starSeller: true,
    story: [
      'Nexus Digital Labs creates high-performance digital assets for creators, game developers, and UI designers.',
    ],
    policies: {
      shipping: 'Instant digital download immediately after payment.',
      returns: 'Undownloaded items eligible for full refund.',
      payment: 'Marketplace checkout.',
      privacy: 'Privacy guaranteed.',
    },
  },
  {
    slug: 'artisan-home',
    name: 'Artisan Home Goods',
    owner: 'Mai & Alex',
    location: 'Hoi An, Viet Nam',
    tagline: 'Handcrafted soy candles, ceramic drinkware, and luxury home decor.',
    rating: 4.85,
    reviewCount: 1940,
    sales: 7600,
    admirers: 3100,
    joinedYear: 2019,
    onTimeRate: 98,
    replyRate: 97,
    starSeller: true,
    story: [
      'Small batch handcrafted lifestyle items for peaceful modern living spaces.',
    ],
    policies: {
      shipping: 'Crafted & dispatched in 3-5 business days.',
      returns: '30-day hassle free returns.',
      payment: 'Secure checkout.',
      privacy: 'Address used strictly for delivery.',
    },
  },
];

const BASE_LISTINGS: Listing[] = [
  {
    slug: 'lotus-tee',
    title: 'Lotus Tee, hand-drawn lotus print on combed ring-spun cotton, relaxed unisex fit',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'pod',
    priceCents: 2500,
    compareAtCents: 3200,
    rating: 4.9,
    reviewCount: 134,
    soldCount: 1420,
    image: demoPhoto('lotus-tee'),
    motion: '/img/tee-motion.svg',
    freeShipping: true,
    leadDays: [6, 12],
    badges: ['bestseller', 'star-seller'],
    categoryPath: ['Clothing', 'Tops', 'T-shirts'],
    attributes: { material: 'cotton', colour: 'black', size: 'm', gsm: '180' },
  },
  {
    slug: 'lotus-tee-cream',
    title: 'Lotus Tee in cream, water-based DTG print, pre-shrunk heavyweight jersey',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'pod',
    priceCents: 2700,
    compareAtCents: null,
    rating: 4.8,
    reviewCount: 61,
    soldCount: 430,
    image: demoPhoto('lotus-tee-cream'),
    freeShipping: true,
    leadDays: [6, 12],
    badges: [],
    categoryPath: ['Clothing', 'Tops', 'T-shirts'],
    attributes: { material: 'cotton', colour: 'cream', size: 'l', gsm: '220' },
  },
  {
    slug: 'lotus-icon-pack',
    title: 'Lotus icon pack — 24 SVG and 24 PNG botanical icons at 300 DPI',
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    kind: 'file',
    priceCents: 990,
    compareAtCents: 1900,
    rating: 5,
    reviewCount: 212,
    soldCount: 3900,
    image: demoPhoto('lotus-icon-pack'),
    freeShipping: true,
    leadDays: null,
    badges: ['bestseller'],
    categoryPath: ['Digital', 'Graphics', 'Icons'],
    attributes: { format: 'svg', dpi: '300' },
  },
  {
    slug: 'carp-tee',
    title: 'Carp Tee, folk carp motif screen-printed on organic cotton, boxy fit',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'pod',
    priceCents: 2900,
    compareAtCents: null,
    rating: 4.6,
    reviewCount: 48,
    soldCount: 260,
    image: demoPhoto('carp-tee'),
    freeShipping: false,
    leadDays: [5, 9],
    badges: [],
    categoryPath: ['Clothing', 'Tops', 'T-shirts'],
    attributes: { material: 'organic-cotton', colour: 'indigo', size: 'm', gsm: '190' },
  },
  {
    slug: 'carp-poster',
    title: 'Carp poster, giclée print on 250 gsm matte paper, ready to frame',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'stock',
    priceCents: 1800,
    compareAtCents: 2400,
    rating: 4.7,
    reviewCount: 96,
    soldCount: 610,
    image: demoPhoto('carp-poster'),
    freeShipping: false,
    leadDays: [2, 4],
    badges: ['low-stock'],
    categoryPath: ['Art', 'Prints', 'Posters'],
    attributes: { size: 'a3', frame: 'none' },
  },
  {
    slug: 'botanical-brush-set',
    title: 'Botanical brush set for Procreate — 42 brushes, print-resolution stamps',
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    kind: 'file',
    priceCents: 1490,
    compareAtCents: null,
    rating: 4.9,
    reviewCount: 340,
    soldCount: 2100,
    image: demoPhoto('botanical-brush-set'),
    freeShipping: true,
    leadDays: null,
    badges: ['star-seller'],
    categoryPath: ['Digital', 'Graphics', 'Brushes'],
    attributes: { format: 'brushset', dpi: '300' },
  },
  {
    slug: 'lotus-tote',
    title: 'Lotus tote bag, 12 oz natural canvas, reinforced handles, printed to order',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'pod',
    priceCents: 2200,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 77,
    soldCount: 520,
    image: demoPhoto('lotus-tote'),
    freeShipping: true,
    leadDays: [6, 12],
    badges: [],
    categoryPath: ['Bags', 'Totes'],
    attributes: { colour: 'natural', handle: 'long', material: 'canvas' },
  },
  {
    slug: 'carp-mug',
    title: 'Carp enamel mug, 350 ml, dishwasher safe, ships from stock',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'stock',
    priceCents: 1600,
    compareAtCents: null,
    rating: 4.5,
    reviewCount: 130,
    soldCount: 980,
    image: demoPhoto('carp-mug'),
    freeShipping: false,
    leadDays: [2, 3],
    badges: [],
    categoryPath: ['Home', 'Kitchen', 'Mugs'],
    attributes: { volume: '350', glaze: 'white', material: 'enamel' },
  },
  {
    slug: 'seal-script-fonts',
    title: 'Seal script display font — 3 weights, full Vietnamese diacritics, OTF and WOFF2',
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    kind: 'file',
    priceCents: 3900,
    compareAtCents: 5900,
    rating: 4.8,
    reviewCount: 58,
    soldCount: 340,
    image: demoPhoto('seal-script-fonts'),
    freeShipping: true,
    leadDays: null,
    badges: [],
    categoryPath: ['Digital', 'Fonts'],
    attributes: { format: 'otf' },
  },
  {
    slug: 'lotus-hoodie',
    title: 'Lotus hoodie, brushed fleece inside, embroidered chest motif, unisex',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'pod',
    priceCents: 5400,
    compareAtCents: 6200,
    rating: 4.9,
    reviewCount: 41,
    soldCount: 190,
    image: demoPhoto('lotus-hoodie'),
    freeShipping: true,
    leadDays: [8, 14],
    badges: ['star-seller'],
    categoryPath: ['Clothing', 'Tops', 'Hoodies'],
    attributes: { material: 'cotton-blend', colour: 'black', size: 'l' },
  },
  {
    slug: 'carp-sticker-sheet',
    title: 'Carp sticker sheet, die-cut vinyl, weatherproof, 12 stickers',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'stock',
    priceCents: 700,
    compareAtCents: null,
    rating: 4.4,
    reviewCount: 205,
    soldCount: 2400,
    image: demoPhoto('carp-sticker-sheet'),
    freeShipping: false,
    leadDays: [2, 4],
    badges: ['bestseller'],
    categoryPath: ['Paper', 'Stickers'],
    attributes: { sheet: 'a6', material: 'vinyl' },
  },
  {
    slug: 'lotus-pattern-pack',
    title: 'Seamless lotus pattern pack — 18 tiles at 300 DPI, POD-ready',
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    kind: 'file',
    priceCents: 2400,
    compareAtCents: null,
    rating: 4.9,
    reviewCount: 88,
    soldCount: 700,
    image: demoPhoto('lotus-pattern-pack'),
    freeShipping: true,
    leadDays: null,
    badges: [],
    categoryPath: ['Digital', 'Graphics', 'Patterns'],
    attributes: { format: 'png', dpi: '300' },
  },

  /* Mỗi danh mục lá cần ÍT NHẤT hai sản phẩm khác giá trị thuộc tính, nếu
     không `facetsFor` sẽ tự bỏ bộ lọc đi — một bộ lọc chỉ có một lựa chọn là
     bộ lọc vô dụng. Sáu listing dưới đây tồn tại để mỗi lá có đủ dữ liệu cho
     rail lọc động, đúng như một danh mục thật sẽ có. */
  {
    slug: 'carp-mug-speckled',
    title: 'Carp mug in speckled glaze, 450 ml, thrown-look stoneware finish',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'stock',
    priceCents: 2100,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 64,
    soldCount: 410,
    image: demoPhoto('carp-mug-speckled'),
    freeShipping: false,
    leadDays: [2, 3],
    badges: [],
    categoryPath: ['Home', 'Kitchen', 'Mugs'],
    attributes: { volume: '450', glaze: 'speckled', material: 'stoneware' },
  },
  {
    slug: 'lotus-poster',
    title: 'Lotus study poster, A4 giclée print, optional oak frame',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'stock',
    priceCents: 2000,
    compareAtCents: null,
    rating: 4.8,
    reviewCount: 52,
    soldCount: 300,
    image: demoPhoto('lotus-poster'),
    freeShipping: false,
    leadDays: [2, 4],
    badges: [],
    categoryPath: ['Art', 'Prints', 'Posters'],
    attributes: { size: 'a4', frame: 'oak' },
  },
  {
    slug: 'carp-tote',
    title: 'Carp tote bag, black canvas, short handles, printed to order',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'pod',
    priceCents: 2400,
    compareAtCents: null,
    rating: 4.5,
    reviewCount: 33,
    soldCount: 180,
    image: demoPhoto('carp-tote'),
    freeShipping: false,
    leadDays: [5, 9],
    badges: [],
    categoryPath: ['Bags', 'Totes'],
    attributes: { colour: 'black', handle: 'short', material: 'canvas' },
  },
  {
    slug: 'lotus-sticker-sheet',
    title: 'Lotus sticker sheet, A5, 24 die-cut matte vinyl stickers',
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    kind: 'stock',
    priceCents: 1100,
    compareAtCents: null,
    rating: 4.6,
    reviewCount: 118,
    soldCount: 1300,
    image: demoPhoto('lotus-sticker-sheet'),
    freeShipping: false,
    leadDays: [2, 4],
    badges: [],
    categoryPath: ['Paper', 'Stickers'],
    attributes: { sheet: 'a5', material: 'vinyl' },
  },
  {
    slug: 'carp-hoodie',
    title: 'Carp hoodie, ocean blue, screen-printed back panel',
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    kind: 'pod',
    priceCents: 5200,
    compareAtCents: null,
    rating: 4.4,
    reviewCount: 22,
    soldCount: 90,
    image: demoPhoto('carp-hoodie'),
    freeShipping: true,
    leadDays: [8, 14],
    badges: [],
    categoryPath: ['Clothing', 'Tops', 'Hoodies'],
    attributes: { material: 'organic-cotton', colour: 'ocean', size: 'm' },
  },
  {
    slug: 'botanical-serif-font',
    title: 'Botanical serif — text face with full Vietnamese diacritics',
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    kind: 'file',
    priceCents: 2900,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 40,
    soldCount: 260,
    image: demoPhoto('botanical-serif-font'),
    freeShipping: true,
    leadDays: null,
    badges: [],
    categoryPath: ['Digital', 'Fonts', 'Serif'],
    attributes: { format: 'woff2' },
  },

  /* ── Rich Sample Additions ───────────────────────────── */
  {
    slug: 'cyberpunk-neon-hoodie',
    title: 'Cyberpunk Neon Streetwear Hoodie — heavyweight 400 GSM fleece, glow-in-the-dark print',
    shopSlug: 'cyber-crafts',
    shopName: 'Cyber Crafts Studio',
    kind: 'pod',
    priceCents: 6500,
    compareAtCents: 8500,
    rating: 4.95,
    reviewCount: 420,
    soldCount: 2800,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    freeShipping: true,
    leadDays: [3, 7],
    badges: ['bestseller', 'star-seller'],
    categoryPath: ['Clothing & Apparel', 'Tops & Shirts', 'Hoodies'],
    attributes: { material: 'cotton-blend', colour: 'black', size: 'xl' },
  },
  {
    slug: 'dragon-canvas-art',
    title: 'Gold Golden Dragon Wall Canvas Print — 3D metallic texture effect, museum archival ink',
    shopSlug: 'cyber-crafts',
    shopName: 'Cyber Crafts Studio',
    kind: 'pod',
    priceCents: 8900,
    compareAtCents: 12000,
    rating: 4.9,
    reviewCount: 180,
    soldCount: 950,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
    freeShipping: true,
    leadDays: [4, 8],
    badges: ['bestseller'],
    categoryPath: ['Art & Wall Decor', 'Wall Prints', 'Canvas Art Prints'],
    attributes: { size: 'a2', frame: 'black' },
  },
  {
    slug: 'minimalist-3d-ui-kit',
    title: 'Cyber-Lux 3D UI & Icon Kit — 150 Blender assets, GLTF, OBJ & Figma components',
    shopSlug: 'nexus-digital',
    shopName: 'Nexus Digital Labs',
    kind: 'file',
    priceCents: 3900,
    compareAtCents: 5900,
    rating: 5.0,
    reviewCount: 310,
    soldCount: 4500,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    freeShipping: true,
    leadDays: null,
    badges: ['bestseller', 'star-seller'],
    categoryPath: ['Digital Assets & Media', 'Graphics & Vectors', '3D Models & Assets'],
    attributes: { format: 'gltf', resolution: '4k' },
  },
  {
    slug: 'vintage-leather-sleeve',
    title: 'Genuine Full-Grain Leather Laptop Sleeve — water-resistant felt lining, magnetic clasp',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 4500,
    compareAtCents: 5500,
    rating: 4.85,
    reviewCount: 195,
    soldCount: 1200,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    freeShipping: true,
    leadDays: [2, 4],
    badges: ['star-seller'],
    categoryPath: ['Tech & Accessories', 'Gadgets & Cases', 'Laptop Sleeves'],
    attributes: { material: 'leather', colour: 'brown' },
  },
  {
    slug: 'cyber-matte-phone-case',
    title: 'Cyber Tough Matte Armor Phone Case — military grade drop protection, MagSafe ready',
    shopSlug: 'cyber-crafts',
    shopName: 'Cyber Crafts Studio',
    kind: 'pod',
    priceCents: 2400,
    compareAtCents: 3400,
    rating: 4.88,
    reviewCount: 650,
    soldCount: 3900,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    freeShipping: true,
    leadDays: [2, 5],
    badges: ['bestseller'],
    categoryPath: ['Tech & Accessories', 'Gadgets & Cases', 'Phone Cases'],
    attributes: { material: 'polycarbonate', colour: 'black' },
  },
  {
    slug: 'insulated-tumbler-black',
    title: 'Insulated Stainless Steel Tumbler 750ml — 24hr cold retention, leakproof lid',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 3200,
    compareAtCents: null,
    rating: 4.8,
    reviewCount: 290,
    soldCount: 1850,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    freeShipping: true,
    leadDays: [2, 4],
    badges: [],
    categoryPath: ['Home & Living', 'Kitchen & Drinkware', 'Insulated Tumblers'],
    attributes: { volume: '750', material: 'stainless-steel' },
  },
  {
    slug: 'scented-soy-candle',
    title: 'Handpoured Cedar & Amber Soy Wax Candle — 50hr burn time, wooden crackling wick',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 2800,
    compareAtCents: null,
    rating: 4.9,
    reviewCount: 410,
    soldCount: 2300,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    freeShipping: false,
    leadDays: [2, 4],
    badges: ['bestseller'],
    categoryPath: ['Home & Living', 'Home Decor', 'Scented Soy Candles'],
    attributes: { scent: 'cedarwood', weight: '300g' },
  },
  {
    slug: 'marble-coaster-set',
    title: 'Artisan Hexagon Marble Coasters — set of 4 with brass inlay trim',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 3400,
    compareAtCents: 4200,
    rating: 4.75,
    reviewCount: 85,
    soldCount: 620,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80',
    freeShipping: true,
    leadDays: [3, 5],
    badges: [],
    categoryPath: ['Home & Living', 'Kitchen & Drinkware', 'Artisan Coasters'],
    attributes: { material: 'marble', pieces: '4' },
  },
  {
    slug: 'retro-synthwave-sound-pack',
    title: 'Retro Synthwave Audio Sample Vault — 500 WAV loops, 100 Serum presets',
    shopSlug: 'nexus-digital',
    shopName: 'Nexus Digital Labs',
    kind: 'file',
    priceCents: 2900,
    compareAtCents: 4900,
    rating: 4.92,
    reviewCount: 175,
    soldCount: 1600,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    freeShipping: true,
    leadDays: null,
    badges: ['star-seller'],
    categoryPath: ['Digital Assets & Media', 'Audio & Video', 'Sound Packs'],
    attributes: { format: 'wav', bpm: '120-140' },
  },
  {
    slug: 'gold-lotus-pendant',
    title: '18K Gold Plated Lotus Flower Pendant Necklace — tarnish-free stainless steel chain',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 4200,
    compareAtCents: 5800,
    rating: 4.88,
    reviewCount: 220,
    soldCount: 1400,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    freeShipping: true,
    leadDays: [2, 4],
    badges: ['bestseller'],
    categoryPath: ['Tech & Accessories', 'Crafted Jewelry', 'Pendants & Necklaces'],
    attributes: { material: 'gold-plated', length: '45cm' },
  },
  {
    slug: 'braided-leather-bracelet',
    title: 'Handcrafted Braided Leather Bracelet — magnetic stainless steel clasp',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 2600,
    compareAtCents: null,
    rating: 4.7,
    reviewCount: 140,
    soldCount: 890,
    image: 'https://images.unsplash.com/photo-1611591475179-42cd34265f9b?w=600&q=80',
    freeShipping: false,
    leadDays: [2, 4],
    badges: [],
    categoryPath: ['Tech & Accessories', 'Crafted Jewelry', 'Handmade Bracelets'],
    attributes: { material: 'leather', colour: 'black' },
  },
  {
    slug: 'custom-backpack-black',
    title: 'Cyber Urban Roll-Top Backpack — waterproof 900D Oxford cloth, 15.6 inch padded laptop pocket',
    shopSlug: 'cyber-crafts',
    shopName: 'Cyber Crafts Studio',
    kind: 'pod',
    priceCents: 7500,
    compareAtCents: 9800,
    rating: 4.9,
    reviewCount: 310,
    soldCount: 1750,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    freeShipping: true,
    leadDays: [4, 9],
    badges: ['bestseller', 'star-seller'],
    categoryPath: ['Bags & Carriers', 'Custom Backpacks'],
    attributes: { capacity: '25L', material: 'oxford' },
  },
  {
    slug: 'luxury-throw-pillow',
    title: 'Velvet Geometric Patterned Cushion Pillow — 45x45 cm with plush duck feather insert',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 3800,
    compareAtCents: null,
    rating: 4.8,
    reviewCount: 92,
    soldCount: 540,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    freeShipping: true,
    leadDays: [3, 5],
    badges: [],
    categoryPath: ['Home & Living', 'Home Decor', 'Throw Pillows'],
    attributes: { size: '45x45', material: 'velvet' },
  },
  {
    slug: 'cyberpunk-vinyl-stickers',
    title: 'Cyberpunk Neon Holographic Sticker Pack — 50 waterproof vinyl decals',
    shopSlug: 'cyber-crafts',
    shopName: 'Cyber Crafts Studio',
    kind: 'stock',
    priceCents: 1200,
    compareAtCents: 1800,
    rating: 4.95,
    reviewCount: 820,
    soldCount: 5400,
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&q=80',
    freeShipping: true,
    leadDays: [1, 3],
    badges: ['bestseller'],
    categoryPath: ['Paper & Stationery', 'Vinyl Stickers'],
    attributes: { sheet: '50-pack', finish: 'holographic' },
  },
  {
    slug: 'minimalist-hardcover-journal',
    title: 'Hardcover Linen Dotted Bullet Journal — 160 GSM bleedproof bamboo paper',
    shopSlug: 'artisan-home',
    shopName: 'Artisan Home Goods',
    kind: 'stock',
    priceCents: 2200,
    compareAtCents: null,
    rating: 4.85,
    reviewCount: 340,
    soldCount: 2100,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    freeShipping: false,
    leadDays: [2, 4],
    badges: [],
    categoryPath: ['Paper & Stationery', 'Custom Journals'],
    attributes: { pages: '192', paper: '160gsm' },
  },
];

function generateHugeCatalog(base: Listing[]): Listing[] {
  const categories = [
    ['Jewelry & Personal Ornaments', 'Necklaces & Pendants', 'Gold Pendants'],
    ['Jewelry & Personal Ornaments', 'Necklaces & Pendants', 'Layered Chokers'],
    ['Jewelry & Personal Ornaments', 'Rings & Bands', 'Artisan Rings'],
    ['Jewelry & Personal Ornaments', 'Earrings & Studs', 'Drop Earrings'],
    ['Art & Collectibles', 'Wall Prints', 'Fine Art Posters'],
    ['Art & Collectibles', 'Wall Prints', 'Canvas Art Prints'],
    ['Art & Collectibles', 'Wall Prints', 'Abstract Art'],
    ['Art & Collectibles', 'Sculptures & Ceramics', 'Pottery Vases'],
    ['Home & Living', 'Home Decor', 'Throw Pillows'],
    ['Home & Living', 'Home Decor', 'Scented Soy Candles'],
    ['Home & Living', 'Home Decor', 'Custom Clocks'],
    ['Home & Living', 'Kitchen & Drinkware', 'Ceramic & Enamel Mugs'],
    ['Home & Living', 'Kitchen & Drinkware', 'Insulated Tumblers'],
    ['Home & Living', 'Furniture & Rugs', 'Area Rugs'],
    ['Clothing & Apparel', 'Tops & Shirts', 'T-shirts'],
    ['Clothing & Apparel', 'Tops & Shirts', 'Hoodies'],
    ['Clothing & Apparel', 'Tops & Shirts', 'Sweatshirts'],
    ['Clothing & Apparel', 'Pants & Bottoms', 'Joggers'],
    ['Clothing & Apparel', 'Pants & Bottoms', 'Denim Jeans'],
    ['Paper & Party Supplies', 'Stationery & Journals', 'Custom Journals'],
    ['Paper & Party Supplies', 'Stationery & Journals', 'Vinyl Stickers'],
    ['Paper & Party Supplies', 'Greeting Cards & Party', 'Artisan Cards'],
    ['Craft Supplies & Tools', 'Yarn & Fabrics'],
    ['Craft Supplies & Tools', 'Stamps & Ink'],
    ['Tech & Accessories', 'Gadgets & Cases', 'Phone Cases'],
    ['Tech & Accessories', 'Gadgets & Cases', 'Laptop Sleeves'],
    ['Tech & Accessories', 'Hats & Headwear', 'Knit Beanies'],
    ['Tech & Accessories', 'Sunglasses & Glasses', 'Polarized Shades'],
    ['Weddings & Celebrations', 'Wedding Decor'],
    ['Weddings & Celebrations', 'Bridal Party Gifts'],
    ['Bags & Carriers', 'Canvas Totes'],
    ['Bags & Carriers', 'Custom Backpacks'],
    ['Bags & Carriers', 'Accessory Pouches'],
    ['Digital Assets & Media', 'Graphics & Vectors', 'Icons & Symbols'],
    ['Digital Assets & Media', 'Graphics & Vectors', '3D Models & Assets'],
    ['Digital Assets & Media', 'Graphics & Vectors', 'UI Kits & Templates'],
    ['Digital Assets & Media', 'Audio & Video', 'Sound Packs'],
    ['Digital Assets & Media', 'Typography & Fonts', 'Serif Fonts'],
    ['Kids & Baby', 'Baby Onesies & Clothes'],
    ['Kids & Baby', 'Nursery Wall Decor'],
    ['Bath & Beauty', 'Handmade Soaps'],
    ['Bath & Beauty', 'Essential Oils'],
    ['Pet Supplies', 'Pet Bandanas & Sweaters'],
    ['Pet Supplies', 'Custom Pet Tags'],
    ['Toys & Games', 'Jigsaw Puzzles'],
    ['Toys & Games', 'Custom Plush Toys'],
  ];

  const shops = SHOPS;
  const images = [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&q=80',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1611591475179-42cd34265f9b?w=600&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
    'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
  ];

  const titlePrefixes = [
    'Handcrafted', 'Minimalist', 'Custom Printed', 'Artisan', 'Vintage Style',
    'Custom Embroidered', 'Organic Cotton', 'Architectural', 'Botanical',
    'Hand-Drawn', 'Modern Minimal', 'Collector Edition'
  ];

  const titleSuffixes = [
    'Design', 'Edition', 'Craft Series', 'Studio Collection', 'Art Print',
    'POD Creation', 'Essentials', 'Series V'
  ];

  const generated: Listing[] = [];

  for (let i = 1; i <= 140; i++) {
    const cat = categories[i % categories.length]!;
    const shop = shops[i % shops.length]!;
    const prefix = titlePrefixes[i % titlePrefixes.length]!;
    const suffix = titleSuffixes[i % titleSuffixes.length]!;
    const leafCat = cat[cat.length - 1]!;
    const kind: FulfilmentKind = cat[0] === 'Digital Assets & Media' ? 'file' : i % 3 === 0 ? 'stock' : 'pod';

    generated.push({
      slug: `ccm-item-${i}`,
      title: `${prefix} ${leafCat} — ${suffix}`,
      shopSlug: shop.slug,
      shopName: shop.name,
      kind,
      priceCents: (18 + ((i * 11) % 90)) * 100,
      compareAtCents: i % 2 === 0 ? (28 + ((i * 13) % 120)) * 100 : null,
      rating: 4.6 + (i % 5) * 0.1,
      reviewCount: 45 + (i * 29) % 520,
      soldCount: 210 + (i * 83) % 4100,
      image: demoPhoto(`ccm-item-${i}`),
      freeShipping: i % 2 === 0,
      leadDays: kind === 'file' ? null : [2 + (i % 3), 5 + (i % 5)],
      badges: i % 3 === 0 ? ['bestseller'] : i % 4 === 0 ? ['star-seller'] : [],
      categoryPath: cat,
      attributes: { material: 'cotton-blend', colour: 'obsidian' },
    });
  }

  return [...base, ...generated];
}

export const LISTINGS: Listing[] = generateHugeCatalog(BASE_LISTINGS);

/* ── Bộ lọc mặt ──────────────────────────────────────────────
   Chữ hiển thị KHÔNG dùng từ "POD". Buyer không cần biết hàng in ở đâu,
   họ cần biết bao giờ nhận — nên nhãn là "Delivered to you" / "Instant
   download". Xem ui-design.md §B2.                                      */

export const KIND_FACET: { value: FulfilmentKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All items' },
  { value: 'stock', label: 'Ships in 2–4 days' },
  { value: 'pod', label: 'Made for you' },
  { value: 'file', label: 'Instant download' },
];

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export const SORTS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'rating', label: 'Top reviewed' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
];

export type Query = {
  q?: string;
  kind?: FulfilmentKind | 'all';
  shop?: string;
  category?: string[];
  minRating?: number;
  minPriceCents?: number;
  maxPriceCents?: number;
  freeShipping?: boolean;
  /** Chỉ hàng đang giảm giá — có `compareAtCents` cao hơn giá bán */
  onSale?: boolean;
  sort?: SortKey;
  /**
   * Bộ lọc thuộc tính động: `{ colour: ['black','ocean'], size: ['m'] }`.
   *
   * Trong MỘT thuộc tính là HOẶC (đen hoặc xanh), giữa các thuộc tính là VÀ
   * (đen và size M). Đây là quy ước người dùng đã quen ở mọi sàn — tích thêm
   * một màu là mở rộng kết quả, tích thêm một size là thu hẹp.
   */
  attrs?: Record<string, string[]>;
};

/**
 * Đọc `searchParams` của Next thành `Query`.
 *
 * Để ở đây chứ không ở từng trang: ba trang duyệt (tìm kiếm, danh mục, shop)
 * đọc cùng một bộ tham số, và ba bản sao logic parse là ba cơ hội để chúng
 * lệch nhau — thường lệch ở đúng tham số ít dùng nhất, nên không ai phát hiện.
 */
export function readQuery(sp: Record<string, string | string[] | undefined>): Query {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const attrs: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (!k.startsWith('a_')) continue;
    const values = (one(v) ?? '').split(',').filter(Boolean);
    if (values.length) attrs[k.slice(2)] = values;
  }

  /* `?cat=clothing/tops/t-shirts` — dùng ở trang shop, nơi danh mục KHÔNG nằm
     trong đường dẫn. Trang `/c/[...slug]` lấy danh mục từ chính route và ghi
     đè giá trị này, nên hai chỗ không bao giờ tranh nhau. */
  const cat = one(sp.cat);

  return {
    q: one(sp.q),
    kind: one(sp.kind) as FulfilmentKind | undefined,
    category: cat ? cat.split('/').filter(Boolean) : undefined,
    sort: one(sp.sort) as SortKey | undefined,
    minRating: sp.rating ? Number(one(sp.rating)) : undefined,
    minPriceCents: sp.min ? Number(one(sp.min)) : undefined,
    maxPriceCents: sp.max ? Number(one(sp.max)) : undefined,
    freeShipping: one(sp.free) === '1',
    onSale: one(sp.sale) === '1',
    attrs,
  };
}

/**
 * Lọc và sắp xếp tại chỗ. Ở bản thật đây là một lượt gọi Elasticsearch qua
 * `backend-api` — frontend KHÔNG được nói chuyện thẳng với Elasticsearch, xem
 * ranh giới ở stack-decision.md §6.3.
 */
export async function searchListings(query: Query): Promise<Listing[]> {
  const q = query.q?.trim().toLowerCase();
  let out = LISTINGS.filter((l) => {
    if (q && !`${l.title} ${l.shopName} ${l.categoryPath.join(' ')}`.toLowerCase().includes(q))
      return false;
    if (query.kind && query.kind !== 'all' && l.kind !== query.kind) return false;
    if (query.shop && l.shopSlug !== query.shop) return false;
    if (query.category?.length) {
      const path = l.categoryPath.map((c) => c.toLowerCase());
      if (!query.category.every((c, i) => path[i] === c.toLowerCase())) return false;
    }
    if (query.minRating && l.rating < query.minRating) return false;
    if (query.minPriceCents && l.priceCents < query.minPriceCents) return false;
    if (query.maxPriceCents && l.priceCents > query.maxPriceCents) return false;
    if (query.freeShipping && !l.freeShipping) return false;
    if (query.onSale && !(l.compareAtCents && l.compareAtCents > l.priceCents)) return false;
    for (const [code, values] of Object.entries(query.attrs ?? {})) {
      if (!values.length) continue;
      const own = l.attributes[code];
      if (!own || !values.includes(own)) return false;
    }
    return true;
  });

  const sort = query.sort ?? 'relevance';
  out = [...out].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.priceCents - b.priceCents;
      case 'price-desc':
        return b.priceCents - a.priceCents;
      case 'rating':
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case 'newest':
        return a.slug.localeCompare(b.slug);
      default:
        // "Liên quan nhất" tạm tính bằng lượng bán — ở bản thật là điểm của
        // Elasticsearch. Đừng để mặc định là giá thấp nhất: sàn sẽ biến thành
        // nơi so giá và seller làm tốt luôn thua seller rẻ nhất.
        return b.soldCount - a.soldCount;
    }
  });

  return out;
}

export async function getShop(slug: string): Promise<Shop | null> {
  return SHOPS.find((s) => s.slug === slug) ?? null;
}

/* ── Bộ lọc thuộc tính động ────────────────────────────────
   Ba quy tắc từ product-attributes.md §6, và cả ba đều là quy tắc chống lại
   một lỗi cụ thể đã thấy ở nhiều sàn:

   1. Chỉ hiện thuộc tính có ≥ 2 giá trị KHÁC NHAU trong kết quả hiện tại.
      Bộ lọc chỉ có một lựa chọn là bộ lọc vô dụng, và nó vẫn chiếm chỗ.
   2. Hiện SỐ ĐẾM bên cạnh mỗi giá trị. Không có số, buyer bấm vào rồi thấy
      trống và mất niềm tin vào cả rail lọc.
   3. Giá trị không còn kết quả thì LÀM MỜ, không ẩn đi. Ẩn làm danh sách nhảy
      loạn mỗi lần tích, và buyer tưởng mình nhớ nhầm.                       */

export type Facet = {
  code: string;
  label: string;
  inputType: 'SELECT' | 'SWATCH';
  options: { value: string; label: string; swatch?: string; count: number }[];
};

/**
 * Sinh bộ lọc cho một nhánh danh mục.
 *
 * `base` là tập kết quả TRƯỚC khi áp bộ lọc thuộc tính — số đếm phải tính trên
 * tập đó, nếu không thì tích một giá trị xong mọi giá trị khác về 0 và buyer
 * không mở rộng lựa chọn được nữa.
 *
 * Ở bản thật đây là facet aggregation của Elasticsearch, không đếm bằng SQL.
 */
export function facetsFor(path: string[] | undefined, base: Listing[]): Facet[] {
  if (!path?.length) return [];

  return filterableFor(path)
    .map((def) => {
      const options = (def.options ?? [])
        .map((o) => ({
          value: o.value,
          label: o.label,
          swatch: o.swatch,
          count: base.filter((l) => l.attributes[def.code] === o.value).length,
        }))
        // Giá trị không sản phẩm nào có thì bỏ hẳn — khác với giá trị có sản
        // phẩm nhưng bị bộ lọc khác loại ra, cái đó vẫn hiện và làm mờ.
        .filter((o) => o.count > 0);

      return {
        code: def.code,
        label: def.label,
        inputType: def.inputType === 'SWATCH' ? ('SWATCH' as const) : ('SELECT' as const),
        options,
      };
    })
    .filter((f) => f.options.length >= 2);
}

/* ── Thẻ danh mục cho mega-menu ────────────────────────────
   Menu hiện ẢNH chứ không chỉ chữ. Ảnh đại diện lấy từ sản phẩm bán chạy nhất
   của chính danh mục đó, không phải một tệp ảnh do ai đó chọn tay: danh mục
   trống thì không có thẻ, và danh mục đổi mặt hàng thì ảnh tự đổi theo.        */

export type CategoryTile = { slug: string; label: string; href: string; image: string };

const FALLBACK_CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
  'https://images.unsplash.com/photo-1608248597263-0057e57b4524?w=600&q=80',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
  'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
];

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Ảnh đại diện của một nhánh = ảnh của sản phẩm bán chạy nhất trong nhánh đó. */
function tileFor(path: string[], label: string): CategoryTile {
  const key = path.map((s) => s.toLowerCase()).join('/');
  const inBranch = LISTINGS.filter((l) =>
    l.categoryPath
      .map((s) => s.toLowerCase().replace(/\s+/g, '-'))
      .join('/')
      .startsWith(key),
  ).sort((a, b) => b.soldCount - a.soldCount);

  const top = inBranch[0];
  const image = top
    ? top.image
    : FALLBACK_CATEGORY_IMAGES[hashStr(key) % FALLBACK_CATEGORY_IMAGES.length]!;

  return { slug: path[path.length - 1]!, label, href: `/c/${key}`, image };
}

/**
 * Thẻ danh mục con hiện ở đầu trang danh mục.
 *
 * Nhánh cha thì hiện các nhánh con của nó. Nhánh LÁ thì hiện các lá anh em —
 * lá không có gì bên dưới, và người đang xem "Áo thun" mà thấy một dải trống
 * sẽ nghĩ trang bị lỗi. Anh em là lối đi tiếp gần nhất còn lại.
 */
export function categoryChildTiles(path: string[]): CategoryTile[] {
  let level: CategoryNode[] = CATEGORY_TREE;
  const trail: CategoryNode[] = [];

  for (const slug of path) {
    const found = level.find((n) => n.slug === slug);
    if (!found) return [];
    trail.push(found);
    level = found.children ?? [];
  }

  const node = trail[trail.length - 1]!;
  const parentPath = path.slice(0, -1);

  const [siblings, base] = node.children?.length
    ? [node.children, path]
    : [
      (trail.length > 1
        ? (trail[trail.length - 2]!.children ?? [])
        : CATEGORY_TREE
      ).filter((n) => n.slug !== node.slug),
      parentPath,
    ];

  return siblings
    .map((child) => tileFor([...base, child.slug], child.label))
    .filter((t): t is CategoryTile => t !== null);
}

/* ── Cây cho mega-menu ─────────────────────────────────────
   Menu chỉ dùng hai tầng đầu:

     cột 1  nhánh gốc   Clothing · Digital · Art …
     cột 2  nhánh con   Tops  →  bấm là ra thẳng danh sách hàng

   Cây vẫn sinh đủ chiều sâu vì `menuTree` cũng là chỗ duy nhất biết nhánh nào
   CÓ HÀNG — một nhánh cha chỉ hợp lệ khi ít nhất một lá dưới nó còn hàng.     */

export type MenuNode = {
  slug: string;
  label: string;
  href: string;
  /** Ảnh của món bán chạy nhất trong nhánh — thẻ danh mục con trong menu */
  image: string;
  children: MenuNode[];
};

function toMenuNode(node: CategoryNode, trail: string[]): MenuNode | null {
  const path = [...trail, node.slug];
  const tile = tileFor(path, node.label);
  // Nhánh không có hàng thì không vào menu. Dẫn người dùng tới một trang trống
  // là cách nhanh nhất để họ ngừng tin cả cái menu.
  if (!tile) return null;

  return {
    slug: node.slug,
    label: node.label,
    href: tile.href,
    image: tile.image,
    children: (node.children ?? [])
      .map((child) => toMenuNode(child, path))
      .filter((n): n is MenuNode => n !== null),
  };
}

export function menuTree(): MenuNode[] {
  return CATEGORY_TREE.map((root) => toMenuNode(root, [])).filter(
    (n): n is MenuNode => n !== null,
  );
}

/**
 * Danh mục CÓ THẬT trong một shop — nguồn của mục "Categories" ở rail trang shop.
 *
 * Sinh từ chính hàng của shop chứ không lấy cây danh mục toàn sàn: một shop bán
 * áo và túi thì rail chỉ nên có hai dòng đó. Liệt kê cả cây rồi để hai mươi
 * dòng đếm 0 là biến bộ lọc thành một danh sách những thứ shop này KHÔNG bán.
 *
 * Gom theo danh mục LÁ vì đó là mức seller thật sự gắn hàng vào (quy tắc bất
 * biến §10.1 của product-attributes.md), và cũng là mức người mua phân biệt
 * được — "Tops" thì mơ hồ, "T-shirts" thì không.
 */
export function shopCategories(listings: Listing[]) {
  const groups = new Map<string, { path: string[]; label: string; count: number }>();

  for (const listing of listings) {
    const path = listing.categoryPath.map((s) => s.toLowerCase().replace(/\s+/g, '-'));
    const key = path.join('/');
    const existing = groups.get(key);
    if (existing) existing.count++;
    else
      groups.set(key, {
        path,
        label: listing.categoryPath[listing.categoryPath.length - 1]!,
        count: 1,
      });
  }

  return [...groups.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * Hàng nổi bật cho trang chủ.
 *
 * ── Quy tắc: MỖI SHOP nhiều nhất một món, rồi mới lấp bằng bán chạy ──────
 *
 * Sắp thuần theo lượng bán thì ba shop lớn nhất chiếm hết dải, và trang chủ
 * của một cái chợ trông như trang chủ của ba cửa hàng. Trên sàn hai phía, dải
 * nổi bật cũng là tín hiệu cho người bán mới rằng sàn có chỗ cho họ — dồn hết
 * cho shop lớn là tự làm hỏng tín hiệu đó.
 *
 * Vòng một lấy món bán chạy nhất của TỪNG shop; nếu vẫn thiếu thì vòng hai lấp
 * bằng những món bán chạy còn lại.
 */
export function featuredListings(limit = 5): Listing[] {
  const bySales = [...LISTINGS].sort((a, b) => b.soldCount - a.soldCount);

  const seenShops = new Set<string>();
  const picked: Listing[] = [];

  for (const listing of bySales) {
    if (picked.length >= limit) break;
    if (seenShops.has(listing.shopSlug)) continue;
    seenShops.add(listing.shopSlug);
    picked.push(listing);
  }

  for (const listing of bySales) {
    if (picked.length >= limit) break;
    if (!picked.includes(listing)) picked.push(listing);
  }

  return picked;
}