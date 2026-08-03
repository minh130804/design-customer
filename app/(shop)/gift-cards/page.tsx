import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageTitle } from '@/components/shared/page-title';
import { GiftCardForm } from '@/components/gift/gift-card-form';

export const metadata: Metadata = {
  title: 'Gift cards — POD Market',
  description:
    'Send a POD Market gift card by email or print it yourself. Never expires, spendable across every shop.',
};

/**
 * Trang mua thẻ quà tặng.
 *
 * ── Vì sao là một trang riêng, không phải một sản phẩm trong danh mục ────
 *
 * Thẻ quà tặng không có biến thể, không phí giao, không thời gian in, không đổi
 * trả, và **không thuộc shop nào** — sàn phát hành chứ không phải người bán.
 * Nhét nó vào `LISTINGS` là bắt mọi hàm lọc và mọi thẻ sản phẩm mang thêm một
 * ngoại lệ, đổi lại chỉ để dùng lại một cái lưới.
 *
 * `today` chốt ở server rồi truyền xuống: trang này tĩnh, và lấy `new Date()` ở
 * client thì máy lệch múi giờ sẽ chọn được ngày gửi trong quá khứ.
 */
export default function GiftCardsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Gift cards' }]} />

      <div className="gift-cards-page__intro">
        <PageTitle size="display">Give them the choosing</PageTitle>
        <p className="gift-cards-page__lede">
          A gift card works in every shop on the marketplace — printed items, made-to-order pieces
          and instant downloads alike. It never expires, and any unspent balance stays on the card.
        </p>
      </div>

      <div className="gift-cards-page__form">
        <GiftCardForm today="2026-07-30" />
      </div>
    </>
  );
}
