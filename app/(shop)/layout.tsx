import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getCart } from '@/lib/cart';

/**
 * L1 · Vỏ marketplace — bọc mọi màn MUA SẮM.
 *
 * Checkout nằm ở nhóm route khác (`app/(checkout)`) và cố tình KHÔNG dùng vỏ
 * này: ở bước thanh toán, mỗi liên kết điều hướng là một lối thoát khỏi phễu.
 * Etsy cũng bỏ toàn bộ header ở checkout, chỉ chừa logo.
 *
 * Nhóm route `(shop)` không xuất hiện trong URL — `/cart` vẫn là `/cart`.
 */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const cart = await getCart();
  const count = cart.reduce((s, g) => s + g.lines.reduce((n, l) => n + l.qty, 0), 0);

  return (
    <>
      <SiteHeader cartCount={count} />
      <main className="shop-shell__main">{children}</main>
      <SiteFooter />
    </>
  );
}
