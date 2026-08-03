/**
 * Thông báo cho người mua.
 *
 * Ở dự án thật đây là client sinh từ OpenAPI (`GET /v1/notifications`), và số
 * chưa đọc đến qua một kênh riêng để không phải tải cả danh sách chỉ để vẽ một
 * chấm đỏ.
 *
 * ── Vì sao chỉ có SÁU loại, và không có loại nào là quảng cáo ────────────
 *
 * Hộp thông báo mất giá trị đúng vào lúc nó bắt đầu chứa thứ người dùng không
 * yêu cầu. Một khi họ học được rằng chấm đỏ thường là khuyến mại, họ ngừng bấm —
 * và ta mất luôn kênh nói những chuyện thật sự cần nói, như "đơn của bạn bị nhà
 * in từ chối".
 *
 * Nên mọi loại dưới đây đều là **hệ quả của một việc người dùng đã làm**: đã đặt
 * đơn, đã mua file, đã lưu món, đã theo shop. Không có loại "gợi ý cho bạn".
 *
 * ── `href` phải trỏ tới đúng chỗ giải quyết được việc đó ─────────────────
 *
 * Thông báo mà bấm vào chỉ ra một danh sách rồi để người dùng tự tìm là đã thất
 * bại một nửa. "Đơn cần xử lý" phải mở đúng đơn đó.
 */
export type NotificationKind =
  | 'shipped'
  | 'action-needed'
  | 'download-ready'
  | 'price-drop'
  | 'shop-update'
  | 'review-request';

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Ngày server chốt, không phải `Date.now()` ở client */
  at: string;
  read: boolean;
  /** Đường dẫn phải giải quyết được việc trong thông báo, không chỉ liệt kê */
  href: string;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'action-needed',
    title: 'Carp poster needs your decision',
    body: 'The print shop is out of A3 until Aug 12. Choose A4 at the same price, wait, or get a refund.',
    at: '2026-07-29',
    read: false,
    href: '/account/orders/10198',
  },
  {
    id: 'n2',
    kind: 'shipped',
    title: 'Your Lotus Tee is on the way',
    body: 'SPX1234567890 · arriving Aug 2–Aug 6.',
    at: '2026-07-29',
    read: false,
    href: '/account/orders/10231',
  },
  {
    id: 'n3',
    kind: 'download-ready',
    title: 'Lotus icon pack is ready to download',
    body: 'Five downloads, no expiry. It stays in your library.',
    at: '2026-07-28',
    read: false,
    href: '/account/downloads',
  },
  {
    id: 'n4',
    kind: 'price-drop',
    title: 'A saved item dropped in price',
    body: 'Carp enamel mug is now £14.00, down from £18.00.',
    at: '2026-07-26',
    read: true,
    href: '/account/favourites',
  },
  {
    id: 'n5',
    kind: 'shop-update',
    title: 'Paper North added 4 new files',
    body: 'New brush sets and a display face with full Vietnamese diacritics.',
    at: '2026-07-24',
    read: true,
    href: '/shop/paper-north',
  },
  {
    id: 'n6',
    kind: 'review-request',
    title: 'How was the Lotus icon pack?',
    body: 'You downloaded it three days ago. A sentence helps the next buyer.',
    at: '2026-07-22',
    read: true,
    href: '/account/orders/10231/review',
  },
];

export const unreadCount = (list: Notification[]) => list.filter((n) => !n.read).length;

export async function getNotifications(): Promise<Notification[]> {
  return NOTIFICATIONS;
}
