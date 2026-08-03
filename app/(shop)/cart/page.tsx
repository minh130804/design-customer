import type { Metadata } from 'next';
import { CartView } from '@/components/commerce/cart-view';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getCart } from '@/lib/cart';
import { PageTitle } from '@/components/shared/page-title';

export const metadata: Metadata = {
  title: 'Your cart — POD Market',
  robots: { index: false, follow: false },
};

/**
 * B7 · Giỏ hàng.
 *
 * Server component đọc giỏ rồi giao cho một client component duy nhất. Ranh
 * giới đặt ở đây chứ không sâu hơn: mọi thao tác trong giỏ (chọn dòng, đổi số
 * lượng, xoá) đều đổi tổng tiền, nên tách nhỏ hơn nữa chỉ tạo thêm chỗ để hai
 * bản sao trạng thái lệch nhau.
 */
export default async function CartPage() {
  const cart = await getCart();

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <PageTitle className="page__title--spaced">Your cart</PageTitle>
      <CartView initial={cart} />
    </>
  );
}
