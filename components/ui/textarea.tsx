import * as React from 'react';
import { cn } from '@/lib/utils';

/** shadcn `textarea`. Kiểu dáng ở `.field-base` + `.textarea` trong `app/styles/ui.css`. */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn('field-base textarea', className)} {...props} />
));
Textarea.displayName = 'Textarea';
