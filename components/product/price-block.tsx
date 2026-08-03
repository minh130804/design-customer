import { Money } from '@/components/shared/money';
import { formatUsd } from '@/lib/utils';

/**
 * Khối giá — thứ TO NHẤT trên trang, 27.01px, to hơn cả `<h1>`.
 *
 * Không phải lỗi phân cấp: người mua vừa bấm vào từ ảnh trong lưới tìm kiếm nên
 * đã biết đang xem cái gì. Cái họ chưa biết là giá. Xem etsy-product-page.md §2.
 *
 * Giá gạch và phần trăm giảm phải tính từ CÙNG một cặp số nguyên cent — nếu
 * backend gửi sẵn chuỗi "10% off" thì sớm muộn nó sẽ lệch với giá thật, và
 * lệch ở đúng chỗ không ai kiểm.
 *
 * Nhãn giảm giá là VIÊN THUỐC xanh, không phải chữ đỏ: đỏ ở đây sẽ đụng với
 * `text-critical` vốn dành cho lỗi và cảnh báo. Xanh `text-money` là màu của
 * tiền trong hệ thống này, và "bạn tiết kiệm được" đúng là chuyện tiền.
 */
export function PriceBlock({
  priceCents,
  compareAtCents,
  shippingCents,
  saleLabel,
}: {
  priceCents: number;
  compareAtCents: number | null;
  /** Phí giao — dùng để in dòng "… incl. shipping" ngay dưới giá */
  shippingCents: number;
  saleLabel?: string;
}) {
  const off =
    compareAtCents && compareAtCents > priceCents
      ? Math.round(((compareAtCents - priceCents) / compareAtCents) * 100)
      : 0;

  return (
    <div>
      <div className="price-block__row">
        <p>
          <span className="sr-only">Price: </span>
          <Money cents={priceCents} size="hero" />
        </p>

        {off > 0 && compareAtCents && (
          <>
            <p>
              <span className="sr-only">Original price: </span>
              <Money cents={compareAtCents} tone="struck" size="sm" />
            </p>
            <span className="price-block__off">
              {off}% off
            </span>
          </>
        )}
      </div>

      {/* Tổng đã gồm phí giao, in NGAY dưới giá.
          Etsy làm vậy vì phí giao lộ ra ở bước cuối là nguyên nhân bỏ giỏ hàng
          hàng đầu — nói trước thì mất một phần lượt bấm, nói sau thì mất đơn. */}
      <p className="price-block__note">
        {shippingCents === 0 ? (
          <span className="price-block__free">Free shipping</span>
        ) : (
          <>{formatUsd(priceCents + shippingCents)} incl. shipping</>
        )}
        {' · '}Sales tax included where applicable
      </p>

      {off > 0 && saleLabel && (
        <p className="price-block__sale">{saleLabel}</p>
      )}
    </div>
  );
}
