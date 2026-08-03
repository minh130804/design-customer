import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Nút. Kiểu dáng nằm ở block BEM `.btn` trong `app/styles/ui.css`.
 *
 * `cva` vẫn giữ, nhưng bây giờ nó ánh xạ props → **tên class BEM** thay vì →
 * chuỗi utility. Vẫn được kiểu TypeScript sinh từ chính bản đồ này, nên gõ
 * `variant="fillled"` là đỏ lúc biên dịch chứ không im lặng lúc chạy.
 *
 * ── Cảnh báo về `className` của người gọi ───────────────────────────────
 *
 * Với utility Tailwind, `tailwind-merge` trong `cn()` bảo đảm class của người gọi
 * THẮNG class của component. Với class BEM nó không còn làm được điều đó: hai
 * class cùng đặt `padding` thì thứ tự trong CSS quyết định, không phải thứ tự
 * truyền vào. Nên `className` ở đây chỉ nhận một tên BEM của khối BỌC NGOÀI —
 * `site-header__icon-btn`, `order-summary__cta`, `review-step__place` — tức là
 * vị trí của nút trong khối đó. Muốn đổi diện mạo thì thêm modifier vào `.btn`
 * (xem `.btn--on-dark` trong `app/styles/home.css`), đừng ghi đè.
 */
const buttonVariants = cva('btn', {
  variants: {
    variant: {
      filled: 'btn--filled',
      outline: 'btn--outline',
      ghost: 'btn--ghost',
    },
    size: {
      base: 'btn--base',
      sm: 'btn--sm',
      icon: 'btn--icon',
      'icon-sm': 'btn--icon-sm',
    },
    block: { true: 'btn--block' },
  },
  defaultVariants: { variant: 'filled', size: 'base' },
});

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
  );
}

export { buttonVariants };
