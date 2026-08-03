import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

/** shadcn `separator`. `decorative` mặc định true → role="none", trình đọc bỏ qua. */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'separator',
      orientation === 'horizontal' ? 'separator--horizontal' : 'separator--vertical',
      className,
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

export { Separator };
