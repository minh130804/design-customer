import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tiêu đề khối: serif + một vạch ngắn màu thương hiệu bên dưới.
 *
 * Vạch dài 32px, không phải một đường kẻ chạy hết chiều ngang. Đường kẻ hết
 * chiều ngang CHIA trang thành hai phần rời nhau; một vạch ngắn neo dưới chữ
 * thì gắn với chính tiêu đề đó, nên nó đánh dấu điểm bắt đầu của khối thay vì
 * cắt rời khối trước.
 *
 * Cam `--color-brand` chỉ xuất hiện ở đây và ở logo. Nó là màu thương hiệu,
 * không phải màu nút (trắng trên `#f1641e` chỉ đạt 3.19:1) — dùng làm nét
 * trang trí mảnh là đúng vai của nó nhất.
 */
export function SectionHeading({
  as: Tag = 'h2',
  className,
  children,
  action,
}: {
  as?: 'h2' | 'h3';
  className?: string;
  children: React.ReactNode;
  /** Liên kết phụ nằm bên phải, cùng dòng cơ sở với tiêu đề */
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('section-heading', className)}>
      <div>
        <Tag className="section-heading__title">{children}</Tag>
        <span aria-hidden className="section-heading__rule" />
      </div>
      {action}
    </div>
  );
}
