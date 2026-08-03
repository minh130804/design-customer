import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { StarRating } from '@/components/product/star-rating';
import { Money } from '@/components/shared/money';
import { KindBadge } from '@/components/shared/kind-badge';
import { VideoBadge } from '@/components/product/media-frame';
import { Badge } from '@/components/ui/badge';
import { cn, deliveryWindow } from '@/lib/utils';
import type { Listing } from '@/lib/catalog';

/**
 * A5 · Thẻ sản phẩm — component quan trọng nhất phía buyer. Nó xuất hiện ở
 * trang chủ, danh mục, tìm kiếm và trang shop, nên mỗi quyết định ở đây được
 * nhân lên vài chục lần trên một màn.
 *
 * THỨ TỰ THÔNG TIN: ảnh → tên → **tín nhiệm → giá** → shop → thời gian giao.
 *
 * Giá đứng SAU đánh giá, và đây là quyết định có hậu quả kinh doanh chứ không
 * phải thẩm mỹ. Trên sàn nhiều người bán, câu hỏi đầu tiên của buyer là "có
 * đáng tin không", không phải "bao nhiêu tiền". Đặt giá lên trước biến sàn
 * thành nơi so giá, và người bán rẻ nhất luôn thắng — hại chính những seller
 * làm tốt mà ta cần giữ.
 *
 * Nhãn tín nhiệm do **hệ thống cấp**, seller không tự gắn được. Nhãn nào seller
 * tự khai thì mất giá trị ngay trong tuần đầu.
 *
 * Toàn bộ thẻ là một liên kết, nút yêu thích nằm NGOÀI liên kết đó — lồng
 * `<button>` trong `<a>` là HTML không hợp lệ và trên Safari nó nuốt luôn cú
 * bấm vào tim.
 */
export function ProductCard({
  listing,
  priority,
  className,
}: {
  listing: Listing;
  /** Chỉ đặt true cho 2–4 thẻ đầu màn — LCP. Đặt cho cả lưới là tự bắn vào chân. */
  priority?: boolean;
  className?: string;
}) {
  const off =
    listing.compareAtCents && listing.compareAtCents > listing.priceCents
      ? Math.round(((listing.compareAtCents - listing.priceCents) / listing.compareAtCents) * 100)
      : 0;

  return (
    <article className={cn('product-card', className)}>
      <div className="product-card__media">
        <Image
          src={listing.image}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
          priority={priority}
          className="product-card__image"
        />

        {/* Ảnh đại diện dạng chuyển động — hiện đè lên ảnh tĩnh khi rê chuột.
            Trạng thái hover đi qua bộ chọn con trong `.product-card__motion`,
            không qua `useState`, để `ProductCard` vẫn là Server Component.

            `loading="lazy"` nên tệp chỉ tải khi thẻ tới gần khung nhìn. */}
        {listing.motion && (
          <Image
            src={listing.motion}
            alt=""
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 20vw"
            className="product-card__motion"
          />
        )}

        <span aria-hidden className="product-card__veil" />

        {listing.kind === 'file' && (
          <div className="product-card__kind">
            <KindBadge kind="file" />
          </div>
        )}

        {/* Nhãn tam giác báo thẻ này có clip. Không có nó, người dùng chỉ thấy
            một ảnh tĩnh nữa và không có lý do gì để rê chuột vào. */}
        {listing.motion && <VideoBadge className="product-card__video" />}
      </div>

      <button
        type="button"
        aria-label={`Add ${listing.title} to favourites`}
        className="product-card__fav"
      >
        <Heart className="product-card__fav-icon" />
      </button>

      <div className="product-card__body">
        <h3 className="product-card__title">
          <Link href={`/product/${listing.slug}`} className="product-card__link">
            {listing.title}
          </Link>
        </h3>

        {/* tín nhiệm TRƯỚC giá */}
        <div className="product-card__trust">
          <StarRating value={listing.rating} count={listing.reviewCount} />
          {listing.badges.includes('bestseller') && (
            <Badge tone="trust" className="product-card__bestseller">
              Bestseller
            </Badge>
          )}
        </div>

        <div className="product-card__prices">
          <Money cents={listing.priceCents} size="lg" />
          {off > 0 && listing.compareAtCents && (
            <>
              <Money cents={listing.compareAtCents} tone="struck" size="sm" />
              <span className="product-card__off">{off}% off</span>
            </>
          )}
        </div>

        <p className="product-card__shop">
          {listing.shopName}
          {listing.badges.includes('star-seller') && (
            <span className="product-card__star-seller">· Star Seller</span>
          )}
        </p>

        {/* Etsy không hứa "5–7 ngày" mà in ra một KHOẢNG NGÀY cụ thể. Khoảng
            ngày kiểm chứng được sau khi hàng tới; "5–7 ngày" thì không. */}
        <p className="product-card__delivery">
          {listing.leadDays ? (
            <>Arrives {deliveryWindow('2026-07-29', listing.leadDays[0], listing.leadDays[1])}</>
          ) : (
            <>Download available immediately</>
          )}
          {listing.freeShipping && listing.leadDays && (
            <span className="product-card__free"> · Free shipping</span>
          )}
        </p>
      </div>
    </article>
  );
}
