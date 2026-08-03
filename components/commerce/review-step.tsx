'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { Banner } from '@/components/shared/banner';
import { KindBadge } from '@/components/shared/kind-badge';
import { OrderSummary } from '@/components/commerce/order-summary';
import { CART, parcels, totals } from '@/lib/cart';
import { ADDRESSES, formatAddress } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

/**
 * Bước 4 · Xem lại và đặt đơn.
 *
 * Mỗi khối có nút **Edit** trỏ về đúng bước sinh ra nó. Bắt người dùng bấm Back
 * ba lần để sửa một chữ trong địa chỉ là cách chắc chắn nhất để họ bỏ đơn ở
 * bước cuối — bước đắt nhất để mất.
 *
 * Nút đặt đơn **giữ nguyên bề rộng** khi đang xử lý và đổi chữ chứ không co
 * lại: nút co lại lúc bấm khiến người dùng tưởng bấm hụt và bấm lại, sinh đơn
 * trùng. Đây là lỗi tốn tiền thật, không phải chi tiết thẩm mỹ.
 */
export function ReviewStep({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const t = totals(CART);
  const list = parcels(CART);
  const address = ADDRESSES.find((a) => a.isDefault)!;
  const [placing, setPlacing] = React.useState(false);

  function place() {
    setPlacing(true);
    // Ở bản thật: POST /v1/orders → Spring khoá tồn kho, tính lại tiền, trả
    // orderId. Client KHÔNG được tự tính tổng rồi gửi lên.
    setTimeout(() => router.push('/order/10231'), 700);
  }

  return (
    <div className="checkout-grid">
      <div className="review-step__blocks">
        <PageTitle>Review your order</PageTitle>

        <Card>
          <CardBody>
            <div className="review-step__head">
              <div>
                <h2 className="review-step__block-title">
                  {t.hasPhysical ? 'Delivering to' : 'Sending the files to'}
                </h2>
                {signedIn ? (
                  <>
                    <p className="review-step__name">{address.name}</p>
                    <p className="review-step__detail">{formatAddress(address)}</p>
                  </>
                ) : (
                  <p className="review-step__guest-note">
                    The details you typed at the delivery step. Nothing is stored after this order —
                    that is the trade-off of checking out as a guest.
                  </p>
                )}
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/checkout/delivery">
                  <Pencil className="review-step__edit-icon" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="review-step__head">
              <h2 className="review-step__block-title">Paying with</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/checkout/payment">
                  <Pencil className="review-step__edit-icon" />
                  Edit
                </Link>
              </Button>
            </div>
            <p className="review-step__guest-note">Visa ending 4242</p>
          </CardBody>
        </Card>

        {list.map((p, i) => (
          <Card key={p.id}>
            <CardBody>
              <h2 className="review-step__parcel-title">
                Parcel {i + 1} · {p.shopName}
                <span className="review-step__parcel-mode">
                  {p.kind === 'digital' ? '· emailed instantly' : '· standard delivery'}
                </span>
              </h2>
              <ul className="parcel-lines">
                {p.lines.map((l) => (
                  <li key={l.id} className="parcel-lines__item">
                    <div className="parcel-lines__thumb">
                      <Image src={l.image} alt="" fill sizes="40px" className="parcel-lines__image" />
                    </div>
                    <div className="parcel-lines__body">
                      <p className="parcel-lines__title">{l.title}</p>
                      <p className="parcel-lines__meta">
                        {l.variantLabel && `${l.variantLabel} · `}Qty {l.qty}
                        <KindBadge kind={l.kind} />
                      </p>
                    </div>
                    <Money cents={l.unitCents * l.qty} size="sm" />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}

        {t.hasDigital && (
          <Banner tone="warning" title="Design files cannot be returned once downloaded">
            <p>
              This is shown here, before you pay, rather than buried in the terms. If a file turns
              out to be wrong and you have not downloaded it, you can still cancel.
            </p>
          </Banner>
        )}
      </div>

      <OrderSummary totals={t}>
        <Button block onClick={place} disabled={placing} className="review-step__place">
          {placing ? 'Placing your order…' : `Place order · ${(t.totalCents / 100).toFixed(2)} USD`}
        </Button>
      </OrderSummary>
    </div>
  );
}
