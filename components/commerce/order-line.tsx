import Image from 'next/image';
import Link from 'next/link';
import { Truck, Download, Factory, CheckCircle2, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { Banner } from '@/components/shared/banner';
import { cn } from '@/lib/utils';
import { STATUS_LABEL, type LineStatus, type OrderLineData } from '@/lib/account';

/**
 * A9 · Dòng trạng thái đơn.
 *
 * **Rẽ theo DÒNG HÀNG, không rẽ theo ĐƠN.** Một đơn mua áo POD kèm file vector
 * đi cả hai nhánh cùng lúc: file được cấp quyền tải ngay khi thanh toán xong,
 * áo vẫn nằm chờ xưởng in. Gắn một trạng thái duy nhất cho cả đơn thì buộc phải
 * hiển thị sai một trong hai — và người mua sẽ tin cái sai đó.
 *
 * Bảng màu pill lấy từ ui-design.md §A9. Xanh lá chỉ dành cho "đã giao"; đừng
 * dùng nó cho "đang giao" chỉ vì nghe tích cực — người dùng quét màu trước khi
 * đọc chữ.
 */
const PILL_ICON: Record<LineStatus, typeof Truck> = {
  'awaiting-payment': Clock,
  'in-production': Factory,
  shipped: Truck,
  delivered: CheckCircle2,
  'action-needed': AlertTriangle,
  cancelled: XCircle,
};

export function StatusPill({ status }: { status: LineStatus }) {
  const Icon = PILL_ICON[status];
  return (
    <span className={cn('status-pill', `status-pill--${status}`)}>
      <Icon className="status-pill__icon" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function OrderLine({ line }: { line: OrderLineData }) {
  return (
    <li className="order-line">
      <div className="order-line__row">
        <Link href={`/product/${line.slug}`} className="order-line__thumb">
          <Image src={line.image} alt="" fill sizes="56px" className="order-line__image" />
        </Link>

        <div className="order-line__body">
          <Link href={`/product/${line.slug}`} className="order-line__title">
            {line.title}
          </Link>
          <p className="order-line__variant">
            {line.variantLabel && `${line.variantLabel} · `}Qty {line.qty}
          </p>

          <div className="order-line__status">
            <StatusPill status={line.status} />
            {line.tracking && (
              <span className="order-line__tracking">
                {line.tracking.carrier} {line.tracking.code} · arrives {line.tracking.etaLabel}
              </span>
            )}
          </div>
        </div>

        <div className="order-line__amount">
          <Money cents={line.unitCents * line.qty} size="sm" />
          <div className="order-line__amount-actions">
            {line.downloadId && (
              <Button asChild size="sm" variant="outline">
                <Link href="/account/downloads">
                  <Download className="order-line__action-icon" />
                  Download
                </Link>
              </Button>
            )}
            {line.tracking && (
              <Button size="sm" variant="ghost">
                Track parcel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Thông báo critical bắt buộc đủ ba phần: chuyện gì · vì sao · làm gì tiếp */}
      {line.issue && (
        <Banner
          tone="critical"
          className="order-line__issue"
          title={line.issue.what}
          action={<Button size="sm">Choose an option</Button>}
        >
          <p>{line.issue.why}</p>
          <p>{line.issue.next}</p>
        </Banner>
      )}
    </li>
  );
}

export function KindTag({ children }: { children: React.ReactNode }) {
  return <Badge>{children}</Badge>;
}
