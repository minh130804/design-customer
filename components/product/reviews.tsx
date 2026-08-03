import Image from 'next/image';
import { Check } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/shared/section-heading';
import { StarRating } from './star-rating';
import type { Product, Review } from '@/lib/products';

/**
 * Đánh giá, tách theo BA TRỤC thay vì một số sao — Etsy chia
 * Item quality / Shipping / Customer service.
 *
 * Với sàn POD thì càng phải tách: in xấu, giao chậm và người bán không trả lời
 * là ba loại sự cố khác nhau, do ba bên khác nhau gây ra (xưởng in, đơn vị vận
 * chuyển, seller). Gộp thành một con số thì không ai biết phải sửa cái gì —
 * và hệ thống cũng không tự động phạt đúng bên được.
 *
 * ── Vì sao điểm từng trục là VÒNG TRÒN chứ không phải thanh tiến độ ──────
 *
 * Thanh tiến độ ngầm nói "càng dài càng tốt", nên mắt tự so sánh độ dài giữa
 * ba thanh và kết luận trục ngắn nhất là *tệ*. Nhưng 4.6 và 4.9 đều là điểm
 * tốt — chênh lệch thị giác giữa hai thanh phóng đại chênh lệch thật.
 * Vòng tròn có con số ở giữa buộc người đọc đọc số, đúng như Etsy làm.
 *
 * ── Dải chủ đề: có, nhưng KHÔNG có số đếm ────────────────────────────────
 *
 * Etsy hiện "Appearance (13) · Delivery & Packaging (9)…" — số đó đến từ hàng
 * nghìn đánh giá đã phân loại. Ở đây chủ đề được rút ra bằng cách dò từ khoá
 * trên chính nội dung đánh giá đang hiển thị, nên **hiện số đếm sẽ là bịa**:
 * ba đánh giá mẫu không đại diện cho 134 đánh giá thật. Hiện chủ đề mà bỏ số
 * là điều duy nhất trung thực làm được với dữ liệu đang có.
 */
const TOPICS: { label: string; keywords: string[] }[] = [
  { label: 'Appearance', keywords: ['print', 'sharp', 'colour', 'design', 'lovely', 'beautiful'] },
  { label: 'Delivery & packaging', keywords: ['ship', 'arriv', 'deliver', 'packag', 'tracking'] },
  { label: 'Seller service', keywords: ['seller', 'answer', 'replie', 'reply', 'told me', 'shop'] },
  { label: 'Quality', keywords: ['quality', 'crack', 'soft', 'wash', 'ink', 'fabric', 'grouped'] },
  { label: 'Sizing', keywords: ['size', 'fits', 'runs big', 'wear'] },
  { label: 'Matches description', keywords: ['expect', 'describ', 'estimate', 'as show'] },
];

function mentionedTopics(reviews: Review[]) {
  const text = reviews.map((r) => r.body.toLowerCase()).join(' ');
  return TOPICS.filter((t) => t.keywords.some((k) => text.includes(k))).map((t) => t.label);
}

export function Reviews({ product }: { product: Product }) {
  const withPhotos = product.reviews.filter((r) => r.photo);
  const recommend = Math.round((product.rating / 5) * 100);
  const topics = mentionedTopics(product.reviews);

  return (
    <section className="reviews">
      <SectionHeading>
        Reviews for this item{' '}
        <span className="reviews__count">({product.reviewCount.toLocaleString('en-US')})</span>
      </SectionHeading>

      {/* ── chủ đề người mua nhắc tới ──────────────────────────── */}
      {topics.length > 0 && (
        <div className="reviews__topics">
          <p className="reviews__topics-label">What buyers mention:</p>
          <ul className="reviews__topic-list">
            {topics.map((t) => (
              <li key={t} className="reviews__topic">
                <Check className="reviews__topic-icon" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── dải điểm tổng · vòng tròn như Etsy ─────────────────── */}
      <div className="reviews__summary">
        <div className="reviews__average">
          <span className="reviews__average-value">
            {product.rating.toFixed(1)}
          </span>
          <div>
            <StarRating value={product.rating} size="md" />
            <p className="reviews__average-note">
              item average · {product.reviewCount.toLocaleString('en-US')} reviews
            </p>
          </div>
        </div>

        <dl className="reviews__breakdown">
          {product.reviewBreakdown.map((b) => (
            <div key={b.label} className="reviews__score">
              <ScoreRing value={b.score.toFixed(1)} />
              <dt className="reviews__score-label">{b.label}</dt>
              <dd className="sr-only">{b.score} out of 5</dd>
            </div>
          ))}

          <div className="reviews__score">
            <ScoreRing value={`${recommend}%`} />
            <dt className="reviews__score-label">Buyers recommend</dt>
          </div>
        </dl>
      </div>

      {/* ── từng đánh giá ──────────────────────────────────────── */}
      <ul className="reviews__list">
        {product.reviews.map((r) => (
          <li key={r.id} className="reviews__item">
            <div className="reviews__item-head">
              <div className="reviews__item-rating">
                <StarRating value={r.rating} />
                <span className="reviews__item-score">{r.rating}</span>
                <Badge>This item</Badge>
              </div>

              <div className="reviews__author">
                <Avatar className="reviews__avatar">
                  <AvatarFallback className="reviews__initials">{r.initials}</AvatarFallback>
                </Avatar>
                <span className="reviews__author-name">{r.author}</span>
                <span className="reviews__dot">·</span>
                <span className="reviews__date">{r.date}</span>
              </div>
            </div>

            <div className="reviews__body">
              <div className="reviews__text-col">
                <p className="reviews__text">{r.body}</p>
                {r.variant && (
                  <p className="reviews__variant">
                    Purchased item: <span className="reviews__variant-value">{r.variant}</span>
                  </p>
                )}
              </div>

              {r.photo && (
                <Image
                  src={r.photo}
                  alt={`Photo from ${r.author}'s review`}
                  width={200}
                  height={200}
                  unoptimized
                  sizes="72px"
                  className="reviews__photo"
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="reviews__more">
        <Button variant="outline" size="sm">
          View all {product.reviewCount.toLocaleString('en-US')} reviews for this item
        </Button>
      </div>

      {/* ── ảnh khách chụp ───────────────────────────────────── */}
      {withPhotos.length > 0 && (
        <div className="reviews__gallery">
          <SectionHeading as="h3">Photos from reviews</SectionHeading>
          <ul className="reviews__gallery-list">
            {withPhotos.map((r) => (
              <li key={r.id} className="reviews__gallery-item">
                <Image
                  src={r.photo!}
                  alt={`Photo from ${r.author}'s review`}
                  width={200}
                  height={200}
                  unoptimized
                  sizes="150px"
                  className="reviews__gallery-photo"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Con số trong một vòng tròn mảnh — đọc được ở cỡ nhỏ, không gợi ý so sánh độ dài. */
function ScoreRing({ value }: { value: string }) {
  return (
    <span aria-hidden className="score-ring">
      {value}
    </span>
  );
}
