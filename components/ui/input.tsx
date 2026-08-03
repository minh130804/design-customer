import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Ô nhập. Kiểu dáng ở `.field-base` + `.input` trong `app/styles/ui.css`.
 *
 * `.field-base` là nền dùng chung với `.select__field` và `.textarea` — ba ô phải
 * cùng viền, cùng trạng thái focus, cùng cách báo lỗi, và trước đây điều đó được
 * giữ bằng cách chép cùng một chuỗi utility ba lần.
 */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn('field-base input', invalid && 'field-base--invalid', className)}
    {...props}
  />
));
Input.displayName = 'Input';
