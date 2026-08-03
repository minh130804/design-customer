import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { MapPin, MessageSquare, Package, RotateCcw, ShieldCheck, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { SectionHeading } from '@/components/shared/section-heading';
import { StarRating } from '@/components/product/star-rating';
import type { Shop } from '@/lib/catalog';
import type { ShopReview } from '@/lib/products';

/* ── Tab: Reviews ─────────────────────────────────────────── */

/**
 * Đánh giá gộp theo shop.
 *
 * Mỗi dòng mang theo **món đã mua**, kèm ảnh và liên kết. Không có nó thì một
 * đánh giá 4 sao trở nên vô dụng: người đọc không biết nó nói về cái áo hay bộ
 * icon, mà hai thứ đó do hai quy trình khác nhau tạo ra.
 *
 * Bốn chỉ số ở đầu do hệ thống tính. `onTimeRate` và `replyRate` đáng chú ý
 * riêng: chúng đo HÀNH VI của seller chứ không đo cảm nhận của người mua, nên
 * chúng là thứ duy nhất ở trang này không bị ảnh hưởng bởi việc ai chịu khó
 * viết đánh giá hơn ai.
 */
export function ShopReviews({ shop, reviews }: { shop: Shop; reviews: ShopReview[] }) {
  return (
    <section>
      <SectionHeading className="shop-reviews__heading">
        Reviews{' '}
        <span className="shop-reviews__count">({shop.reviewCount.toLocaleString('en-US')})</span>
      </SectionHeading>

      <div className="shop-reviews__summary">
        <div className="shop-reviews__average">
          <span className="shop-reviews__average-value">{shop.rating.toFixed(1)}</span>
          <div>
            <StarRating value={shop.rating} size="md" />
            <p className="shop-reviews__average-note">shop average</p>
          </div>
        </div>

        <dl className="shop-reviews__metrics">
          <Metric value={`${shop.onTimeRate}%`} label="shipped on time" />
          <Metric value={`${shop.replyRate}%`} label="replied to messages" />
          <Metric value={shop.sales.toLocaleString('en-US')} label="orders delivered" />
        </dl>
      </div>

      <ul className="shop-reviews__list">
        {reviews.map((review) => (
          <li key={review.id} className="shop-reviews__item">
            <div className="shop-reviews__item-head">
              <StarRating value={review.rating} />
              <div className="shop-reviews__author">
                <Avatar className="shop-reviews__avatar">
                  <AvatarFallback className="shop-reviews__initials">{review.initials}</AvatarFallback>
                </Avatar>
                <span className="shop-reviews__author-name">{review.author}</span>
                <span className="shop-reviews__dot">·</span>
                <span className="shop-reviews__date">{review.date}</span>
              </div>
            </div>

            <p className="shop-reviews__text">{review.body}</p>

            <Link
              href={`/product/${review.productSlug}` as Route}
              className="shop-reviews__product"
            >
              <span className="shop-reviews__product-media">
                <Image
                  src={review.productImage}
                  alt=""
                  fill
                  sizes="36px"
                  className="shop-reviews__product-image"
                />
              </span>
              <span className="shop-reviews__product-text">
                <span className="shop-reviews__product-lead">Purchased</span>
                <span className="shop-reviews__product-title">
                  {review.productTitle}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="shop-reviews__metric-value">{value}</span>
        <span className="shop-reviews__metric-label">{label}</span>
      </dd>
    </div>
  );
}

/* ── Tab: About ───────────────────────────────────────────── */

/**
 * Lời của seller, và chỉ lời của seller.
 *
 * Không trộn chỉ số hệ thống vào đây. Người mua đọc tab này để nghe một con
 * người kể chuyện; xen một dòng "97% giao đúng hạn" vào giữa làm cả hai phần
 * đều yếu đi — câu chuyện thành quảng cáo, còn con số mất chỗ đứng khách quan
 * mà nó có ở dải danh tính phía trên.
 */
export function ShopAbout({ shop }: { shop: Shop }) {
  return (
    <section className="shop-about">
      <SectionHeading className="shop-about__heading">About {shop.name}</SectionHeading>

      {shop.story.map((para) => (
        <p key={para.slice(0, 24)} className="shop-about__para">
          {para}
        </p>
      ))}

      <Card className="shop-about__owner-card">
        <CardBody>
          <h3 className="shop-about__owner-title">Meet the owner</h3>
          <div className="shop-about__owner">
            <Avatar className="shop-about__owner-avatar">
              <AvatarFallback className="shop-about__owner-fallback">
                {shop.owner.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="shop-about__owner-text">
              <p className="shop-about__owner-name">{shop.owner}</p>
              <p className="shop-about__owner-meta">
                <MapPin className="shop-about__owner-icon" aria-hidden />
                {shop.location} · joined {shop.joinedYear}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="shop-about__message">
            <MessageSquare className="shop-about__message-icon" />
            Message {shop.owner}
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}

/* ── Tab: Shop policies ───────────────────────────────────── */

/**
 * Chính sách của shop nằm TRÊN NỀN chính sách sàn, không thay thế nó.
 *
 * Shop được phép rộng rãi hơn mức tối thiểu của sàn, không được hẹp hơn — nên
 * dải nhắc điều đó đặt ở cuối, sau khi người đọc đã xem điều khoản của shop.
 * Đặt lên đầu thì nó biến thành lời rào trước, và người ta bỏ qua phần của
 * shop, vốn mới là phần khác nhau giữa các shop.
 */
export function ShopPolicies({ shop }: { shop: Shop }) {
  const rows = [
    { icon: Package, title: 'Shipping', body: shop.policies.shipping },
    { icon: RotateCcw, title: 'Returns and exchanges', body: shop.policies.returns },
    { icon: Wallet, title: 'Payment', body: shop.policies.payment },
    { icon: ShieldCheck, title: 'Privacy', body: shop.policies.privacy },
  ];

  return (
    <section className="shop-policies">
      <SectionHeading className="shop-policies__heading">Shop policies</SectionHeading>

      <dl className="shop-policies__list">
        {rows.map(({ icon: Icon, title, body }) => (
          <div key={title} className="shop-policies__row">
            <Icon className="shop-policies__icon" aria-hidden />
            <div>
              <dt className="shop-policies__term">{title}</dt>
              <dd className="shop-policies__body">{body}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="shop-policies__floor">
        <ShieldCheck className="shop-policies__icon" aria-hidden />
        <p className="shop-policies__floor-text">
          <span className="shop-policies__floor-lead">These sit on top of the marketplace rules.</span> A
          shop may be more generous than the marketplace minimum, never less — so the{' '}
          <Link href="/help/returns" className="shop-policies__floor-link">
            30-day return floor
          </Link>{' '}
          applies here whatever this page says.
        </p>
      </div>
    </section>
  );
}
