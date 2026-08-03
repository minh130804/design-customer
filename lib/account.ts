/**
 * Dữ liệu sau khi mua: đơn hàng, kho tải về, sổ địa chỉ, danh sách yêu thích.
 *
 * Quyết định cấu trúc quan trọng nhất ở đây: **trạng thái nằm trên DÒNG HÀNG,
 * không nằm trên ĐƠN**. Một đơn mua áo POD kèm file vector đi hai nhánh cùng
 * lúc — file được cấp quyền tải ngay khi thanh toán xong, áo vẫn nằm chờ xưởng
 * in. Gắn một trạng thái duy nhất cho cả đơn thì phải chọn hiển thị sai một
 * trong hai.
 */

import type { FulfilmentKind } from './products';
import { demoPhoto } from './utils';

export type LineStatus =
  | 'awaiting-payment'
  | 'in-production'
  | 'shipped'
  | 'delivered'
  | 'action-needed'
  | 'cancelled';

export const STATUS_LABEL: Record<LineStatus, string> = {
  'awaiting-payment': 'Awaiting payment',
  'in-production': 'In production',
  shipped: 'On the way',
  delivered: 'Delivered',
  'action-needed': 'Action needed',
  cancelled: 'Cancelled',
};

export type OrderLineData = {
  id: string;
  slug: string;
  title: string;
  image: string;
  kind: FulfilmentKind;
  /** Không bắt buộc — hàng số không còn trục biến thể nào (xem `CartLine`) */
  variantLabel?: string;
  qty: number;
  unitCents: number;
  status: LineStatus;
  tracking?: { carrier: string; code: string; etaLabel: string };
  /** Chỉ hàng số — trỏ tới thẻ tải về tương ứng */
  downloadId?: string;
  /** Chỉ khi status = action-needed. Phải nói RÕ chuyện gì và làm gì tiếp. */
  issue?: { what: string; why: string; next: string };
};

export type Order = {
  id: string;
  placedAt: string;
  shopName: string;
  shopSlug: string;
  lines: OrderLineData[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  address: string | null;
  email: string;
  paymentLabel: string;
};

export const ORDERS: Order[] = [
  {
    id: '10231',
    placedAt: '2026-07-28',
    shopName: 'Lotus Studio',
    shopSlug: 'lotus-studio',
    address: 'Dana Reed · 118 Mission St, San Francisco, CA 94105, United States',
    email: 'dana@example.com',
    paymentLabel: 'Visa ending 4242',
    subtotalCents: 7200,
    shippingCents: 0,
    taxCents: 576,
    totalCents: 7776,
    lines: [
      {
        id: 'o1l1',
        slug: 'lotus-icon-pack',
        title: 'Lotus icon pack — 24 SVG and 24 PNG botanical icons',
        image: demoPhoto('lotus-icon-pack'),
        kind: 'file',
        qty: 1,
        unitCents: 990,
        status: 'delivered',
        downloadId: 'g-8821',
      },
      {
        id: 'o1l2',
        slug: 'lotus-tee',
        title: 'Lotus Tee, hand-drawn lotus print',
        image: demoPhoto('lotus-tee'),
        kind: 'pod',
        variantLabel: 'Black · M',
        qty: 2,
        unitCents: 2500,
        status: 'shipped',
        tracking: { carrier: 'SPX', code: 'SPX1234567890', etaLabel: 'Aug 2–Aug 6' },
      },
      {
        id: 'o1l3',
        slug: 'lotus-tote',
        title: 'Lotus tote bag, 12 oz natural canvas',
        image: demoPhoto('lotus-tote'),
        kind: 'pod',
        variantLabel: 'Natural',
        qty: 1,
        unitCents: 2200,
        status: 'in-production',
      },
    ],
  },
  {
    id: '10198',
    placedAt: '2026-07-11',
    shopName: 'Carp Atelier',
    shopSlug: 'carp-atelier',
    address: 'Dana Reed · 118 Mission St, San Francisco, CA 94105, United States',
    email: 'dana@example.com',
    paymentLabel: 'Visa ending 4242',
    subtotalCents: 1800,
    shippingCents: 490,
    taxCents: 144,
    totalCents: 2434,
    lines: [
      {
        id: 'o2l1',
        slug: 'carp-poster',
        title: 'Carp poster, giclée print on 250 gsm matte paper',
        image: demoPhoto('carp-poster'),
        kind: 'stock',
        variantLabel: 'A3',
        qty: 1,
        unitCents: 1800,
        status: 'action-needed',
        issue: {
          what: 'The print shop rejected this order — the A3 stock is out until Aug 12.',
          why: 'You were not charged again; the amount is still held on your card.',
          next: 'Choose A4 at the same price, wait for restock, or get a refund.',
        },
      },
    ],
  },
];

export type DownloadGrant = {
  id: string;
  orderId: string;
  title: string;
  image: string;

  purchasedAt: string;
  contents: string[];
  sizeLabel: string;
  used: number;
  limit: number;
  /** null = không hết hạn */
  expiresAt: string | null;
  revoked?: { reason: string; refundedCents: number };
};

export const DOWNLOADS: DownloadGrant[] = [
  {
    id: 'g-8821',
    orderId: '10231',
    title: 'Lotus icon pack',
    image: demoPhoto('lotus-icon-pack'),
    purchasedAt: '2026-07-28',
    contents: ['24 SVG', '24 PNG at 2000 px', '1 AI source'],
    sizeLabel: '22 MB',
    used: 2,
    limit: 5,
    expiresAt: null,
  },
  {
    id: 'g-8407',
    orderId: '10102',
    title: 'Botanical brush set for Procreate',
    image: demoPhoto('botanical-brush-set'),
    purchasedAt: '2026-05-02',
    contents: ['42 brushes', '1 PDF guide'],
    sizeLabel: '86 MB',
    used: 5,
    limit: 5,
    expiresAt: null,
  },
  {
    id: 'g-8100',
    orderId: '10044',
    title: 'Seal script display font',
    image: demoPhoto('seal-script-fonts'),
    purchasedAt: '2026-02-14',
    contents: ['3 OTF', '3 WOFF2'],
    sizeLabel: '4 MB',
    used: 1,
    limit: 5,
    expiresAt: '2026-08-14',
  },
];

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  isDefault: boolean;
  label: 'Home' | 'Work' | 'Other';
};

export const ADDRESSES: Address[] = [
  {
    id: 'a1',
    name: 'Dana Reed',
    phone: '+1 415 555 0132',
    line1: '118 Mission St',
    line2: 'Apt 4B',
    city: 'San Francisco',
    region: 'CA',
    postcode: '94105',
    country: 'United States',
    isDefault: true,
    label: 'Home',
  },
  {
    id: 'a2',
    name: 'Dana Reed',
    phone: '+1 415 555 0132',
    line1: '600 Montgomery St',
    city: 'San Francisco',
    region: 'CA',
    postcode: '94111',
    country: 'United States',
    isDefault: false,
    label: 'Work',
  },
];

export const formatAddress = (a: Address) =>
  [a.line1, a.line2, `${a.city}, ${a.region} ${a.postcode}`, a.country].filter(Boolean).join(', ');

export async function getOrders(): Promise<Order[]> {
  return ORDERS;
}

export async function getOrder(id: string): Promise<Order | null> {
  return ORDERS.find((o) => o.id === id) ?? null;
}

export async function getDownloads(): Promise<DownloadGrant[]> {
  return DOWNLOADS;
}