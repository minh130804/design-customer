import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { OrderLine } from '@/components/commerce/order-line';
import { getOrder, ORDERS } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

type Params = { params: Promise<{ id: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export async function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }));
}

/**
 * B16 · Chi tiết đơn và theo dõi.
 *
 * Bố cục hai cột 2 : 1 — dòng hàng bên trái, số tiền và địa chỉ bên phải.
 *
 * Bảng tiền ở đây phải **cộng tay ra đúng tổng**. Người mua mở lại đơn cũ
 * thường là vì đang thắc mắc về một con số; nếu các dòng không cộng đúng thì
 * thắc mắc đó thành một ticket, và ticket đó tốn nhiều hơn cả lợi nhuận của đơn.
 */
export default async function OrderDetailPage({ params }: Params) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <>
      <div className="order-detail__head">
        <PageTitle>Order #{order.id}</PageTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/account/orders">Back to all orders</Link>
        </Button>
      </div>

      <div className="checkout-grid">
        <Card>
          <div className="order-detail__lines-head">
            <h2 className="order-detail__lines-title">
              {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'} from{' '}
              <Link href={`/shop/${order.shopSlug}`} className="order-detail__shop-link">
                {order.shopName}
              </Link>
            </h2>
            <p className="order-detail__placed">Placed {order.placedAt}</p>
          </div>
          <ul>
            {order.lines.map((l) => (
              <OrderLine key={l.id} line={l} />
            ))}
          </ul>
        </Card>

        <div className="order-detail__aside">
          <Card>
            <CardBody>
              <h2 className="order-detail__panel-title">Payment</h2>
              <dl className="order-detail__rows">
                <Row term="Items">
                  <Money cents={order.subtotalCents} size="sm" />
                </Row>
                <Row term="Shipping">
                  {order.shippingCents === 0 ? (
                    <span className="order-detail__free">Free</span>
                  ) : (
                    <Money cents={order.shippingCents} size="sm" />
                  )}
                </Row>
                <Row term="Sales tax">
                  <Money cents={order.taxCents} size="sm" />
                </Row>
              </dl>
              <div className="order-detail__total">
                <span className="order-detail__total-label">Total paid</span>
                <Money cents={order.totalCents} />
              </div>
              <p className="order-detail__fineprint">{order.paymentLabel}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="order-detail__panel-title">Delivery</h2>
              <p className="order-detail__delivery">
                {order.address ?? 'Digital order — nothing was shipped.'}
              </p>
              <p className="order-detail__fineprint">Receipts sent to {order.email}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="order-detail__panel-title">Need help?</h2>
              <div className="order-detail__help">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/account/orders/${order.id}/review`}>Write a review</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  Message the shop
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/account/orders/${order.id}/return`}>Start a return</Link>
                </Button>
              </div>
              <p className="order-detail__fineprint">
                Design files cannot be returned once downloaded — that limit is shown before you
                buy, not after.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="order-detail__row">
      <dt className="order-detail__term">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
