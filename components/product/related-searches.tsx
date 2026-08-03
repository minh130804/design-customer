import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { SectionHeading } from '@/components/shared/section-heading';

export type ExploreTile = { label: string; href: string; image: string };

/**
 * Hai dải khám phá ở chân trang sản phẩm, đúng thứ tự của Etsy:
 *
 *   Explore related searches       thẻ có ảnh — sáu cụm từ gần nhất
 *   Explore more related searches  chip chữ  — phần đuôi dài
 *
 * ── Vì sao có ẢNH ở dải trên và KHÔNG có ở dải dưới ─────────────────────
 *
 * Sáu cụm đầu là thứ ta tự tin nhất, và ảnh làm chúng đáng bấm hơn hẳn chữ
 * trơn. Nhưng ảnh cũng đắt về không gian: hai mươi thẻ có ảnh thì dải dưới dài
 * hơn cả phần nội dung chính. Dải dưới là đuôi dài — nhiều lựa chọn, mỗi lựa
 * chọn ít khả năng được bấm — nên chip chữ là đúng tỉ lệ đầu tư.
 *
 * Cả hai dải đều là **liên kết nội bộ tới trang tìm kiếm**. Đây là phần đóng
 * góp thẳng cho long-tail search: mỗi trang sản phẩm trỏ tới hàng chục truy vấn
 * có thật, và Google đi theo chúng.
 */
export function RelatedSearches({
  tiles,
  chips,
}: {
  tiles: ExploreTile[];
  chips: string[];
}) {
  if (!tiles.length && !chips.length) return null;

  return (
    <section className="related-searches">
      {tiles.length > 0 && (
        <>
          <SectionHeading className="related-searches__heading">
            Explore related searches
          </SectionHeading>
          {/* Đây là ô chữ, không phải thẻ sản phẩm, nên nó đi theo nhịp cột của
              CHÂN TRANG Etsy chứ không theo nhịp của lưới hàng — lý do ghi ở
              `.related-searches__tiles` trong `app/styles/product.css`. */}
          <ul className="related-searches__tiles">
            {tiles.map((tile) => (
              <li key={tile.label}>
                <Link href={tile.href as Route} className="related-searches__tile">
                  <span className="related-searches__media">
                    <Image
                      src={tile.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="48px"
                      className="related-searches__image"
                    />
                  </span>
                  <span className="related-searches__label">{tile.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {chips.length > 0 && (
        <>
          <SectionHeading className="related-searches__heading--chips">
            Explore more related searches
          </SectionHeading>
          <ul className="related-searches__chips">
            {chips.map((term) => (
              <li key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}` as Route}
                  className="related-searches__chip"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
