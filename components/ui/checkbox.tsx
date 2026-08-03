import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * `<input type="checkbox">` thuần, tô lại bằng `accent-color`.
 *
 * Không dùng Radix Checkbox: ô chọn là một trong số ít widget mà HTML thuần đã
 * làm đúng hết — phím cách bật tắt, `:indeterminate`, đọc màn hình hiểu ngay,
 * và trên iOS nó vẫn chạm trúng ở 16px nhờ vùng chạm của `<label>` bao ngoài.
 *
 * `accent-color` là cách rẻ nhất để đổi màu ô chọn mà vẫn giữ nguyên hành vi
 * gốc — thay vì ẩn input đi rồi vẽ lại bằng `<span>`, cách làm luôn kéo theo
 * một loạt lỗi bàn phím.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn('checkbox', className)}
      {...props}
    />
  ),
);
Checkbox.displayName = 'Checkbox';

/** Ô chọn kèm nhãn — vùng chạm là cả dòng, không chỉ ô vuông 21px. */
export function CheckboxField({
  label,
  hint,
  className,
  ...props
}: React.ComponentProps<'input'> & { label: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label className={cn('checkbox-field', className)}>
      <Checkbox className="checkbox-field__box" {...props} />
      <span>
        <span className="checkbox-field__label">{label}</span>
        {hint && <span className="checkbox-field__hint">{hint}</span>}
      </span>
    </label>
  );
}
