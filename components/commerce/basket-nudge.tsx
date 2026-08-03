'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBasket, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Popover nhắc giỏ hàng — mục Etsy có mà hệ thống này chưa có.
 *
 * Ảnh chụp trang chủ Etsy: một thẻ nổi góc trên phải, *"Don't miss out on what's
 * in your basket!"*, ba món kèm ảnh nhỏ và tên shop, rồi một nút đen chạy hết
 * chiều ngang *Continue to basket*.
 *
 * Lý do nó đáng có, và lý do nó phải đóng được, ghi ở block `.basket-nudge`
 * trong `app/styles/layout.css`.
 *
 * ── Vì sao chỉ hiện ba món ──────────────────────────────────────────────
 *
 * Etsy cũng chỉ hiện ba, và đó là con số đúng: mục đích của thẻ này là NHẮC, nên
 * nó chỉ cần đủ để người mua nhận ra "à, cái áo đó" rồi tự bấm sang giỏ. Liệt kê
 * cả giỏ thì nó thành một giỏ hàng thứ hai, và người dùng bắt đầu sửa số lượng
 * ngay trong đó — thứ nó không làm được.
 *
 * ── Vì sao `sessionStorage` chứ không phải state thường ─────────────────
 *
 * Đóng rồi mà điều hướng sang trang khác lại hiện lên là tệ hơn không có. Ghi
 * vào `sessionStorage` nên nó im tới hết phiên; mở tab mới thì nhắc lại, đúng
 * như một lời nhắc nên hoạt động.
 *
 * Đọc `sessionStorage` trong `useEffect` chứ không phải lúc khởi tạo state:
 * server không có `sessionStorage`, đọc lúc render đầu là lệch HTML giữa server
 * và client. Vì vậy thẻ luôn bắt đầu ở trạng thái ẩn rồi mới hiện ra.
 */
const DISMISS_KEY = 'basket-nudge-dismissed';

export type NudgeLine = { id: string; title: string; image: string; shopName: string };

export function BasketNudge({ lines, count }: { lines: NudgeLine[]; count: number }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) !== '1') setShow(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
  }

  if (!show || lines.length === 0) return null;

  return (
    <aside className="basket-nudge" aria-label="Items in your basket">
      <div className="basket-nudge__head">
        <span aria-hidden className="basket-nudge__icon">
          <ShoppingBasket className="basket-nudge__icon-glyph" />
        </span>
        <p className="basket-nudge__title">Don&rsquo;t miss out on what&rsquo;s in your basket!</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss basket reminder"
          className="basket-nudge__close"
        >
          <X className="basket-nudge__close-icon" />
        </button>
      </div>

      <ul className="basket-nudge__list">
        {lines.slice(0, 3).map((l) => (
          <li key={l.id} className="basket-nudge__item">
            <span className="basket-nudge__thumb">
              <Image src={l.image} alt="" fill sizes="36px" className="basket-nudge__image" />
            </span>
            <span className="basket-nudge__text">
              <span className="basket-nudge__name">{l.title}</span>
              <span className="basket-nudge__shop">{l.shopName}</span>
            </span>
          </li>
        ))}
      </ul>

      <Button asChild block className="basket-nudge__cta">
        <Link href="/cart" onClick={dismiss}>
          Continue to basket
          {count > 3 && ` (${count})`}
        </Link>
      </Button>
    </aside>
  );
}
