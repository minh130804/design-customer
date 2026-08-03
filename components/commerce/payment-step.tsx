'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShipmentPicker } from '@/components/commerce/shipment-picker';
import { PaymentMethods, type PayMethod } from '@/components/commerce/payment-methods';
import { GiftRedeem } from '@/components/commerce/gift-redeem';
import { OrderSummary } from '@/components/commerce/order-summary';
import { CART, parcels, totals } from '@/lib/cart';
import { PageTitle } from '@/components/shared/page-title';

/**
 * Bước 3 · Vận chuyển và thanh toán.
 *
 * Hai khối trên một màn vì chúng ràng buộc nhau: chọn COD chỉ hợp lệ khi có
 * kiện vật lý, và phí vận chuyển đổi thì tổng tiền phải đổi ngay dưới mắt người
 * dùng. Tách ra hai bước thì người dùng phải nhớ con số ở bước trước.
 *
 * Phí vận chuyển do `ShipmentPicker` đẩy ngược lên qua `onTotalChange` — trạng
 * thái nằm ở component CHA vì tổng tiền là thứ cả hai khối cùng đọc. Đặt ở con
 * rồi đồng bộ ngược là cách tạo ra hai nguồn sự thật.
 */
export function PaymentStep() {
  const base = totals(CART);
  const list = parcels(CART);

  const [shipCents, setShipCents] = React.useState(base.shippingCents);
  const [method, setMethod] = React.useState<PayMethod>('card');
  const [giftCents, setGiftCents] = React.useState(0);

  // Thẻ quà tặng trừ vào tổng SAU thuế và phí giao, và không bao giờ đẩy tổng
  // xuống dưới 0 — phần dư ở lại trên thẻ chứ không hoàn thành tiền mặt.
  const gross = base.subtotalCents + shipCents + base.taxCents;
  const t = {
    ...base,
    shippingCents: shipCents,
    totalCents: Math.max(0, gross - giftCents),
  };

  return (
    <div className="checkout-grid">
      <div>
        <PageTitle className="payment-step__title">Delivery and payment</PageTitle>
        <p className="payment-step__intro">
          Your order splits into {list.length} {list.length === 1 ? 'parcel' : 'parcels'}. Each one
          travels separately, so each one gets its own delivery choice.
        </p>

        <ShipmentPicker parcels={list} onTotalChange={setShipCents} />

        <div className="payment-step__gift">
          <GiftRedeem onApply={setGiftCents} />
        </div>

        <h2 className="payment-step__pay-title">How would you like to pay?</h2>
        <PaymentMethods
          hasPhysical={base.hasPhysical}
          hasDigital={base.hasDigital}
          value={method}
          onChange={setMethod}
        />

        <div className="payment-step__actions">
          <Button asChild>
            <Link href="/checkout/review">Review your order</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/checkout/delivery">Back to delivery</Link>
          </Button>
        </div>
      </div>

      <OrderSummary totals={t} note="Nothing is charged until you place the order." />
    </div>
  );
}
