import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dải quảng bá giữa trang — nền tối, không có sản phẩm nào bên trong.
 *
 * ── Vì sao KHÔNG nhét lưới sản phẩm vào đây ─────────────────────────────
 *
 * Trang chủ chỉ còn đúng một dải hàng nổi bật. Thêm một lưới nữa ở đây là quay
 * lại chỗ cũ: một trang chủ liệt kê gần hết kho hàng, nơi mọi thứ đều được
 * nhấn nên chẳng thứ gì được nhấn. Dải này làm đúng một việc — nói cho người
 * chưa biết rằng sàn có hàng số, rồi đưa họ sang trang lọc.
 *
 * ── Vì sao nền tối ─────────────────────────────────────────────────────
 *
 * Trang chủ chạy trên nền trắng và kem. Một mảng tối là cách rẻ nhất để tách
 * dải này ra khỏi mạch cuộn mà không cần thêm viền hay khoảng trắng lớn. Chữ
 * trắng trên `--color-ink` đạt 15.9 : 1, thoải mái trên ngưỡng AA.
 *
 * Hình trang trí là hai vòng tròn mờ dựng bằng utility Tailwind, không phải
 * ảnh: không thêm một lượt tải nào, và không bao giờ lệch màu với token.
 */
export function PromoBand({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: Route;
  cta: string;
}) {
  return (
    <section className="promo-band">
      {/* Hai vòng tròn tràn mép — thuần trang trí, nên `aria-hidden`. */}
      <span
        aria-hidden
        className="promo-band__blob promo-band__blob--brand"
      />
      <span
        aria-hidden
        className="promo-band__blob promo-band__blob--light"
      />

      <div className="promo-band__inner">
        <div className="promo-band__copy">
          <p className="promo-band__eyebrow">
            <Download className="promo-band__eyebrow-icon" aria-hidden />
            {eyebrow}
          </p>
          <h2 className="promo-band__title">{title}</h2>
          <p className="promo-band__text">{body}</p>
        </div>

        <Button
          asChild
          className="btn--on-dark"
        >
          <Link href={href}>
            {cta}
            <ArrowRight className="promo-band__cta-icon" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
