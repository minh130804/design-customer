'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Bell, Package, AlertCircle, Download, TrendingDown, Store, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Notification, NotificationKind } from '@/lib/notifications';

/**
 * Hộp thông báo trên header — mục Etsy có mà hệ thống này chưa có.
 *
 * Lý do chấm đỏ không mang số, và vì sao mục chưa đọc dùng nền + vạch thay vì
 * chữ đậm, ghi ở block `.notify` trong `app/styles/layout.css`.
 *
 * ── Đánh dấu đã đọc khi MỞ, không phải khi bấm từng mục ──────────────────
 *
 * Mở hộp ra là đã thấy hết. Bắt người dùng bấm vào từng dòng để tắt chấm đỏ là
 * biến thông báo thành việc phải làm — đúng thứ hộp này không nên là. Ở bản thật
 * chỗ này gọi `PATCH /v1/notifications/read`; ở đây chỉ đổi state cục bộ.
 *
 * ── Đóng bằng Escape và bằng cú bấm ra ngoài ─────────────────────────────
 *
 * Một panel chỉ đóng được bằng cách bấm lại đúng cái nút vừa mở là cái bẫy trên
 * màn hẹp: nút bị panel che. `pointerdown` chứ không phải `click` để panel đóng
 * trước khi cú bấm rơi vào thứ nằm dưới.
 */
const ICON: Record<NotificationKind, React.ElementType> = {
  shipped: Package,
  'action-needed': AlertCircle,
  'download-ready': Download,
  'price-drop': TrendingDown,
  'shop-update': Store,
  'review-request': Star,
};


export function NotificationMenu({ items }: { items: Notification[] }) {
  const [open, setOpen] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  const box = React.useRef<HTMLDivElement>(null);

  const unread = seen ? 0 : items.filter((n) => !n.read).length;

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle() {
    setOpen((v) => !v);
    setSeen(true);
  }

  return (
    <div ref={box} className="notify">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread > 0 ? `Updates, ${unread} unread` : 'Updates'}
        className="site-header__icon-btn"
      >
        <Bell className="site-header__icon" />
        {unread > 0 && <span aria-hidden className="notify__dot" />}
      </Button>

      {open && (
        <div className="notify__panel" role="dialog" aria-label="Updates">
          <div className="notify__head">
            <p className="notify__title">Updates</p>
          </div>

          {items.length === 0 ? (
            <p className="notify__empty">Nothing yet. Order updates land here.</p>
          ) : (
            <ul className="notify__list">
              {items.map((n) => {
                const Icon = ICON[n.kind];
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href as Route}
                      onClick={() => setOpen(false)}
                      className={cn('notify__item', !n.read && !seen && 'notify__item--unread')}
                    >
                      <Icon className={cn('notify__icon', `notify__icon--${n.kind}`)} aria-hidden />
                      <span className="notify__body">
                        <span className="notify__subject">{n.title}</span>
                        <span className="notify__detail">{n.body}</span>
                        <span className="notify__at">{n.at}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="notify__foot">
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="shelf__action"
            >
              See all updates
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
