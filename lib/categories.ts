/**
 * THUỘC TÍNH ĐỘNG THEO DANH MỤC.
 *
 * Bản dựng của `category_attributes` + `product_attribute_options` mô tả ở
 * document/01-kien-truc/product-attributes.md. Ở bản thật đây là một lượt gọi
 * `GET /v1/categories/{id}/attributes` mà Spring trả về sau khi gộp đệ quy cây
 * danh mục và cache vào Redis theo khoá `catattr:{category_id}`.
 *
 * ── Khái niệm gốc, nhầm chỗ này thì mọi thứ sai theo ──────────────────────
 *
 *   TRỤC BIẾN THỂ (`isVariantAxis: true`)     THUỘC TÍNH MÔ TẢ
 *   ─────────────────────────────────────     ─────────────────────────────
 *   Size · Màu · Giấy phép                    Chất liệu · Kiểu cổ · DPI
 *   Sinh SKU riêng, giá riêng, tồn riêng      Không sinh gì cả
 *   Buyer CHỌN ở trang sản phẩm               Buyer chỉ ĐỌC
 *
 * Quy tắc nhận biết: nếu đổi giá trị đó mà **giá hoặc tồn kho phải khác đi**
 * thì nó là trục. Áo 2XL đắt hơn M → size là trục. Áo cotton hay cotton pha
 * thì cùng giá trong một sản phẩm → chất liệu là mô tả.
 *
 * ── Vì sao gắn theo NÚT chứ không theo lá ────────────────────────────────
 *
 * Thuộc tính khai ở `clothing` áp dụng cho mọi thứ bên dưới. `t-shirts` chỉ
 * cần khai phần riêng của nó. Danh mục sâu hơn GHI ĐÈ danh mục cha khi trùng
 * `code` — cha để `material` là tuỳ chọn, con nâng thành bắt buộc được.
 *
 * ── Vì sao `isVariantAxis` nằm ở đây chứ không ở từ điển thuộc tính ───────
 *
 * Cùng một thuộc tính có thể là trục ở danh mục này và chỉ là mô tả ở danh mục
 * khác. *Màu sắc* là trục của áo thun; với tranh in khung gỗ thì màu khung
 * nhiều khi chỉ là mô tả.
 */

export type InputType = 'SELECT' | 'SWATCH' | 'MULTISELECT' | 'NUMBER' | 'BOOLEAN' | 'TEXT';

export type AttributeOption = {
  /** Giá trị chuẩn hoá — lọc và đối chiếu chạy trên đây, KHÔNG chạy trên nhãn */
  value: string;
  /** Nhãn hiển thị — đổi nhãn không được đổi `value`, nếu không dữ liệu cũ hỏng */
  label: string;
  /** Chỉ có ở `SWATCH` */
  swatch?: string;
  /** Chênh lệch giá so với giá gốc, tính bằng cent. Chỉ có nghĩa ở trục biến thể. */
  deltaCents?: number;
};

export type AttributeDef = {
  code: string;
  label: string;
  inputType: InputType;
  isVariantAxis: boolean;
  isRequired: boolean;
  isFilterable: boolean;
  unit?: string;
  /** Dòng giải thích cho người dùng — "GSM" nghe rõ với ai đã biết nó là gì */
  hint?: string;
  options?: AttributeOption[];
};

/* ── Từ điển giá trị dùng lại nhiều nơi ───────────────────── */

const SIZES: AttributeOption[] = [
  { value: 's', label: 'S', deltaCents: 0 },
  { value: 'm', label: 'M', deltaCents: 0 },
  { value: 'l', label: 'L', deltaCents: 0 },
  { value: 'xl', label: 'XL', deltaCents: 200 },
  { value: '2xl', label: '2XL', deltaCents: 400 },
];

const GARMENT_COLOURS: AttributeOption[] = [
  { value: 'black', label: 'Black', swatch: '#222222', deltaCents: 0 },
  { value: 'white', label: 'White', swatch: '#ffffff', deltaCents: 0 },
  { value: 'ocean', label: 'Ocean blue', swatch: '#3b67d9', deltaCents: 200 },
  { value: 'sand', label: 'Sand', swatch: '#d8cbb4', deltaCents: 200 },
  { value: 'indigo', label: 'Indigo', swatch: '#2b3a67', deltaCents: 200 },
  { value: 'cream', label: 'Cream', swatch: '#f1e8c8', deltaCents: 0 },
];

/* ── Đăng ký thuộc tính theo NÚT trong cây danh mục ────────── */

const REGISTRY: Record<string, AttributeDef[]> = {
  clothing: [
    {
      code: 'origin',
      label: 'Made in',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: false,
    },
  ],
  'clothing/tops': [
    {
      code: 'material',
      label: 'Material',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'cotton', label: 'Cotton' },
        { value: 'organic-cotton', label: 'Organic cotton' },
        { value: 'cotton-blend', label: 'Cotton blend' },
      ],
    },
    {
      code: 'gsm',
      label: 'Fabric weight',
      inputType: 'NUMBER',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
      unit: 'g/m²',
      hint: 'Grams per square metre — higher means thicker, less see-through.',
    },
    {
      code: 'collar',
      label: 'Collar',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
  'clothing/tops/t-shirts': [
    {
      code: 'colour',
      label: 'Colour',
      inputType: 'SWATCH',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: GARMENT_COLOURS,
    },
    {
      code: 'size',
      label: 'Size',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: SIZES,
    },
    {
      code: 'sleeve',
      label: 'Sleeve',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
  'clothing/tops/hoodies': [
    {
      code: 'colour',
      label: 'Colour',
      inputType: 'SWATCH',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: GARMENT_COLOURS.slice(0, 4),
    },
    {
      code: 'size',
      label: 'Size',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: SIZES,
    },
    {
      code: 'lining',
      label: 'Lining',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],

  bags: [
    {
      code: 'material',
      label: 'Material',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
  ],
  'bags/totes': [
    {
      code: 'colour',
      label: 'Canvas colour',
      inputType: 'SWATCH',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'natural', label: 'Natural', swatch: '#e4dbc6', deltaCents: 0 },
        { value: 'black', label: 'Black', swatch: '#222222', deltaCents: 150 },
        { value: 'olive', label: 'Olive', swatch: '#5c6249', deltaCents: 150 },
      ],
    },
    {
      code: 'handle',
      label: 'Handle length',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'short', label: 'Short · hand carry', deltaCents: 0 },
        { value: 'long', label: 'Long · shoulder', deltaCents: 100 },
      ],
    },
    {
      code: 'capacity',
      label: 'Capacity',
      inputType: 'NUMBER',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
      unit: 'L',
    },
  ],

  home: [
    {
      code: 'material',
      label: 'Material',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
  ],
  'home/kitchen': [
    {
      code: 'dishwasher',
      label: 'Dishwasher safe',
      inputType: 'BOOLEAN',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
    {
      code: 'microwave',
      label: 'Microwave safe',
      inputType: 'BOOLEAN',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
  'home/kitchen/mugs': [
    {
      code: 'volume',
      label: 'Volume',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      unit: 'ml',
      options: [
        { value: '250', label: '250 ml', deltaCents: 0 },
        { value: '350', label: '350 ml', deltaCents: 300 },
        { value: '450', label: '450 ml', deltaCents: 600 },
      ],
    },
    {
      code: 'glaze',
      label: 'Glaze',
      inputType: 'SWATCH',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'white', label: 'White', swatch: '#ffffff', deltaCents: 0 },
        { value: 'speckled', label: 'Speckled', swatch: '#e0dccf', deltaCents: 200 },
      ],
    },
  ],

  art: [
    {
      code: 'origin',
      label: 'Made in',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: false,
    },
  ],
  'art/prints': [
    {
      code: 'paper',
      label: 'Paper',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
    {
      code: 'finish',
      label: 'Finish',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
  'art/prints/posters': [
    {
      code: 'size',
      label: 'Print size',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'a4', label: 'A4 · 21 × 30 cm', deltaCents: 0 },
        { value: 'a3', label: 'A3 · 30 × 42 cm', deltaCents: 600 },
        { value: 'a2', label: 'A2 · 42 × 59 cm', deltaCents: 1400 },
      ],
    },
    {
      code: 'frame',
      label: 'Frame',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: false,
      isFilterable: true,
      options: [
        { value: 'none', label: 'No frame', deltaCents: 0 },
        { value: 'oak', label: 'Oak', deltaCents: 2200 },
        { value: 'black', label: 'Black', deltaCents: 2000 },
      ],
    },
  ],

  paper: [
    {
      code: 'material',
      label: 'Material',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
  ],
  'paper/stickers': [
    {
      code: 'sheet',
      label: 'Sheet size',
      inputType: 'SELECT',
      isVariantAxis: true,
      isRequired: true,
      isFilterable: true,
      options: [
        { value: 'a6', label: 'A6 · 12 stickers', deltaCents: 0 },
        { value: 'a5', label: 'A5 · 24 stickers', deltaCents: 500 },
      ],
    },
    {
      code: 'finish',
      label: 'Finish',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],

  /* Hàng số KHÔNG còn trục biến thể nào — giấy phép đã bỏ theo yêu cầu, và nó
     từng là trục duy nhất ở đây. Nghĩa là mua file số giờ không phải chọn gì:
     một mức giá, một gói file. `axesFor('digital')` trả về mảng rỗng, và hộp
     mua tự bỏ luôn phần chọn biến thể — không cần nhánh riêng cho hàng số. */
  digital: [
    {
      code: 'format',
      label: 'File formats',
      inputType: 'MULTISELECT',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
  ],
  'digital/graphics': [
    {
      code: 'dpi',
      label: 'Resolution',
      inputType: 'NUMBER',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
      unit: 'DPI',
    },
    {
      code: 'transparent',
      label: 'Transparent background',
      inputType: 'BOOLEAN',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
    {
      code: 'style',
      label: 'Style',
      inputType: 'SELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
  'digital/graphics/icons': [
    {
      code: 'count',
      label: 'Icons in the pack',
      inputType: 'NUMBER',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
  ],
  'digital/fonts': [
    {
      code: 'weights',
      label: 'Weights included',
      inputType: 'NUMBER',
      isVariantAxis: false,
      isRequired: true,
      isFilterable: true,
    },
    {
      code: 'languages',
      label: 'Language support',
      inputType: 'MULTISELECT',
      isVariantAxis: false,
      isRequired: false,
      isFilterable: true,
    },
  ],
};

const normalizeSlug = (s: string) =>
  s.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const key = (path: string[]) => {
  const norm = path.map(normalizeSlug);
  if (norm[0]?.includes('clothing')) norm[0] = 'clothing';
  if (norm[0]?.includes('digital')) norm[0] = 'digital';
  if (norm[0]?.includes('art')) norm[0] = 'art';
  if (norm[0]?.includes('bag')) norm[0] = 'bags';
  if (norm[0]?.includes('home')) norm[0] = 'home';
  if (norm[0]?.includes('paper')) norm[0] = 'paper';
  if (norm[0]?.includes('tech') || norm[0]?.includes('accessories')) norm[0] = 'accessories';
  return norm.join('/');
};

/**
 * Gộp thuộc tính từ gốc xuống lá. Danh mục SÂU HƠN ghi đè danh mục cha khi
 * trùng `code` — tương đương `ORDER BY depth ASC` trong truy vấn đệ quy ở
 * product-attributes.md §4.
 */
export function attributesFor(path: string[]): AttributeDef[] {
  const merged = new Map<string, AttributeDef>();
  if (path?.length) {
    for (let i = 1; i <= path.length; i++) {
      for (const attr of REGISTRY[key(path.slice(0, i))] ?? []) merged.set(attr.code, attr);
    }
  }

  const hasAxes = [...merged.values()].some((a) => a.isVariantAxis);
  if (!hasAxes) {
    const root = (path?.[0] ?? '').toLowerCase();
    if (root.includes('digital')) {
      merged.set('license', {
        code: 'license',
        label: 'License Option',
        inputType: 'SELECT',
        isVariantAxis: true,
        isRequired: true,
        isFilterable: true,
        options: [
          { value: 'personal', label: 'Personal Use License', deltaCents: 0 },
          { value: 'commercial', label: 'Commercial License', deltaCents: 1500 },
          { value: 'extended', label: 'Extended Enterprise License', deltaCents: 3500 },
        ],
      });
      merged.set('resolution', {
        code: 'resolution',
        label: 'Format & Resolution',
        inputType: 'SELECT',
        isVariantAxis: true,
        isRequired: false,
        isFilterable: true,
        options: [
          { value: 'std', label: 'Standard Package (SVG, PNG, 300 DPI)', deltaCents: 0 },
          { value: 'source', label: 'Source Vault (SVG, PNG, EPS, AI, 4K Raw)', deltaCents: 800 },
        ],
      });
    } else if (root.includes('art')) {
      merged.set('size', {
        code: 'size',
        label: 'Print Size',
        inputType: 'SELECT',
        isVariantAxis: true,
        isRequired: true,
        isFilterable: true,
        options: [
          { value: 'a4', label: 'A4 · 21 × 30 cm', deltaCents: 0 },
          { value: 'a3', label: 'A3 · 30 × 42 cm', deltaCents: 600 },
          { value: 'a2', label: 'A2 · 42 × 59 cm', deltaCents: 1400 },
          { value: 'a1', label: 'A1 · Museum Large 59 × 84 cm', deltaCents: 2800 },
        ],
      });
      merged.set('frame', {
        code: 'frame',
        label: 'Frame Option',
        inputType: 'SELECT',
        isVariantAxis: true,
        isRequired: false,
        isFilterable: true,
        options: [
          { value: 'none', label: 'No Frame (Rolled Print)', deltaCents: 0 },
          { value: 'black', label: 'Matte Black Metal Frame', deltaCents: 2000 },
          { value: 'oak', label: 'Natural Oak Wood Frame', deltaCents: 2400 },
        ],
      });
    } else {
      merged.set('size', {
        code: 'size',
        label: 'Size / Edition',
        inputType: 'SELECT',
        isVariantAxis: true,
        isRequired: true,
        isFilterable: true,
        options: [
          { value: 's', label: 'Standard S', deltaCents: 0 },
          { value: 'm', label: 'Medium M', deltaCents: 0 },
          { value: 'l', label: 'Large L', deltaCents: 200 },
          { value: 'xl', label: 'Extra Large XL', deltaCents: 400 },
        ],
      });
      merged.set('colour', {
        code: 'colour',
        label: 'Color Finish',
        inputType: 'SWATCH',
        isVariantAxis: true,
        isRequired: true,
        isFilterable: true,
        options: GARMENT_COLOURS,
      });
    }
  }

  return [...merged.values()];
}

/** Trục sinh biến thể — thứ buyer CHỌN. Chặn cứng 3 trục theo quy tắc bất biến §10.4. */
export function axesFor(path: string[]): AttributeDef[] {
  return attributesFor(path)
    .filter((a) => a.isVariantAxis)
    .slice(0, 3);
}

/** Thuộc tính mô tả — thứ buyer chỉ ĐỌC. */
export function descriptiveFor(path: string[]): AttributeDef[] {
  return attributesFor(path).filter((a) => !a.isVariantAxis);
}

/**
 * Thuộc tính lọc được của một nhánh danh mục — nguồn của rail lọc động.
 *
 * Chỉ trả về thuộc tính có sẵn danh sách giá trị: bộ lọc cần biết chọn giữa
 * những gì. Thuộc tính `NUMBER` và `BOOLEAN` cũng lọc được nhưng cần dạng
 * điều khiển khác, xử lý riêng ở `FilterPanel`.
 */
export function filterableFor(path: string[]) {
  return attributesFor(path).filter((a) => a.isFilterable && (a.options?.length ?? 0) >= 2);
}

/* ── Cây danh mục cho menu ─────────────────────────────────── */

export type CategoryNode = { slug: string; label: string; children?: CategoryNode[] };

/**
 * Cây điều hướng. Tách khỏi `REGISTRY` vì hai thứ trả lời hai câu hỏi khác
 * nhau: cây trả lời "đi đâu được", registry trả lời "chỗ đó hỏi những gì".
 *
 * Chỉ **danh mục lá** mới gắn được sản phẩm (quy tắc bất biến §10.1), nên lá
 * là chỗ duy nhất bộ lọc thuộc tính đầy đủ.
 */
export const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: 'jewelry',
    label: 'Jewelry & Personal Ornaments',
    children: [
      { slug: 'gold-pendants', label: 'Gold Pendants & Necklaces' },
      { slug: 'artisan-rings', label: 'Artisan Rings & Bands' },
      { slug: 'drop-earrings', label: 'Drop & Hoop Earrings' },
      { slug: 'chokers', label: 'Layered Chokers & Chains' },
      { slug: 'bracelets', label: 'Handmade Bracelets' },
    ],
  },
  {
    slug: 'art',
    label: 'Art & Collectibles',
    children: [
      { slug: 'posters', label: 'Fine Art Posters' },
      { slug: 'canvas-art', label: 'Canvas Art Prints' },
      { slug: 'framed-prints', label: 'Framed Artwork' },
      { slug: 'abstract-art', label: 'Abstract Paintings' },
      { slug: 'pottery-vases', label: 'Pottery Vases & Ceramics' },
    ],
  },
  {
    slug: 'home',
    label: 'Home & Living',
    children: [
      { slug: 'cushions', label: 'Throw Pillows & Cushions' },
      { slug: 'candles', label: 'Scented Soy Candles' },
      { slug: 'wall-clocks', label: 'Custom Clocks & Art' },
      { slug: 'mugs', label: 'Ceramic & Enamel Mugs' },
      { slug: 'tumblers', label: 'Insulated Tumblers' },
    ],
  },
  {
    slug: 'clothing',
    label: 'Clothing & Apparel',
    children: [
      { slug: 't-shirts', label: 'Cyber T-Shirts & Graphic Tees' },
      { slug: 'hoodies', label: 'Streetwear Hoodies' },
      { slug: 'sweatshirts', label: 'Heavyweight Sweatshirts' },
      { slug: 'joggers', label: 'Urban Joggers & Sweatpants' },
      { slug: 'denim-jeans', label: 'Custom Denim & Jackets' },
    ],
  },
  {
    slug: 'paper',
    label: 'Paper & Party Supplies',
    children: [
      { slug: 'notebooks', label: 'Custom Journals & Notebooks' },
      { slug: 'stickers', label: 'Vinyl Die-Cut Stickers' },
      { slug: 'greeting-cards', label: 'Artisan Greeting Cards' },
      { slug: 'planners', label: 'Daily Planners & Agendas' },
      { slug: 'party-banners', label: 'Party Banners & Decor' },
    ],
  },
  {
    slug: 'weddings',
    label: 'Weddings & Celebrations',
    children: [
      { slug: 'wedding-decor', label: 'Wedding Table & Wall Decor' },
      { slug: 'bridal-gifts', label: 'Bridal Party Gifts' },
      { slug: 'invitations', label: 'Custom Wedding Invitations' },
      { slug: 'table-runners', label: 'Linen Table Runners' },
      { slug: 'ring-boxes', label: 'Velvet Ring Boxes' },
    ],
  },
  {
    slug: 'bags',
    label: 'Bags & Carriers',
    children: [
      { slug: 'totes', label: 'Heavyweight Canvas Totes' },
      { slug: 'backpacks', label: 'Custom Backpacks' },
      { slug: 'pouches', label: 'Accessory Pouches' },
      { slug: 'leather-sleeves', label: 'Leather Tech Sleeves' },
      { slug: 'duffels', label: 'Travel Duffel Bags' },
    ],
  },
  {
    slug: 'digital',
    label: 'Digital Assets & Media',
    children: [
      { slug: 'icons', label: 'Icons & Symbols Bundles' },
      { slug: 'brushes', label: 'Procreate & Photoshop Brushes' },
      { slug: '3d-models', label: '3D Models & Low-Poly Assets' },
      { slug: 'ui-kits', label: 'Figma UI Kits & Templates' },
      { slug: 'audio-samples', label: 'Royalty-Free Sound Packs' },
    ],
  },
  {
    slug: 'kids',
    label: 'Kids & Baby',
    children: [
      { slug: 'baby-clothes', label: 'Baby Onesies & Clothes' },
      { slug: 'nursery-decor', label: 'Nursery Wall Prints & Decals' },
      { slug: 'baby-bibs', label: 'Organic Cotton Baby Bibs' },
      { slug: 'baby-blankets', label: 'Soft Infant Blankets' },
      { slug: 'plushies', label: 'Custom Plush Toys' },
    ],
  },
  {
    slug: 'beauty',
    label: 'Bath & Beauty',
    children: [
      { slug: 'soaps', label: 'Artisan Handmade Soaps' },
      { slug: 'oils', label: 'Organic Essential Oils' },
      { slug: 'bath-bombs', label: 'Fizzy Aromatherapy Bath Bombs' },
      { slug: 'body-scrubs', label: 'Exfoliating Body Scrubs' },
      { slug: 'lip-balms', label: 'Natural Tinted Lip Balms' },
    ],
  },
  {
    slug: 'pets',
    label: 'Pet Supplies',
    children: [
      { slug: 'pet-bandanas', label: 'Custom Dog & Cat Bandanas' },
      { slug: 'pet-tags', label: 'Engraved Pet ID Tags' },
      { slug: 'pet-sweaters', label: 'Knit Pet Sweaters' },
      { slug: 'pet-bowls', label: 'Ceramic Pet Bowls' },
      { slug: 'cat-toys', label: 'Catnip Felt Toys' },
    ],
  },
  {
    slug: 'games',
    label: 'Toys & Games',
    children: [
      { slug: 'puzzles', label: 'Jigsaw Art Puzzles' },
      { slug: 'custom-plushies', label: 'Custom Plush Collectibles' },
      { slug: 'playing-cards', label: 'Custom Playing Cards' },
      { slug: 'board-games', label: 'Indie Board Games' },
      { slug: 'dice-sets', label: 'Resin RPG Dice Sets' },
    ],
  },
  {
    slug: 'crafts',
    label: 'Craft Supplies & Tools',
    children: [
      { slug: 'fabrics', label: 'Yarn & Organic Fabrics' },
      { slug: 'stamps', label: 'Custom Wooden Rubber Stamps' },
      { slug: 'wax-seals', label: 'Metallic Wax Seal Stamps' },
      { slug: 'embroidery-kits', label: 'DIY Embroidery Kits' },
      { slug: 'craft-beads', label: 'Glass & Gemstone Craft Beads' },
    ],
  },
  {
    slug: 'accessories',
    label: 'Tech & Accessories',
    children: [
      { slug: 'phone-cases', label: 'Impact Phone Cases' },
      { slug: 'laptop-sleeves', label: 'Neoprene Laptop Sleeves' },
      { slug: 'airpod-cases', label: 'Silicon AirPod Cases' },
      { slug: 'keycaps', label: 'Artisan Mechanical Keycaps' },
      { slug: 'desk-mats', label: 'Extended Gaming Desk Mats' },
    ],
  },
];
