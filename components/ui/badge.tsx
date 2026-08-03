import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Nhãn nhỏ. Kiểu dáng ở block `.badge` trong `app/styles/ui.css`.
 *
 * Chỉ nhận các tông cố định — không nhận màu tự do, nếu không mỗi người gọi sẽ
 * tự bịa một sắc đỏ khác nhau.
 */
const badgeVariants = cva('badge', {
  variants: {
    tone: {
      neutral: 'badge--neutral',
      trust: 'badge--trust',
      stock: 'badge--stock',
      pod: 'badge--pod',
      file: 'badge--file',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
