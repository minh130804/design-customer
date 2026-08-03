import type { Metadata } from 'next';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { EmptyState } from '@/components/shared/empty-state';
import { OrderLine } from '@/components/commerce/order-line';
import { getOrders } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

export const metadata: Metadata = {
  title: 'Your orders — POD Market',
  robots: { index: false, follow: false },
};

/**
 * B15 · Lịch sử đơn.
 *
 * Mỗi đơn là một thẻ, và **mỗi DÒNG trong đơn có trạng thái riêng** — xem
 * `OrderLine`. Một đơn ba dòng có thể vừa "đã giao" (file), vừa "đang giao"
 * (áo đã in xong), vừa "đang sản xuất" (túi) cùng lúc, và đó là chuyện bình
 * thường của sàn POD chứ không phải trường hợp biên.
 *
 * Không có bộ lọc trạng thái ở đây. Người mua có vài đơn, không phải vài trăm;
 * một bộ lọc là thêm một quyết định phải đưa ra trước khi thấy được thứ mình
 * cần. Bộ lọc thuộc về phía seller, nơi bảng có bốn chữ số dòng.
 */
export default async function OrdersPage() {
  const orders = await getOrders();

  if (!orders.length) {
    return (
      <EmptyState
        icon={<Package className="page__empty-icon" />}
        title="No orders yet"
        action={
          <Button asChild>
            <Link href="/">Browse the marketplace</Link>
          </Button>
        }
      >
        Once you buy something, the parcel and its tracking number show up here.
      </EmptyState>
    );
  }

  return (
    <>
      <PageTitle className="page__title">Your orders</PageTitle>

      <div className="page__stack">
        {orders.map((o) => (
          <Card key={o.id}>
            <div className="order-card__head">
              <div>
                <h2 className="order-card__title">
                  Order #{o.id} · {o.shopName}
                </h2>
                <p className="order-card__meta">
                  Placed {o.placedAt} · {o.lines.length} {o.lines.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="order-card__actions">
                <Money cents={o.totalCents} />
                <Button asChild size="sm" variant="outline">
                  <Link href={`/account/orders/${o.id}`}>View order</Link>
                </Button>
              </div>
            </div>

            <ul>
              {o.lines.map((l) => (
                <OrderLine key={l.id} line={l} />
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
