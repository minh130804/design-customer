import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Heart, MapPin, MessageSquare, Search, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/product/star-rating';
import type { Shop } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/shared/page-title';

export const SHOP_TABS = [
  { id: 'items', label: 'Items' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'about', label: 'About' },
  { id: 'policies', label: 'Shop policies' },
] as const;

export type ShopTab = (typeof SHOP_TABS)[number]['id'];

/**
 * Đầu trang shop: ảnh bìa · danh tính · tab · ô tìm trong shop.
 *
 * ── Tab là LIÊN KẾT, không phải trạng thái trong bộ nhớ ─────────────────
 *
 * `?tab=reviews` là một URL gửi được cho người khác, quay lại được bằng nút
 * Back, và render sẵn ở server. Tab dựng bằng `useState` mất cả ba thứ đó, và
 * mất cả khả năng để Google đọc phần đánh giá — thứ đáng đánh chỉ mục nhất ở
 * trang shop sau danh sách hàng.
 *
 * ── Ba chỉ số cạnh tên shop do HỆ THỐNG tính ────────────────────────────
 *
 * Điểm, số đơn, số năm — seller không khai và không sửa được. Đây là toàn bộ
 * lý do khối này có giá trị; để seller tự nhập thì người mua học được điều đó
 * rất nhanh và bỏ qua cả khối.
 *
 * Ngược lại, ảnh bìa và câu giới thiệu là thứ seller tự viết. Hai loại thông
 * tin đó được tách rõ về mặt thị giác: chỉ số nằm cạnh tên, còn lời của seller
 * nằm trên ảnh bìa và trong tab About.
 */
export function ShopHeader({
  shop,
  tab,
  itemCount,
  query,
  covers,
}: {
  shop: Shop;
  tab: ShopTab;
  itemCount: number;
  query?: string;
  /** Ảnh trang trí cho dải bìa, lấy từ hàng bán chạy của chính shop */
  covers: string[];
}) {
  const base = `/shop/${shop.slug}` as Route;

  return (
    <header>
      {/* ── ảnh bìa · lời của seller ────────────────────────── */}
      <div className="shop-header__cover">
        <div className="shop-header__cover-inner">
          <div className="shop-header__tagline-box">
            <p className="shop-header__tagline">
              {shop.tagline}
            </p>
          </div>

          <ul aria-hidden className="shop-header__covers">
            {covers.slice(0, 3).map((src) => (
              <li key={src} className="shop-header__cover-photo">
                <Image src={src} alt="" fill unoptimized sizes="90px" className="shop-header__cover-image" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── danh tính ───────────────────────────────────────── */}
      <div className="shop-header__identity">
        <div className="shop-header__who">
          <Avatar className="shop-header__avatar">
            <AvatarFallback className="shop-header__avatar-fallback">
              {shop.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="shop-header__who-text">
            <PageTitle className="shop-header__name">
              {shop.name}
              {shop.starSeller && (
                <span
                  className="shop-header__star-seller"
                >
                  <Star className="shop-header__star-seller-icon" aria-hidden />
                  Star Seller
                </span>
              )}
            </PageTitle>

            <p className="shop-header__location">
              <MapPin className="shop-header__location-icon" aria-hidden />
              {shop.location}
            </p>

            <div className="shop-header__stats">
              <StarRating value={shop.rating} count={shop.reviewCount} />
              <span aria-hidden className="shop-header__stat-sep">|</span>
              <span className="shop-header__stat-value">{shop.sales.toLocaleString('en-US')} sales</span>
              <span aria-hidden className="shop-header__stat-sep">|</span>
              <span>
                <span className="shop-header__stat-value">{2026 - shop.joinedYear}</span> years on the marketplace
              </span>
            </div>
          </div>
        </div>

        <div className="shop-header__actions">
          <Button variant="outline" size="sm">
            <MessageSquare className="shop-header__action-icon" />
            Contact
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="shop-header__action-icon" />
            Follow
          </Button>
        </div>
      </div>

      {/* ── tab + tìm trong shop ────────────────────────────── */}
      <div className="shop-header__bar">
        <nav aria-label="Shop sections" className="shop-header__tabs">
          {SHOP_TABS.map((t) => {
            const on = t.id === tab;
            return (
              <Link
                key={t.id}
                href={(t.id === 'items' ? base : `${base}?tab=${t.id}`) as Route}
                aria-current={on ? 'page' : undefined}
                className={cn('shop-header__tab', on && 'shop-header__tab--on')}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Tìm kiếm trong phạm vi shop là một FORM GET thật — nó phải chạy khi
            JavaScript chưa tải xong, vì đó chính là lúc người dùng vừa mở trang. */}
        <form action={base} className="shop-header__search">
          <div className="shop-header__search-box">
            <Search className="shop-header__search-icon" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={`Search all ${itemCount} items`}
              aria-label={`Search ${shop.name}`}
              className="shop-header__search-input"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
