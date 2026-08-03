'use client';

import Link from 'next/link';
import { UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddressPicker, type DeliveryMode } from '@/components/commerce/address-picker';
import { OrderSummary } from '@/components/commerce/order-summary';
import { CART, totals } from '@/lib/cart';
import { ADDRESSES } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

/**
 * Bước 1 · Địa chỉ giao hàng — RẼ BA NHÁNH, TỰ ĐỘNG.
 *
 * Cây quyết định, và thứ tự hai câu hỏi là điểm mấu chốt:
 *
 *   Giỏ có dòng hàng vật lý nào không?
 *      ├── KHÔNG ──→ dạng C: tên + email (gõ hai lần)
 *      └── CÓ ────→ đã đăng nhập?          ← cookie phiên trả lời, KHÔNG hỏi
 *                     ├── rồi  ──→ dạng A: sổ địa chỉ
 *                     └── chưa ──→ dạng B: nhập tay 8 ô
 *
 * Hỏi về NỘI DUNG GIỎ trước, hỏi trạng thái đăng nhập sau. Câu hỏi thứ nhất rẻ
 * hơn và có thể loại bỏ hoàn toàn cả bước này lẫn bước chọn vận chuyển.
 *
 * `signedIn` đến từ cookie đọc ở SERVER (`lib/session.ts`), không phải từ một
 * lựa chọn người dùng phải bấm. Màn "How would you like to check out?" đã bị
 * bỏ vì nó hỏi một câu hệ thống tự trả lời được.
 *
 * Khách vãng lai vẫn thấy lời mời đăng nhập, nhưng ở dạng một dòng gợi ý cạnh
 * form — không phải một bức tường chắn giữa giỏ hàng và thanh toán.
 */
export function DeliveryStep({ signedIn, name }: { signedIn: boolean; name: string }) {
  const t = totals(CART);
  const pickerMode: DeliveryMode = !t.hasPhysical ? 'digital-only' : signedIn ? 'book' : 'manual';

  return (
    <div className="checkout-grid">
      <div>
        <div className="delivery-step__who">
          <p className="delivery-step__who-text">
            {signedIn ? (
              <>
                <UserCheck
                  className="delivery-step__who-icon delivery-step__who-icon--signed-in"
                  aria-hidden
                />
                Checking out as <span className="delivery-step__who-name">{name}</span>
                <Badge tone="trust">Signed in</Badge>
              </>
            ) : (
              <>
                <UserPlus className="delivery-step__who-icon" aria-hidden />
                Checking out as a <span className="delivery-step__who-name">guest</span>
              </>
            )}
          </p>

          {!signedIn && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/signin">Sign in for saved addresses</Link>
            </Button>
          )}
        </div>

        <PageTitle className="delivery-step__title">
          {pickerMode === 'digital-only' ? 'Where should we send the files?' : 'Delivery address'}
        </PageTitle>

        <AddressPicker mode={pickerMode} addresses={ADDRESSES} />

        <div className="delivery-step__actions">
          <Button asChild>
            <Link href="/checkout/payment">Continue to payment</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </div>
      </div>

      <OrderSummary totals={t} note="Shipping is chosen on the next step." />
    </div>
  );
}
