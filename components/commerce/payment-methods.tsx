'use client';

import * as React from 'react';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { RadioCard } from '@/components/ui/radio-card';
import { Field } from '@/components/shared/field';

/**
 * Bước 5 · Phương thức thanh toán.
 *
 * Quy tắc quan trọng nhất: **COD bị ẩn HOÀN TOÀN khi giỏ toàn hàng số** — không
 * phải hiện rồi báo lỗi sau khi chọn.
 *
 * Lý do không phải là gọn gàng mà là logic: COD nghĩa là "thu tiền khi giao";
 * hàng số giao ngay lúc thanh toán nên không tồn tại thời điểm nào để thu. Hiện
 * một lựa chọn rồi từ chối nó là bắt người dùng học một luật mà ta có thể đơn
 * giản là không tạo ra.
 *
 * Với giỏ HỖN HỢP thì COD vẫn hiện, kèm chú thích rõ "chỉ áp dụng cho kiện vật
 * lý" — vì lúc đó nó thật sự áp dụng được cho một phần đơn.
 */
export type PayMethod = 'card' | 'wallet' | 'cod';

export function PaymentMethods({
  hasPhysical,
  hasDigital,
  value,
  onChange,
}: {
  hasPhysical: boolean;
  hasDigital: boolean;
  value: PayMethod;
  onChange: (v: PayMethod) => void;
}) {
  const codAvailable = hasPhysical;
  const codPartial = hasPhysical && hasDigital;

  return (
    <div className="payment-methods">
      <RadioCard
        name="pay"
        value="card"
        checked={value === 'card'}
        onChange={() => onChange('card')}
        label={
          <span className="payment-methods__label">
            <CreditCard className="payment-methods__icon" aria-hidden />
            Card
          </span>
        }
        description="Visa, Mastercard, Amex. Charged when you place the order."
      >
        {value === 'card' && (
          <div className="payment-methods__card-fields">
            <Field className="payment-methods__card-number" label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
            <Field label="Expiry" placeholder="MM / YY" inputMode="numeric" autoComplete="cc-exp" />
            <Field label="Security code" placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
          </div>
        )}
      </RadioCard>

      <RadioCard
        name="pay"
        value="wallet"
        checked={value === 'wallet'}
        onChange={() => onChange('wallet')}
        label={
          <span className="payment-methods__label">
            <Wallet className="payment-methods__icon" aria-hidden />
            Digital wallet
          </span>
        }
        description="You will be redirected to confirm, then brought straight back here."
      />

      {codAvailable && (
        <RadioCard
          name="pay"
          value="cod"
          checked={value === 'cod'}
          onChange={() => onChange('cod')}
          label={
            <span className="payment-methods__label">
              <Banknote className="payment-methods__icon" aria-hidden />
              Cash on delivery
            </span>
          }
          description={
            codPartial
              ? 'Applies to the shipped parcels only. Design files are charged now, because they are delivered now.'
              : 'Pay the courier when the parcel arrives.'
          }
        />
      )}
    </div>
  );
}
