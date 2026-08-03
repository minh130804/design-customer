'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * B0 · Một dải hàng cuộn ngang ở trang chủ.
 *
 * Trang chủ Etsy là một CHỒNG các dải như thế này, mỗi dải một chủ đề, chứ không
 * phải một lưới lớn. Số đo bề rộng thẻ và lý do chọn cuộn gốc thay vì trượt bằng
 * `transform` ghi ở block `.shelf` trong `app/styles/home.css`.
 *
 * ── Vì sao đây là client component nhưng thẻ thì không ──────────────────
 *
 * Hai mũi tên cần `ref` tới thanh cuộn và một handler, nên riêng phần vỏ phải
 * chạy ở client. Các thẻ bên trong đi vào qua `children`: chúng đã được server
 * render xong rồi mới truyền xuống, nên một dải hai chục thẻ không kéo theo hai
 * chục lần hydrate.
 *
 * ── "Not interested" ────────────────────────────────────────────────────
 *
 * Ảnh chụp có nút đó cạnh "Custom Love Apparel". Ở bản thật nó ghi vào hồ sơ cá
 * nhân hoá để dải đó không quay lại nữa; ở đây chưa có tầng ấy, nên nó ẩn dải
 * trong phiên hiện tại và **kèm nút hoàn tác**.
 *
 * Hoàn tác là phần bắt buộc, không phải phần thêm: ẩn không hoàn tác được là một
 * cái bẫy — bấm nhầm một lần là mất cả dải mà không có đường về. Và chỗ trống
 * phải nói rõ vừa xảy ra chuyện gì, chứ không im lặng thu lại khiến người dùng
 * tưởng trang bị lỗi.
 */
export function Shelf({
  title,
  href,
  actionLabel = 'View all',
  dismissible = false,
  children,
}: {
  title: string;
  /** Link "View all" bên phải tiêu đề. Bỏ trống thì không hiện. */
  href?: Route;
  actionLabel?: string;
  /** Cho phép ẩn cả dải, kèm nút hoàn tác */
  dismissible?: boolean;
  children: React.ReactNode;
}) {
  const track = React.useRef<HTMLUListElement>(null);
  const [hidden, setHidden] = React.useState(false);

  // Cuộn theo 80% bề rộng khung nhìn chứ không phải 100%: chừa lại một thẻ đã
  // thấy làm mốc, nếu không mỗi lần bấm là cả dải thay mới và người dùng mất
  // dấu mình đang ở đâu.
  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (hidden) {
    return (
      <section className="shelf__dismissed" aria-live="polite">
        <p>
          Hidden: <span className="shelf__dismissed-name">{title}</span>
        </p>
        <button type="button" onClick={() => setHidden(false)} className="shelf__action">
          Undo
        </button>
      </section>
    );
  }

  return (
    <section className="shelf">
      <div className="shelf__head">
        <h2 className="shelf__title">{title}</h2>
        <div className="shelf__actions">
          {dismissible && (
            <button type="button" onClick={() => setHidden(true)} className="shelf__dismiss">
              Not interested
            </button>
          )}
          {href && (
            <Link href={href} className="shelf__action">
              {actionLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="shelf__viewport">
        <ul ref={track} className="shelf__track">
          {children}
        </ul>

        <button
          type="button"
          aria-label={`Scroll ${title} backwards`}
          onClick={() => page(-1)}
          className="shelf__nav shelf__nav--prev"
        >
          <ChevronLeft className="shelf__nav-icon" />
        </button>
        <button
          type="button"
          aria-label={`Scroll ${title} forwards`}
          onClick={() => page(1)}
          className="shelf__nav shelf__nav--next"
        >
          <ChevronRight className="shelf__nav-icon" />
        </button>
      </div>
    </section>
  );
}
