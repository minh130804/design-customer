/**
 * Giỏ hàng.
 *
 * Bất biến quan trọng nhất: **giỏ nhóm theo shop, không phải danh sách phẳng**.
 * Mỗi shop là một đơn con, một kiện, một dòng đối soát riêng. Danh sách phẳng
 * không biểu diễn được điều đó, và hậu quả lộ ra ở checkout khi buyer thấy ba
 * mã vận đơn cho một lần thanh toán mà không hiểu vì sao.
 *
 * Tiền LUÔN là số nguyên cent. `25.00 − 7.80 = 17.199999999999996` là lỗi
 * chỉ xuất hiện ở đơn thứ vài nghìn, và lúc đó nó đã nằm trong sổ đối soát.
 */

import type { FulfilmentKind } from './products';
import { demoPhoto } from './utils';

export type CartLine = {
  id: string;
  slug: string;
  title: string;
  image: string;
  kind: FulfilmentKind;
  /**
   * Biến thể đã chọn. **Không bắt buộc**: từ khi bỏ giấy phép, hàng số không
   * còn trục biến thể nào, nên một dòng file số không có gì để hiện ở đây.
   * Để chuỗi rỗng thì giao diện in ra dấu `·` cụt lủn — thà không có trường.
   */
  variantLabel?: string;
  unitCents: number;
  qty: number;
  /** Hàng số khoá cứng qty = 1 — mua hai bản cùng một file là vô nghĩa */
  qtyLocked: boolean;
  leadDays: [number, number] | null;
  /** Chọn để thanh toán. Buyer được trả từng phần giỏ, không phải tất cả. */
  selected: boolean;
  personalisation?: string;
};

export type CartGroup = {
  shopSlug: string;
  shopName: string;
  lines: CartLine[];
  /** Phí ship cho cả nhóm, không phải từng dòng — một shop gói một kiện */
  shippingCents: number;
  freeShippingOverCents: number | null;
};

export const CART: CartGroup[] = [
  {
    shopSlug: 'lotus-studio',
    shopName: 'Lotus Studio',
    shippingCents: 0,
    freeShippingOverCents: null,
    lines: [
      {
        id: 'l1',
        slug: 'lotus-tee',
        title: 'Lotus Tee, hand-drawn lotus print on combed ring-spun cotton',
        image: demoPhoto('lotus-tee'),
        kind: 'pod',
        variantLabel: 'Black · M',
        unitCents: 2500,
        qty: 2,
        qtyLocked: false,
        leadDays: [6, 12],
        selected: true,
        personalisation: 'Back collar: “Thu”',
      },
      {
        id: 'l2',
        slug: 'lotus-tote',
        title: 'Lotus tote bag, 12 oz natural canvas',
        image: demoPhoto('lotus-tote'),
        kind: 'pod',
        variantLabel: 'Natural',
        unitCents: 2200,
        qty: 1,
        qtyLocked: false,
        leadDays: [6, 12],
        selected: true,
      },
    ],
  },
  {
    shopSlug: 'paper-north',
    shopName: 'Paper North',
    shippingCents: 0,
    freeShippingOverCents: null,
    lines: [
      {
        id: 'l3',
        slug: 'lotus-icon-pack',
        title: 'Lotus icon pack — 24 SVG and 24 PNG botanical icons',
        image: demoPhoto('lotus-icon-pack'),
        kind: 'file',
        unitCents: 990,
        qty: 1,
        qtyLocked: true,
        leadDays: null,
        selected: true,
      },
    ],
  },
  {
    shopSlug: 'carp-atelier',
    shopName: 'Carp Atelier',
    shippingCents: 490,
    freeShippingOverCents: 3500,
    lines: [
      {
        id: 'l4',
        slug: 'carp-poster',
        title: 'Carp poster, giclée print on 250 gsm matte paper',
        image: demoPhoto('carp-poster'),
        kind: 'stock',
        variantLabel: 'A3',
        unitCents: 1800,
        qty: 1,
        qtyLocked: false,
        leadDays: [2, 4],
        selected: false,
      },
    ],
  },
];

export type Totals = {
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  /** Ước tính — số chốt do Spring tính lúc đặt đơn, client chỉ để UX */
  taxCents: number;
  totalCents: number;
  shopCount: number;
  parcelCount: number;
  hasPhysical: boolean;
  hasDigital: boolean;
};

/**
 * Cộng CHỈ những dòng đang chọn.
 *
 * Phí ship tính theo NHÓM và chỉ tính khi nhóm đó còn ít nhất một dòng vật lý
 * được chọn — bỏ chọn hết áo thì không còn kiện nào để giao, phí ship phải về 0
 * ngay chứ không đợi tới checkout mới trừ.
 */
export function totals(groups: CartGroup[]): Totals {
  let subtotal = 0;
  let shipping = 0;
  let items = 0;
  let shops = 0;
  let parcels = 0;
  let hasPhysical = false;
  let hasDigital = false;

  for (const g of groups) {
    const picked = g.lines.filter((l) => l.selected);
    if (!picked.length) continue;
    shops++;

    const groupSubtotal = picked.reduce((s, l) => s + l.unitCents * l.qty, 0);
    subtotal += groupSubtotal;
    items += picked.reduce((s, l) => s + l.qty, 0);

    const physical = picked.filter((l) => l.kind !== 'file');
    if (physical.length) {
      hasPhysical = true;
      parcels++;
      const free =
        g.freeShippingOverCents !== null && groupSubtotal >= g.freeShippingOverCents;
      shipping += free ? 0 : g.shippingCents;
    }
    if (picked.some((l) => l.kind === 'file')) hasDigital = true;
  }

  const tax = Math.round(subtotal * 0.08);
  return {
    itemCount: items,
    subtotalCents: subtotal,
    shippingCents: shipping,
    taxCents: tax,
    totalCents: subtotal + shipping + tax,
    shopCount: shops,
    parcelCount: parcels,
    hasPhysical,
    hasDigital,
  };
}

/**
 * Kiện hàng để hiện ở bước vận chuyển.
 *
 * Một shop có cả áo lẫn file thì tách làm HAI kiện: kiện vật lý đi qua nhà vận
 * chuyển, "kiện" file giao ngay lúc thanh toán xong. Gộp chung thì không chọn
 * được phương thức vận chuyển riêng, và trạng thái hai bên khác nhau hoàn toàn.
 */
export type Parcel = {
  id: string;
  shopName: string;
  kind: 'physical' | 'digital';
  lines: CartLine[];
  options: { value: string; label: string; costCents: number }[];
};

export function parcels(groups: CartGroup[]): Parcel[] {
  const out: Parcel[] = [];
  for (const g of groups) {
    const picked = g.lines.filter((l) => l.selected);
    const physical = picked.filter((l) => l.kind !== 'file');
    const digital = picked.filter((l) => l.kind === 'file');

    if (physical.length) {
      out.push({
        id: `${g.shopSlug}-physical`,
        shopName: g.shopName,
        kind: 'physical',
        lines: physical,
        options: [
          { value: 'standard', label: 'Standard · 5–7 days', costCents: g.shippingCents },
          { value: 'express', label: 'Express · 2–3 days', costCents: g.shippingCents + 800 },
        ],
      });
    }
    if (digital.length) {
      out.push({
        id: `${g.shopSlug}-digital`,
        shopName: g.shopName,
        kind: 'digital',
        lines: digital,
        options: [{ value: 'instant', label: 'Download link sent immediately', costCents: 0 }],
      });
    }
  }
  return out;
}

export async function getCart(): Promise<CartGroup[]> {
  return CART;
}