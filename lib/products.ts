/**
 * Trang chi tiết sản phẩm.
 *
 * Ở dự án thật, file này là client sinh từ OpenAPI của backend-api:
 *
 *   const { data } = await api.GET('/v1/products/{slug}', { params: { path: { slug } } });
 *
 * Toàn bộ microservice chỉ nói chuyện qua backend-api, nên frontend có đúng một
 * cửa và đúng một client.
 *
 * ── Điểm quan trọng nhất của file này ────────────────────────────────────
 *
 * `axes` KHÔNG được viết tay cho từng sản phẩm. Nó được **sinh ra từ danh mục**
 * qua `axesFor(categoryPath)`. Áo thun hỏi màu và size; ly sứ hỏi dung tích và
 * màu men; file thiết kế hỏi giấy phép. Giao diện không đổi một dòng nào.
 *
 * Sản phẩm chỉ đóng góp phần mà danh mục không biết được:
 *   · tập giá trị nào đang MỞ BÁN (`offered`)
 *   · giá trị nào tạm HẾT HÀNG (`soldOut`)
 *   · giá trị của thuộc tính mô tả (`attrValues`)
 *
 * Đây chính là mô hình `category_attributes` ở document/01-kien-truc/product-attributes.md.
 */

import { LISTINGS, SHOPS, type Listing } from './catalog';
import { axesFor, descriptiveFor, type AttributeDef, type InputType } from './categories';
import { demoPhoto } from './utils';

export type FulfilmentKind = 'stock' | 'pod' | 'file';

/**
 * Một mục trong thư viện của sản phẩm — ẢNH hoặc VIDEO.
 *
 * Seller được phép đặt video làm mục đại diện (mục đầu tiên). Trên sàn POD đó
 * là thứ đáng giá: một đoạn mười giây quay mực đi lên vải trả lời câu hỏi
 * "in ra trông thế nào" tốt hơn năm tấm ảnh tĩnh.
 *
 * `poster` là bắt buộc với video và không có ý nghĩa với ảnh: nó là khung hình
 * đứng yên hiện trong lưới, trong dải ảnh nhỏ, và trong thẻ Open Graph. Video
 * không có poster thì ô trống cho tới khi tải xong — đúng vào lúc người dùng
 * đang quyết định có bấm vào hay không.
 */
export type ProductMedia = {
  id: string;
  type: 'image' | 'video';
  src: string;
  /** Chỉ video — khung hình tĩnh dùng khi chưa phát */
  poster?: string;
  alt: string;
  role: 'primary' | 'detail' | 'model' | 'chart';
  caption: string;
  width: number;
  height: number;
};

/**
 * Tên cũ, giữ lại cho khung phóng to (`image-overlay`, `image-viewer`).
 * Hai file đó CHỈ xử lý ảnh — phóng to một video là một bài toán khác hẳn, và
 * gallery không mở khung phóng to khi mục đang chọn là video.
 */
export type ProductImage = ProductMedia;

/**
 * Một TRỤC biến thể đã "chín" — nghĩa là đã ghép định nghĩa của danh mục với
 * dữ liệu riêng của sản phẩm. Giao diện chỉ đọc kiểu này, không đọc registry.
 */
export type VariationAxis = {
  id: string;
  label: string;
  required: boolean;
  /** Quyết định BuyBox vẽ ô tròn màu, nút chọn, hay thẻ radio có mô tả */
  inputType: InputType;
  hint?: string;
  options: {
    value: string;
    label: string;
    /** Chênh lệch so với giá gốc, tính bằng cent. Có thể âm. */
    deltaCents: number;
    available: boolean;
    swatch?: string;
  }[];
};

export type Review = {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  body: string;
  variant?: string;
  photo?: string;
};

export type Product = {
  slug: string;
  title: string;
  kind: FulfilmentKind;
  categoryPath: string[];

  /** cent nguyên. 2500 = $25.00 */
  priceCents: number;
  compareAtCents: number | null;
  shippingCents: number;
  /** Trang đang nằm trong bao nhiêu giỏ — số THẬT, không phải đồng hồ đếm ngược bịa */
  inCarts: number;

  /** Ngày server chốt để tính khoảng giao. KHÔNG lấy Date.now() ở client. */
  quotedFrom: string;
  leadTimeMinDays: number;
  leadTimeMaxDays: number;
  returnWindowDays: number;
  shipsFrom: string;
  deliverTo: string;

  rating: number;
  reviewCount: number;
  soldCount: number;
  /** Ngày lên sàn — hiện ở chân trang sản phẩm, cạnh số lượt yêu thích */
  listedAt: string;
  favourites: number;

  media: ProductMedia[];
  axes: VariationAxis[];
  personalization: {
    label: string;
    hint: string;
    maxChars: number;
    fontStyles?: string[];
    placements?: string[];
    allowFileUpload?: boolean;
  } | null;

  highlights: { icon: 'material' | 'made' | 'ship' | 'care'; text: string }[];
  description: string[];
  /** Thuộc tính MÔ TẢ — buyer chỉ đọc, sinh từ danh mục + giá trị của sản phẩm */
  attributes: { label: string; value: string }[];
  /** Chỉ hàng số */
  bundle: { contents: string[]; sizeLabel: string } | null;

  reviewBreakdown: { label: string; score: number }[];
  reviews: Review[];

  shop: {
    slug: string;
    name: string;
    owner: string;
    location: string;
    rating: number;
    reviewCount: number;
    sales: string;
    yearsActive: number;
    responseTime: string;
    /** Do hệ thống cấp từ điểm và tỉ lệ giao đúng hạn — seller không tự gắn */
    starSeller: boolean;
    badges: { title: string; body: string }[];
  };
};

/* ── Phần riêng của từng sản phẩm ──────────────────────────── */

type Detail = {
  media: {
    src: string;
    role: ProductMedia['role'];
    caption: string;
    alt: string;
    type?: ProductMedia['type'];
    poster?: string;
  }[];
  description: string[];
  highlights: Product['highlights'];
  /** Giá trị thuộc tính mô tả, khoá là `code` trong registry danh mục */
  attrValues: Record<string, string>;
  /** `"colour:sand"` — giá trị tạm hết hàng, vẫn hiện nhưng mờ đi */
  soldOut?: string[];
  /** Giới hạn tập giá trị mở bán. Thiếu khoá nào thì trục đó mở hết. */
  offered?: Record<string, string[]>;
  personalization?: Product['personalization'];
  bundle?: Product['bundle'];
  reviews?: Review[];
};

/**
 * `src` ở ba mảng dưới đây KHÔNG phải đường dẫn — nó là **khoá ảnh**.
 *
 * `buildProduct` ghép nó với slug sản phẩm rồi mới ra URL thật:
 * `demoPhoto('lotus-tee-model')`. Nhờ vậy mỗi sản phẩm có bộ ảnh riêng dù ba
 * mảng này dùng chung, và ảnh đầu tiên luôn trùng ảnh trên thẻ ở lưới.
 *
 * Khoá bắt đầu bằng `/` được hiểu là tệp tĩnh thật và giữ nguyên — hiện chỉ có
 * ảnh động vẽ tay của `lotus-tee`, thứ picsum không thay thế được.
 */
const TEE_IMAGES: Detail['media'] = [
  { src: 'front', role: 'primary', caption: 'Front view', alt: 'Front view of the printed tee' },
  { src: 'model', role: 'model', caption: 'Worn by a 5′11″ model in size L', alt: 'Tee worn by a model' },
  { src: 'back', role: 'primary', caption: 'Back view', alt: 'Back view of the printed tee' },
  { src: 'detail', role: 'detail', caption: 'Print close-up · zoom in to see the ink texture', alt: 'Close-up of the print' },
  { src: 'chart', role: 'chart', caption: 'Size chart · zoom in to read the measurements', alt: 'Size chart with flat measurements' },
];

const FILE_IMAGES: Detail['media'] = [
  { src: 'front', role: 'primary', caption: 'Preview · watermarked', alt: 'Watermarked preview of the files' },
  { src: 'chart', role: 'chart', caption: 'What is inside the pack', alt: 'Contents sheet' },
  { src: 'detail', role: 'detail', caption: 'Example use on a printed tee', alt: 'Example use' },
];

const FLAT_IMAGES: Detail['media'] = [
  { src: 'front', role: 'primary', caption: 'Product shot', alt: 'Product photograph' },
  { src: 'detail', role: 'detail', caption: 'Close-up of the print', alt: 'Close-up' },
  { src: 'model', role: 'model', caption: 'In a room for scale', alt: 'In context' },
];

const DETAILS: Record<string, Detail> = {
  'lotus-tee': {
    /* Sản phẩm này CÓ CLIP, và thứ tự dưới đây là quy ước cho mọi sản phẩm có
       clip: **ảnh tĩnh đứng đầu, clip đứng thứ hai.**

       Mục đầu là thứ mở sẵn khi vào trang, là ảnh trong lưới duyệt, và là ảnh
       trong thẻ chia sẻ. Cả ba chỗ đó đều cần một khung hình ĐỨNG YÊN: trang
       vừa mở mà đã có thứ chuyển động là cướp sự chú ý khỏi giá và tiêu đề, còn
       thẻ chia sẻ thì không mạng xã hội nào render được video.

       Clip đứng ngay sau, mang nhãn tam giác trong dải ảnh nhỏ để người dùng
       biết có gì để xem. `poster` của nó chính là ảnh đứng đầu — cùng một
       khung hình, nên chuyển giữa hai mục không thấy nhảy. */
    media: [
      {
        src: 'front',
        role: 'primary',
        caption: 'Front view',
        alt: 'Front view of the printed tee',
      },
      {
        // Giữ tệp tĩnh: đây là ảnh động vẽ tay, picsum chỉ có ảnh chụp.
        src: '/img/tee-motion.svg',
        type: 'video',
        poster: 'front',
        role: 'primary',
        caption: 'Studio clip · the print going on',
        alt: 'Short clip of the lotus print being applied to the tee',
      },
      ...TEE_IMAGES.slice(1),
    ],
    description: [
      'A lotus motif drawn by hand and printed one shirt at a time. Nothing sits in a warehouse — the shirt is made after you order it, which is why it takes a few days longer and why there is no leftover stock to discount.',
      'The ink is water-based and cures into the fabric rather than sitting on top of it, so the print stays soft and does not crack along fold lines.',
      'The cut is deliberately relaxed. If you want a regular fit, size down one step — the size chart in the last photo has the flat measurements.',
    ],
    highlights: [
      { icon: 'material', text: '100% combed ring-spun cotton, 180 g/m²' },
      { icon: 'made', text: 'Printed to order with DTG, water-based inks' },
      { icon: 'ship', text: 'Ships from Viet Nam with tracking' },
      { icon: 'care', text: 'Pre-shrunk, machine washable at 30 °C' },
    ],
    attrValues: {
      origin: 'Viet Nam',
      material: 'Cotton',
      gsm: '180',
      collar: 'Ribbed crew, tear-away label',
      sleeve: 'Short, set-in',
    },
    soldOut: ['colour:sand', 'size:2xl'],
    offered: { colour: ['black', 'white', 'ocean', 'sand'] },
    personalization: {
      label: 'Add a name or short line to the back collar',
      hint: 'Up to 24 characters. Leave blank for no personalisation.',
      maxChars: 24,
    },
    reviews: [
      {
        id: 'r1',
        author: 'Dana R.',
        initials: 'DR',
        rating: 5,
        date: 'Jul 12, 2026',
        body: 'The print is much sharper than I expected from a made-to-order shirt. Washed it twice, no cracking along the fold. Runs big — I normally wear L and the M fits me the way I wanted.',
        variant: 'Black · M',
        photo: demoPhoto('review-lotus-tee', 600),
      },
      {
        id: 'r2',
        author: 'Minh T.',
        initials: 'MT',
        rating: 5,
        date: 'Jul 03, 2026',
        body: 'Ordered on a Monday, arrived 9 days later with tracking the whole way. Seller answered a sizing question within the hour.',
        variant: 'Ocean blue · L',
      },
      {
        id: 'r3',
        author: 'Priya S.',
        initials: 'PS',
        rating: 4,
        date: 'Jun 28, 2026',
        body: 'Shirt is lovely and the ink feels soft. Took a little longer than the estimate said, but the shop told me up front that it is printed after ordering, so no surprise.',
        variant: 'White · S',
      },
    ],
  },

  'lotus-tee-cream': {
    media: TEE_IMAGES,
    description: [
      'The same hand-drawn lotus on a heavier cream jersey. The undyed base means the print sits slightly warmer than it does on white.',
      'Printed after you order, on a garment we keep blank until then. That is why the colour range is smaller here than on the black tee — we only stock blanks we can turn over.',
    ],
    highlights: [
      { icon: 'material', text: 'Heavyweight jersey, 220 g/m²' },
      { icon: 'made', text: 'Water-based DTG, cured into the fibre' },
      { icon: 'ship', text: 'Ships from Viet Nam with tracking' },
      { icon: 'care', text: 'Pre-shrunk, wash inside out' },
    ],
    attrValues: { origin: 'Viet Nam', material: 'Cotton', gsm: '220', collar: 'Ribbed crew', sleeve: 'Short, drop shoulder' },
    offered: { colour: ['cream', 'white'] },
  },

  'carp-tee': {
    media: TEE_IMAGES,
    description: [
      'A folk carp motif redrawn for a boxy modern cut, screen-printed rather than digitally printed — the ink layer is thicker and the colour holds longer.',
      'Screen printing needs a setup per colour, so this design runs in a limited palette on purpose.',
    ],
    highlights: [
      { icon: 'material', text: 'Organic cotton, 190 g/m²' },
      { icon: 'made', text: 'Screen-printed by hand in Da Nang' },
      { icon: 'ship', text: 'Ships from Viet Nam' },
      { icon: 'care', text: 'Wash cold, do not tumble dry' },
    ],
    attrValues: { origin: 'Viet Nam', material: 'Organic cotton', gsm: '190', collar: 'Crew', sleeve: 'Short, boxy' },
    offered: { colour: ['indigo', 'black', 'cream'] },
    soldOut: ['size:s'],
  },

  'lotus-hoodie': {
    media: TEE_IMAGES,
    description: [
      'Brushed fleece inside, a flat-lying rib at the cuffs, and an embroidered chest motif rather than a print — embroidery outlives any ink on a garment washed as often as a hoodie.',
      'Embroidery takes longer to set up than printing, so this one has the longest lead time in the shop.',
    ],
    highlights: [
      { icon: 'material', text: 'Cotton blend, brushed fleece lining, 320 g/m²' },
      { icon: 'made', text: 'Chest motif embroidered, not printed' },
      { icon: 'ship', text: 'Ships from Viet Nam with tracking' },
      { icon: 'care', text: 'Wash inside out at 30 °C' },
    ],
    attrValues: { origin: 'Viet Nam', material: 'Cotton blend', gsm: '320', lining: 'Brushed fleece' },
    offered: { colour: ['black', 'white', 'ocean'] },
  },

  'lotus-tote': {
    media: TEE_IMAGES,
    description: [
      'A 12 oz canvas tote with box-stitched handles at the stress points. Heavy enough to carry a laptop and a week of groceries without the seams pulling.',
      'The lotus is printed after you order, so the bag you get was blank a few days earlier.',
    ],
    highlights: [
      { icon: 'material', text: '12 oz natural cotton canvas' },
      { icon: 'made', text: 'Printed to order, box-stitched handles' },
      { icon: 'ship', text: 'Ships flat from Viet Nam' },
      { icon: 'care', text: 'Machine washable, air dry' },
    ],
    attrValues: { material: 'Canvas', capacity: '14' },
  },

  'carp-mug': {
    media: FLAT_IMAGES,
    description: [
      'Enamel over steel, with a rolled rim so it does not chip the way thin enamel does. The carp wraps the full circumference rather than sitting as a badge on one side.',
      'This one ships from stock, so it is the fastest thing in the shop to arrive.',
    ],
    highlights: [
      { icon: 'material', text: 'Enamel over steel, rolled rim' },
      { icon: 'made', text: 'Printed and fired, wrap-around design' },
      { icon: 'ship', text: 'In stock — ships in 2–3 days' },
      { icon: 'care', text: 'Dishwasher safe, not for microwaves' },
    ],
    attrValues: { material: 'Enamel over steel', dishwasher: 'Yes', microwave: 'No — it has a steel core' },
    soldOut: ['volume:450'],
  },

  'carp-poster': {
    media: FLAT_IMAGES,
    description: [
      'A giclée print on 250 gsm matte stock. Matte rather than gloss because a framed print behind glass picks up every reflection a gloss finish adds.',
      'Sold unframed by default. The framed options are assembled here and shipped in a corner-protected box.',
    ],
    highlights: [
      { icon: 'material', text: '250 gsm matte fine-art paper' },
      { icon: 'made', text: 'Giclée pigment print, archival inks' },
      { icon: 'ship', text: 'Ships rolled in a tube, or boxed if framed' },
      { icon: 'care', text: 'Keep out of direct sunlight' },
    ],
    attrValues: { origin: 'Viet Nam', paper: '250 gsm matte', finish: 'Matte, no coating' },
    soldOut: ['size:a2'],
  },

  'carp-sticker-sheet': {
    media: FLAT_IMAGES,
    description: [
      'Die-cut vinyl with a laminate layer over the ink, so they survive a water bottle going through a dishwasher.',
      'Cut individually, not kiss-cut on a shared backing — each sticker peels without lifting its neighbours.',
    ],
    highlights: [
      { icon: 'material', text: 'Laminated vinyl, weatherproof' },
      { icon: 'made', text: 'Die-cut individually' },
      { icon: 'ship', text: 'In stock — ships flat in a rigid envelope' },
      { icon: 'care', text: 'Sticks to clean, dry surfaces' },
    ],
    attrValues: { material: 'Vinyl', finish: 'Gloss laminate' },
  },

  'lotus-icon-pack': {
    media: FILE_IMAGES,
    description: [
      'Twenty-four botanical icons drawn on a 24 px grid, so they stay aligned when you drop them into an interface at small sizes.',
      'Every SVG is grouped and named — not a flattened export. You can recolour a single stem without ungrouping the whole file.',
    ],
    highlights: [
      { icon: 'material', text: '24 SVG · 24 PNG at 2000 px · 1 AI source' },
      { icon: 'made', text: 'Drawn on a 24 px grid, grouped and named' },
      { icon: 'ship', text: 'Download link the moment your payment clears' },
      { icon: 'care', text: 'Five downloads, no expiry date' },
    ],
    attrValues: { format: 'SVG, PNG, AI', dpi: '300', transparent: 'Yes', style: 'Line, single weight', count: '24' },
    bundle: { contents: ['24 SVG', '24 PNG at 2000 px', '1 AI source'], sizeLabel: '22 MB' },
  },

  'botanical-brush-set': {
    media: FILE_IMAGES,
    description: [
      'Forty-two brushes built from scanned ink strokes rather than generated textures, so the edges break the way real ink does on paper.',
      'The stamps are at print resolution — you can use them at A3 without the edges softening.',
    ],
    highlights: [
      { icon: 'material', text: '42 brushes · 1 PDF guide' },
      { icon: 'made', text: 'Built from scanned ink strokes' },
      { icon: 'ship', text: 'Download link the moment your payment clears' },
      { icon: 'care', text: 'Procreate 5 and later' },
    ],
    attrValues: { format: 'BRUSHSET, PDF', dpi: '300', transparent: 'Yes', style: 'Textured ink' },
    bundle: { contents: ['42 brushes', '1 PDF guide'], sizeLabel: '86 MB' },
  },

  'lotus-pattern-pack': {
    media: FILE_IMAGES,
    description: [
      'Eighteen seamless tiles at 300 DPI, each tested by tiling it four across and four down before it went in the pack.',
      'Sized for print-on-demand: drop a tile into a 30 × 40 cm print area and it repeats without a visible seam.',
    ],
    highlights: [
      { icon: 'material', text: '18 PNG tiles at 300 DPI' },
      { icon: 'made', text: 'Each tile tested at 4 × 4 repeat' },
      { icon: 'ship', text: 'Download link the moment your payment clears' },
      { icon: 'care', text: 'Seamless in both directions — no visible seam line' },
    ],
    attrValues: { format: 'PNG, JPG', dpi: '300', transparent: 'No', style: 'Botanical, flat colour' },
    bundle: { contents: ['18 PNG tiles at 4000 px', '1 colour swatch file'], sizeLabel: '140 MB' },
  },

  'seal-script-fonts': {
    media: FILE_IMAGES,
    description: [
      'A display face with full Vietnamese diacritics — including the stacked marks that break most display fonts, `ế` `ộ` `ữ`.',
      'Web formats ship in the same download as the desktop files — a display face you cannot put on a site is half a font.',
    ],
    highlights: [
      { icon: 'material', text: '3 OTF · 3 WOFF2' },
      { icon: 'made', text: 'Full Vietnamese and Latin Extended coverage' },
      { icon: 'ship', text: 'Download link the moment your payment clears' },
      { icon: 'care', text: 'Hinted for screen use down to 12 px' },
    ],
    attrValues: { format: 'OTF, WOFF2', weights: '3', languages: 'Latin, Latin Extended, Vietnamese' },
    bundle: { contents: ['3 OTF', '3 WOFF2'], sizeLabel: '4 MB' },
  },

  'carp-mug-speckled': {
    media: FLAT_IMAGES,
    description: [
      'The same carp, on a speckled glaze that varies slightly between batches — the flecks come from the clay body rather than being printed on, so no two are identical.',
      'Bigger than the enamel version at 450 ml, and heavier: this one is stoneware, not steel.',
    ],
    highlights: [
      { icon: 'material', text: 'Stoneware, speckled reactive glaze' },
      { icon: 'made', text: 'Glazed and fired in small batches' },
      { icon: 'ship', text: 'In stock — ships in 2–3 days' },
      { icon: 'care', text: 'Dishwasher and microwave safe' },
    ],
    attrValues: { material: 'Stoneware', dishwasher: 'Yes', microwave: 'Yes' },
  },

  'lotus-poster': {
    media: FLAT_IMAGES,
    description: [
      'A quieter companion to the carp poster: one lotus, a lot of paper around it. Designed to hang next to something rather than to be the thing you look at.',
      'The oak frame is assembled here and shipped in a corner-protected box.',
    ],
    highlights: [
      { icon: 'material', text: '250 gsm matte fine-art paper' },
      { icon: 'made', text: 'Giclée pigment print, archival inks' },
      { icon: 'ship', text: 'Ships rolled, or boxed if framed' },
      { icon: 'care', text: 'Keep out of direct sunlight' },
    ],
    attrValues: { origin: 'Viet Nam', paper: '250 gsm matte', finish: 'Matte, no coating' },
  },

  'carp-tote': {
    media: TEE_IMAGES,
    description: [
      'Short handles, so it hangs at the hand rather than the shoulder — better for a market run than a commute.',
      'Printed after you order, on black canvas that hides the inevitable coffee.',
    ],
    highlights: [
      { icon: 'material', text: '12 oz cotton canvas, black' },
      { icon: 'made', text: 'Printed to order, box-stitched handles' },
      { icon: 'ship', text: 'Ships flat from Viet Nam' },
      { icon: 'care', text: 'Machine washable, air dry' },
    ],
    attrValues: { material: 'Canvas', capacity: '12' },
  },

  'lotus-sticker-sheet': {
    media: FLAT_IMAGES,
    description: [
      'Twenty-four smaller lotus stickers on one A5 sheet, matte rather than gloss so they take pen on top.',
      'Die-cut individually — each one peels without lifting its neighbours.',
    ],
    highlights: [
      { icon: 'material', text: 'Matte vinyl, laminated' },
      { icon: 'made', text: 'Die-cut individually' },
      { icon: 'ship', text: 'In stock — ships flat in a rigid envelope' },
      { icon: 'care', text: 'Sticks to clean, dry surfaces' },
    ],
    attrValues: { material: 'Vinyl', finish: 'Matte laminate' },
  },

  'carp-hoodie': {
    media: TEE_IMAGES,
    description: [
      'The carp runs across the whole back panel rather than sitting as a chest badge, which is why this one is screen-printed and takes longer to make.',
      'Organic cotton face, brushed inside. Cut straight, not fitted.',
    ],
    highlights: [
      { icon: 'material', text: 'Organic cotton, brushed lining, 300 g/m²' },
      { icon: 'made', text: 'Screen-printed back panel' },
      { icon: 'ship', text: 'Free shipping from Viet Nam' },
      { icon: 'care', text: 'Wash inside out at 30 °C' },
    ],
    attrValues: { origin: 'Viet Nam', material: 'Organic cotton', gsm: '300', lining: 'Brushed cotton' },
    offered: { colour: ['ocean', 'black', 'white'] },
  },

  'botanical-serif-font': {
    media: FILE_IMAGES,
    description: [
      'A text face rather than a display one — it holds up at 14 px, which the seal script deliberately does not.',
      'Full Vietnamese coverage including the stacked marks, drawn rather than auto-composed, so `ế` and `ộ` sit at the right height instead of floating.',
    ],
    highlights: [
      { icon: 'material', text: '2 OTF · 2 WOFF2' },
      { icon: 'made', text: 'Vietnamese diacritics drawn, not auto-composed' },
      { icon: 'ship', text: 'Download link the moment your payment clears' },
      { icon: 'care', text: 'Readable down to 14 px in body copy' },
    ],
    attrValues: { format: 'OTF, WOFF2', weights: '2', languages: 'Latin, Vietnamese' },
    bundle: { contents: ['2 OTF', '2 WOFF2'], sizeLabel: '3 MB' },
  },
};

/* ── Ghép danh mục + sản phẩm ─────────────────────────────── */

/** Lùi `days` ngày từ một mốc ISO. Mốc do server truyền, không lấy `Date.now()`. */
function daysBefore(from: string, days: number) {
  const d = new Date(from + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * Biến một định nghĩa thuộc tính của danh mục thành trục buyer chọn được.
 *
 * `offered` cắt bớt tập giá trị: nhà in chỉ có S–2XL thì seller không được mở
 * bán 5XL, dù giao diện có cho gõ. `soldOut` thì ngược lại — vẫn hiện nhưng mờ
 * đi, vì **ẩn giá trị hết hàng làm bộ chọn nhảy loạn** và buyer tưởng mình nhớ nhầm.
 */
function toAxis(def: AttributeDef, detail: Detail | undefined): VariationAxis | null {
  const all = def.options ?? [];
  const offered = detail?.offered?.[def.code];
  const options = (offered ? all.filter((o) => offered.includes(o.value)) : all).map((o) => ({
    value: o.value,
    label: o.label,
    deltaCents: o.deltaCents ?? 0,
    available: !detail?.soldOut?.includes(`${def.code}:${o.value}`),
    swatch: o.swatch,
  }));

  // Trục chỉ còn một lựa chọn thì không phải lựa chọn — bỏ hẳn thay vì hiện
  // một ô chọn duy nhất khiến người dùng đi tìm phương án thứ hai.
  if (options.length < 2) return null;

  return {
    id: def.code,
    label: def.label,
    required: def.isRequired,
    inputType: def.inputType,
    hint: def.hint,
    options,
  };
}

/**
 * Đổi khoá ảnh trong `Detail['media']` thành URL thật.
 *
 * Khoá bắt đầu bằng `/` là tệp tĩnh có thật (ảnh động vẽ tay) — trả nguyên.
 * Còn lại ghép với slug để mỗi sản phẩm có bộ ảnh riêng dù dùng chung mảng.
 */
function photoFor(listing: Listing, key: string) {
  return key.startsWith('/') ? key : demoPhoto(`${listing.slug}-${key}`, 1200);
}

function buildProduct(listing: Listing): Product {
  const detail = DETAILS[listing.slug];
  const path = listing.categoryPath;
  const shop = SHOPS.find((s) => s.slug === listing.shopSlug)!;

  const axes = axesFor(path)
    .map((def) => toAxis(def, detail))
    .filter((a): a is VariationAxis => a !== null);

  // Thuộc tính mô tả: danh mục quyết định HỎI GÌ, sản phẩm cung cấp GIÁ TRỊ.
  // Thiếu giá trị thì bỏ dòng đó đi — hiện "Material: —" tệ hơn là không hiện.
  const attributes = descriptiveFor(path)
    .map((def) => {
      const raw = detail?.attrValues[def.code];
      if (!raw) return null;
      return { label: def.label, value: def.unit ? `${raw} ${def.unit}` : raw };
    })
    .filter((a): a is { label: string; value: string } => a !== null);

  const digital = listing.kind === 'file';

  return {
    slug: listing.slug,
    title: listing.title,
    kind: listing.kind,
    categoryPath: path,

    priceCents: listing.priceCents,
    compareAtCents: listing.compareAtCents,
    shippingCents: listing.freeShipping ? 0 : 490,
    // Số THẬT lấy từ backend. Etsy hiển thị `In 20+ carts` từ dữ liệu thật chứ
    // không phải đồng hồ đếm ngược bịa — số bịa bị phát hiện một lần là mất
    // niềm tin vĩnh viễn, và người ta luôn phát hiện ra.
    inCarts: Math.min(60, Math.round(listing.soldCount / 60)),

    quotedFrom: '2026-07-29',
    leadTimeMinDays: listing.leadDays?.[0] ?? 0,
    leadTimeMaxDays: listing.leadDays?.[1] ?? 0,
    returnWindowDays: digital ? 0 : 30,
    shipsFrom: shop.location,
    deliverTo: 'United States',

    rating: listing.rating,
    reviewCount: listing.reviewCount,
    soldCount: listing.soldCount,

    /* Hai số này ở bản thật do backend trả về. Ở demo chúng được SUY RA từ
       lượng bán thay vì gõ tay, để không bao giờ mâu thuẫn với phần còn lại
       của trang — một sản phẩm bán 1.400 cái mà "lên sàn hôm qua" là loại lỗi
       dữ liệu người mua nhận ra ngay và mất niềm tin vào mọi con số khác. */
    listedAt: daysBefore('2026-07-29', Math.min(700, Math.round(listing.soldCount / 4) + 30)),
    favourites: Math.round(listing.soldCount * 0.6 + listing.reviewCount * 2),

    media: (detail?.media ?? FLAT_IMAGES).map((item, i) => ({
      id: `${listing.slug}-${i}`,
      type: item.type ?? 'image',
      src: i === 0 ? listing.image : photoFor(listing, item.src),
      poster: item.poster ? photoFor(listing, item.poster) : undefined,
      alt: item.alt,
      role: item.role,
      caption: item.caption,
      width: 1200,
      height: item.role === 'chart' ? 900 : 1200,
    })),
    axes,
    personalization: detail?.personalization ?? (digital ? null : {
      label: 'Custom Monogram, Text & Artwork Personalization',
      hint: 'Enter your custom name, date, quote, or print notes (e.g. "Name: KENJI 1998, Font: Cyber Neon")',
      maxChars: 250,
      fontStyles: ['Cyber Neon (Futuristic)', 'Minimalist Sans', 'Vintage Script', 'Bold Gothic Serif'],
      placements: ['Front Center Print', 'Full Back Print', 'Left Chest + Back', 'Custom Sleeve Accent'],
      allowFileUpload: true,
    }),

    highlights: detail?.highlights?.length
      ? detail.highlights
      : digital
        ? [
            { icon: 'material', text: 'Instant digital download package (SVG, PNG, EPS & 4K Source)' },
            { icon: 'made', text: 'Master crafted vector & 3D asset vault by verified design studio' },
            { icon: 'ship', text: 'Lifetime access with 5 download links & free updates' },
            { icon: 'care', text: 'Commercial & personal use license options included' },
          ]
        : [
            { icon: 'material', text: 'High-grade 100% combed cotton / archival museum-grade substrate' },
            { icon: 'made', text: 'Custom printed to order with eco-friendly water-based inks' },
            { icon: 'ship', text: 'Dispatches in 1–3 business days with full real-time tracking' },
            { icon: 'care', text: 'Machine wash cold inside out, tumble dry low heat' },
          ],

    description: detail?.description?.length
      ? detail.description
      : [
          `Designed with passion by ${shop.name}, the ${listing.title} embodies premium craftsmanship and modern cyber-lux aesthetics. Each piece is meticulously produced to meet international archival quality standards.`,
          `Whether added to your personal collection or gifted to someone special, this product features vibrant pigment depth, durable structural integrity, and exceptional tactile texture. Printed and dispatched directly from ${shop.location}.`,
          `All items come backed by our 100% Buyer Protection & Delivery Guarantee. If you have custom sizing or personalization requests, reach out directly to the studio creator!`,
        ],

    attributes: attributes.length
      ? attributes
      : [
          { label: 'Crafting Technique', value: digital ? 'Vector Illustration & 3D Modeling' : 'Direct-to-Garment / Archival Inkjet' },
          { label: 'Material Substrate', value: digital ? 'Lossless Vector (300 DPI)' : '100% Ring-Spun Cotton & Premium Alloy' },
          { label: 'Production Origin', value: shop.location },
          { label: 'Dispatched In', value: digital ? 'Instant Digital Vault Access' : '1–3 Business Days' },
          { label: 'Sustainability', value: 'Made-to-order on demand — zero wasteful stock overhang' },
        ],
    bundle: detail?.bundle ?? null,

    /* Etsy tách điểm theo BA trục thay vì một số sao. Với POD thì càng đúng:
       chất lượng in, tốc độ giao và thái độ người bán là ba nguồn khiếu nại
       khác nhau, gộp lại thành một con số là mất thông tin. */
    reviewBreakdown: digital
      ? [
          { label: 'File quality', score: Math.min(5, listing.rating + 0.1) },
          { label: 'Value', score: listing.rating },
          { label: 'Customer service', score: 5 },
        ]
      : [
          { label: 'Print quality', score: Math.min(5, listing.rating + 0.1) },
          { label: 'Shipping', score: Math.max(3.8, listing.rating - 0.3) },
          { label: 'Customer service', score: 5 },
        ],
    reviews: detail?.reviews ?? GENERIC_REVIEWS,

    shop: {
      slug: shop.slug,
      name: shop.name,
      owner: shop.owner,
      location: shop.location,
      rating: shop.rating,
      reviewCount: shop.reviewCount,
      sales: `${Math.round(shop.sales / 1000)}k sales`,
      yearsActive: 2026 - shop.joinedYear,
      responseTime: 'within a few hours',
      starSeller: shop.starSeller,
      badges: [
        { title: 'Smooth shipping', body: 'Has a history of shipping on time with tracking.' },
        { title: 'Speedy replies', body: 'Has a history of replying to messages quickly.' },
      ],
    },
  };
}

const GENERIC_REVIEWS: Review[] = [
  {
    id: 'g1',
    author: 'Alex P.',
    initials: 'AP',
    rating: 5,
    date: 'Jul 09, 2026',
    body: 'Exactly what the listing described, and the shop answered a question the same evening. No notes.',
  },
  {
    id: 'g2',
    author: 'Sam K.',
    initials: 'SK',
    rating: 4,
    date: 'Jun 22, 2026',
    body: 'Good quality. Took a day or two longer than the estimate, but the tracking updated the whole way so I never had to chase it.',
  },
];

/** Ở bản thật: gọi API kèm tag để `revalidateTag('product:{id}')` khi seller sửa giá. */
export async function getProduct(slug: string): Promise<Product | null> {
  const listing = LISTINGS.find((l) => l.slug === slug);
  return listing ? buildProduct(listing) : null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  return LISTINGS.map((l) => l.slug);
}

/**
 * Đánh giá gộp theo SHOP — tab "Reviews" ở trang shop.
 *
 * Gom từ đánh giá của từng sản phẩm chứ không phải một bảng riêng: đánh giá
 * luôn gắn với một món đã mua, và tách ra thành "đánh giá shop" là mở đường cho
 * loại nhận xét không kiểm chứng được bằng đơn hàng nào.
 *
 * Vì vậy mỗi dòng mang theo món đã mua — người đọc cần biết 5 sao đó dành cho
 * cái áo hay cho bộ icon.
 */
export type ShopReview = Review & {
  productSlug: string;
  productTitle: string;
  productImage: string;
};

export async function getShopReviews(shopSlug: string, limit = 8): Promise<ShopReview[]> {
  const out: ShopReview[] = [];

  for (const listing of LISTINGS.filter((l) => l.shopSlug === shopSlug)) {
    const product = buildProduct(listing);
    for (const review of product.reviews) {
      out.push({
        ...review,
        id: `${listing.slug}-${review.id}`,
        productSlug: listing.slug,
        productTitle: listing.title,
        productImage: listing.image,
      });
    }
  }

  // Mới nhất trước. `date` là chuỗi đã format nên phải parse lại — ở bản thật
  // API trả về ISO và việc này không tồn tại.
  return out
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/** Hàng khác của cùng shop — dải "More from this shop" trong thẻ người bán. */
export async function getShopListings(shopSlug: string, exclude: string, limit = 4) {
  return LISTINGS.filter((l) => l.shopSlug === shopSlug && l.slug !== exclude)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, limit);
}

/** Sản phẩm khác cùng danh mục lá — dải "You may also like" ở cuối trang. */
export async function getRelated(slug: string, limit = 6): Promise<Listing[]> {
  const current = LISTINGS.find((l) => l.slug === slug);
  if (!current) return [];
  const leaf = current.categoryPath.join('/');
  const sameLeaf = LISTINGS.filter((l) => l.slug !== slug && l.categoryPath.join('/') === leaf);
  const sameRoot = LISTINGS.filter(
    (l) => l.slug !== slug && l.categoryPath[0] === current.categoryPath[0] && !sameLeaf.includes(l),
  );
  const sameShop = LISTINGS.filter(
    (l) => l.slug !== slug && l.shopSlug === current.shopSlug && !sameLeaf.includes(l) && !sameRoot.includes(l),
  );
  return [...sameLeaf, ...sameRoot, ...sameShop].slice(0, limit);
}
