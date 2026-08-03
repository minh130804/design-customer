import type { Metadata } from 'next';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/shared/field';
import { Banner } from '@/components/shared/banner';
import { PageTitle } from '@/components/shared/page-title';

export const metadata: Metadata = {
  title: 'Track an order — POD Market',
  robots: { index: false, follow: false },
};

/**
 * B17 · Tra cứu đơn cho khách vãng lai — L6 bố cục một cột.
 *
 * Đây là màn phải có nếu đã cho mua không cần tài khoản. Không có nó thì mọi
 * khách vãng lai muốn biết đơn của mình tới đâu đều phải nhắn cho bộ phận hỗ
 * trợ, và đó là chi phí lặp lại trên từng đơn.
 *
 * Hỏi **email + mã đơn**, không phải chỉ một trong hai. Chỉ mã đơn thì ai đoán
 * được số cũng xem được địa chỉ nhà người khác; chỉ email thì lộ toàn bộ lịch
 * sử mua của một địa chỉ email bất kỳ.
 *
 * Route tĩnh `/order/lookup` đứng trước route động `/order/[id]` — Next ưu tiên
 * đoạn tĩnh, nên không có xung đột.
 */
export default function OrderLookupPage() {
  return (
    <div className="page__focus">
      <PageTitle>Track an order</PageTitle>
      <p className="page__lede--under-title">
        Bought without an account? Enter the order number from your receipt email.
      </p>

      <Card className="page__card">
        <CardBody>
          <Field
            label="Order number"
            placeholder="10231"
            inputMode="numeric"
            hint="Six digits, at the top of the receipt email."
          />
          <Field
            label="Email used on the order"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Button block>Find my order</Button>
        </CardBody>
      </Card>

      <Banner tone="info" className="page__notice--after" title="Why we ask for both">
        <p>
          The order number alone would let anyone who guesses a number read a stranger&rsquo;s
          delivery address. The email alone would expose every order ever placed from that address.
        </p>
      </Banner>
    </div>
  );
}
