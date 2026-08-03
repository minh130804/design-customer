import { ProductCard } from './product-card';
import type { Listing } from '@/lib/catalog';
import { cn } from '@/lib/utils';

/**
 * L2 · Lưới duyệt — **2 cột, lên 4 cột tại 900px**. Không có bậc nào khác.
 *
 * Đây là nguyên văn luật của Etsy, không phải suy đoán. Trong bản lưu trang chủ
 * (figma/research/etsy-home-20260727.html), mọi thẻ `v2-listing-card` đều nằm
 * trong một phần tử mang đúng hai lớp:
 *
 *     wt-grid__item-xs-6   →  flex-basis 50%     →  2 cột (mặc định)
 *     wt-grid__item-lg-3   →  flex-basis 25%     →  4 cột (từ 900px)
 *
 * Lưới của Collage là 12 cột, nên 6/12 và 3/12 dịch thẳng ra 2 và 4. Đáng chú ý
 * là thứ KHÔNG có: không bậc 3 cột ở khoảng giữa, không bậc 5 cột ở màn rộng.
 * Sàn bán đồ nhìn-là-mua đánh đổi số lượng thẻ lấy kích thước ảnh, và họ chọn
 * ảnh to. Ở container 1400px, 4 cột cho thẻ ~336px — cỡ thật của Etsy.
 *
 * Hai cột trên điện thoại chứ không phải một: thẻ một cột chiếm hết màn hình
 * khiến người dùng chỉ thấy được một sản phẩm mỗi lần cuộn, và trên sàn thì
 * việc SO SÁNH mới là thứ giữ chân họ.
 *
 * `priority` chỉ đặt cho ba thẻ đầu — đó là những thẻ nằm trên nếp gấp và tính
 * vào LCP. Đặt cho cả lưới thì trình duyệt tải song song 20 ảnh và LCP tệ hơn
 * là không đặt gì.
 */
export function ProductGrid({
  listings,
  className,
}: {
  listings: Listing[];
  className?: string;
}) {
  return (
    <div className={cn('product-grid', className)}>
      {listings.map((l, i) => (
        <ProductCard key={l.slug} listing={l} priority={i < 3} />
      ))}
    </div>
  );
}
