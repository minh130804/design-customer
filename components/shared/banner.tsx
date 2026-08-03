import * as React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * A15 · Dải thông báo. Bốn tông, dùng ở cả hai app.
 *
 * Quy tắc cứng cho tông `critical`: phải đủ **chuyện gì · vì sao · làm gì
 * tiếp**. Báo "vi phạm chính sách" mà không nói vi phạm điều nào khiến người
 * dùng nộp lại sai tiếp, và mỗi vòng lặp là một lần mất niềm tin.
 *
 * Nút hành động nằm **bên phải cùng hàng**, không xuống dòng — dải thông báo
 * cao hai dòng đẩy hết nội dung thật xuống dưới nếp gấp.
 */
const bannerVariants = cva('banner', {
  variants: {
    tone: {
      info: 'banner--info',
      success: 'banner--success',
      warning: 'banner--warning',
      critical: 'banner--critical',
    },
  },
  defaultVariants: { tone: 'info' },
});

const ICON = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: XCircle,
} as const;

export type BannerProps = React.ComponentProps<'div'> &
  VariantProps<typeof bannerVariants> & {
    title?: React.ReactNode;
    action?: React.ReactNode;
  };

export function Banner({ tone = 'info', title, action, className, children, ...props }: BannerProps) {
  const Icon = ICON[tone ?? 'info'];
  return (
    <div role="status" className={cn(bannerVariants({ tone }), className)} {...props}>
      {/* Màu biểu tượng đi theo `.banner--*` qua bộ chọn con, không qua một bản
          đồ màu thứ hai trong JSX — hai bản đồ song song thì không có gì buộc
          chúng khớp nhau. */}
      <Icon className="banner__icon" aria-hidden />
      <div className="banner__body">
        {title && <p className="banner__title">{title}</p>}
        {children && <div className="banner__text">{children}</div>}
      </div>
      {action && <div className="banner__action">{action}</div>}
    </div>
  );
}
