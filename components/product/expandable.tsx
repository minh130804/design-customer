'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Khối nội dung dài, cắt ngắn lại và mở bằng mũi tên sổ xuống.
 *
 * ── Vì sao cắt ngắn thay vì gấp hẳn ─────────────────────────────────────
 *
 * Gấp hẳn (accordion đóng) giấu mất cả thông tin lẫn *dấu hiệu rằng có thông
 * tin đáng đọc*. Phần lớn người mua không bấm mở một khối họ không biết bên
 * trong có gì. Cắt ngắn để lộ ba bốn dòng đầu thì họ đọc được đủ để quyết định
 * có muốn đọc tiếp không — và mô tả sản phẩm là chỗ seller nói những điều
 * quyết định mua hay không mua.
 *
 * ── Vì sao có lớp mờ dần ở đáy ──────────────────────────────────────────
 *
 * Một khối bị cắt cụt ngang chữ trông như lỗi hiển thị. Lớp mờ dần nói rõ
 * "còn nữa" mà không cần thêm chữ nào, và nó là lý do cái nút bên dưới có
 * nghĩa.
 *
 * `max-height` chứ không phải `display: none`: nội dung vẫn nằm trong DOM nên
 * Google đọc được toàn bộ mô tả, và `Ctrl+F` của trình duyệt vẫn tìm thấy chữ
 * trong phần đang bị che.
 */
export function Expandable({
  children,
  label = 'Learn more about this item',
  collapsedClassName = 'expandable__body--clamped',
}: {
  children: React.ReactNode;
  label?: string;
  /** Modifier chiều cao lúc thu — mặc định `expandable__body--clamped` (180px) */
  collapsedClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div
        className={cn('expandable__body', open ? 'expandable__body--open' : collapsedClassName)}
      >
        {children}
        {!open && <span aria-hidden className="expandable__fade" />}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="expandable__toggle"
      >
        {open ? 'Show less' : label}
        <ChevronDown
          className={cn('expandable__chevron', open && 'expandable__chevron--open')}
          aria-hidden
        />
      </button>
    </div>
  );
}
