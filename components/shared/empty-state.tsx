import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Trạng thái rỗng.
 *
 * Quy tắc từ ui-design.md phần E: **không màn nào được để bảng trống.** Mỗi
 * trạng thái rỗng gồm một câu giải thích **và một nút hành động**.
 *
 * "Không có kết quả" là một ngõ cụt. "Không tìm thấy sản phẩm nào cho «lotus
 * hoodie» — thử bỏ bộ lọc giá" là một đường đi tiếp. Chênh lệch giữa hai câu đó
 * là chênh lệch giữa người dùng ở lại và người dùng đóng tab.
 */
export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('empty-state', className)}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <p className="empty-state__title">{title}</p>
      {children && <div className="empty-state__text">{children}</div>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
