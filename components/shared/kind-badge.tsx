import { Download, Package, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FulfilmentKind } from '@/lib/products';

/**
 * A2 · Nhãn kiểu hàng.
 *
 * Điểm quan trọng nhất của component này: **buyer và seller thấy hai bộ chữ
 * khác nhau cho cùng một mã.**
 *
 *   mã       seller thấy        buyer thấy
 *   stock    "In stock"         (không hiện nhãn) — chỉ hiện "Ships in 2–4 days"
 *   pod      "Printed to order" (không hiện nhãn) — chỉ hiện "Made for you"
 *   file     "Design file"      "INSTANT DOWNLOAD"  ← BẮT BUỘC hiện
 *
 * Buyer không cần biết hàng được in ở đâu, họ cần biết bao giờ nhận. Nhưng
 * **hàng số phải gắn nhãn rõ** vì mua nhầm thì buyer ngồi đợi một kiện hàng
 * không bao giờ tới — và đó là loại khiếu nại tốn tiền nhất để xử lý.
 *
 * Vì vậy `audience="buyer"` mặc định TRẢ VỀ NULL với `stock` và `pod`. Đó là
 * hành vi đúng, không phải thiếu sót.
 */
export function KindBadge({
  kind,
  audience = 'buyer',
  force,
}: {
  kind: FulfilmentKind;
  audience?: 'buyer' | 'seller';
  /** Ép hiện cả ba nhãn — chỉ dùng ở trang chi tiết, nơi có chỗ giải thích */
  force?: boolean;
}) {
  if (audience === 'buyer' && kind !== 'file' && !force) return null;

  const map = {
    stock: { label: audience === 'buyer' ? 'Ships in 2–4 days' : 'In stock', Icon: Package },
    pod: { label: audience === 'buyer' ? 'Made for you' : 'Printed to order', Icon: Printer },
    file: { label: audience === 'buyer' ? 'Instant download' : 'Design file', Icon: Download },
  } as const;

  const { label, Icon } = map[kind];
  return (
    <Badge tone={kind}>
      <Icon className="kind-badge__icon" aria-hidden />
      {label}
    </Badge>
  );
}
