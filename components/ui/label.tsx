import * as React from 'react';
import { cn } from '@/lib/utils';

/** Nhãn ô nhập. Kiểu dáng ở block `.label` trong `app/styles/ui.css`. */
export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return <label className={cn('label', className)} {...props} />;
}
