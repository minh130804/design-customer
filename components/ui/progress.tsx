'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

/**
 * shadcn `progress` — ở trang này dùng làm thanh phân bổ sao trong phần đánh giá.
 * Radix tự đặt role="progressbar" cùng aria-valuenow/valuemin/valuemax, nên
 * trình đọc màn hình đọc được "4 sao, 18 phần trăm" thay vì một khối trống.
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('progress', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="progress__bar"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = 'Progress';

export { Progress };
