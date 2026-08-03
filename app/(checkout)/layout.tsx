import Link from 'next/link';
import { Lock } from 'lucide-react';
import { CheckoutSteps } from '@/components/commerce/checkout-steps';

/**
 * L4 · Bố cục checkout — CỐ TÌNH không có vỏ marketplace.
 *
 * Không thanh tìm kiếm, không dải danh mục, không chân trang nhiều cột. Ở bước
 * thanh toán, mỗi liên kết điều hướng là một lối thoát khỏi phễu; Etsy cũng bỏ
 * hết header ở checkout và chỉ chừa logo.
 *
 * Logo vẫn bấm được về trang chủ — đó là lối ra hợp lệ duy nhất, và chặn nó lại
 * làm người dùng thấy bị nhốt, thứ còn hại hơn.
 *
 * Dòng "Secure checkout" là chữ tĩnh cạnh biểu tượng khoá, không phải huy hiệu
 * nhấp nháy. Huy hiệu bảo mật động trông giống quảng cáo hơn là bảo đảm.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="checkout-shell__header">
        <div className="checkout-shell__inner">
          <Link
            href="/"
            className="checkout-shell__logo"
          >
            POD Market
          </Link>
          <p className="checkout-shell__secure">
            <Lock className="checkout-shell__secure-icon" aria-hidden />
            Secure checkout
          </p>
        </div>
      </header>

      <div className="checkout-shell__steps">
        <div className="checkout-shell__steps-inner">
          <CheckoutSteps />
        </div>
      </div>

      <main className="checkout-shell__main">{children}</main>
    </>
  );
}
