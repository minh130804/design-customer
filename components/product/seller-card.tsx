import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { MessageCircle, Truck, Zap, Star, Heart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { StarRating } from './star-rating';
import type { Product } from '@/lib/products';
import type { Listing } from '@/lib/catalog';

const BADGE_ICON = { 'Smooth shipping': Truck, 'Speedy replies': Zap } as const;

/**
 * Thẻ người bán — một khối có viền, đặt ở CỘT TRÁI dưới phần đánh giá.
 *
 * Etsy đặt nó ở cột trái chứ không phải trong dải accordion bên phải, và điều
 * đó đúng: cột phải là nơi để MUA, mọi thứ ở đó phải phục vụ quyết định mua.
 * Người đọc tới đây đã cuộn qua hết ảnh và đánh giá, tức là họ đang cân nhắc
 * "shop này có đáng tin không" — một câu hỏi cần chỗ, không nhét vừa một dòng
 * accordion.
 *
 * Các chỉ số ở đây (điểm shop, số đơn, số năm, huy hiệu) do HỆ THỐNG tính từ
 * dữ liệu đơn hàng, seller không tự khai và không sửa được. Nếu để seller tự
 * nhập thì cả khối này mất sạch giá trị — và người mua học được điều đó rất
 * nhanh, sau đó bỏ qua toàn bộ khối.
 *
 * Huy hiệu *Rave reviews* tính tại chỗ từ điểm shop chứ không nằm trong dữ
 * liệu: nó là hàm của một con số đã có, và lưu thêm một cờ nữa chỉ tạo cơ hội
 * để cờ đó lệch với điểm thật.
 */
export function SellerCard({
  shop,
  listings,
}: {
  shop: Product['shop'];
  /** Hàng khác của cùng shop — dải "More from this shop" ở đáy thẻ */
  listings: Listing[];
}) {
  const badges = [
    ...shop.badges,
    ...(shop.rating >= 4.8
      ? [{ title: 'Rave reviews', body: 'Average review rating is 4.8 or higher.' }]
      : []),
  ];

  return (
    <section className="seller-card">
      <div className="seller-card__head">
        <div className="seller-card__identity">
          <Avatar className="seller-card__avatar">
            <AvatarFallback className="seller-card__avatar-fallback">
              {shop.owner.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="seller-card__identity-text">
            <h2 className="seller-card__name">
              {shop.owner}{' '}
              <Link
                href={`/shop/${shop.slug}` as Route}
                className="seller-card__shop-link"
              >
                {shop.name}
              </Link>
            </h2>
            <p className="seller-card__location">{shop.location}</p>
          </div>
        </div>

        <div className="seller-card__actions">
          <Button variant="outline" size="sm">
            <Heart className="seller-card__action-icon" />
            Follow shop
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="seller-card__action-icon" />
            Message seller
          </Button>
        </div>
      </div>

      <div className="seller-card__stats">
        <StarRating value={shop.rating} count={shop.reviewCount} />
        <span aria-hidden>·</span>
        <span>{shop.sales}</span>
        <span aria-hidden>·</span>
        <span>{shop.yearsActive} years on the marketplace</span>
      </div>
      <p className="seller-card__response">
        Typically responds {shop.responseTime}.
      </p>

      <ul className="seller-card__badges">
        {badges.map((b) => {
          const Icon =
            b.title === 'Rave reviews' ? Star : (BADGE_ICON[b.title as keyof typeof BADGE_ICON] ?? Truck);
          return (
            <li key={b.title} className="seller-card__badge">
              <Icon className="seller-card__badge-icon" aria-hidden />
              <div>
                <p className="seller-card__badge-title">{b.title}</p>
                <p className="seller-card__badge-body">{b.body}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {listings.length > 0 && (
        <div className="seller-card__more">
          <div className="seller-card__more-head">
            <h3 className="seller-card__more-title">More from this shop</h3>
            <Link
              href={`/shop/${shop.slug}` as Route}
              className="seller-card__visit"
            >
              Visit shop
            </Link>
          </div>

          <ul className="seller-card__grid">
            {listings.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/product/${l.slug}` as Route}
                  className="seller-card__tile"
                >
                  <div
                    className="seller-card__tile-media"
                  >
                    <Image
                      src={l.image}
                      alt=""
                      fill
                      sizes="160px"
                      className="seller-card__tile-image"
                    />
                  </div>
                  <p className="seller-card__tile-title">
                    {l.title}
                  </p>
                  <Money cents={l.priceCents} size="sm" className="seller-card__tile-price" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
