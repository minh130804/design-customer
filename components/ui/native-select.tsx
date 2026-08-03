import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * `<select>` thuần. Kiểu dáng ở block `.select` trong `app/styles/ui.css`,
 * dùng chung nền `.field-base` với `Input` và `Textarea`.
 *
 * VÌ SAO KHÔNG DÙNG shadcn/Radix Select ở đây:
 *
 * 1. Etsy dùng đúng `<select>` thuần cho biến thể, kèm giá ngay trong chữ của
 *    option — `40 Millimeters (€106,33)`. Muốn giống thì đây mới là giống.
 * 2. @radix-ui/react-select kéo theo @floating-ui, tốn ~30 KB gzip. Trang này
 *    có ngân sách 120 KB cho TOÀN BỘ JS. Đổi 30 KB lấy một cái mũi tên đẹp hơn
 *    là lỗ.
 * 3. Trên di động, `<select>` thuần bung ra bộ chọn của hệ điều hành — cuộn
 *    mượt, có tìm kiếm bằng bàn phím, và người dùng đã quen. Không bản dựng
 *    lại nào bằng được.
 *
 * Đánh đổi: `<option>` không nhận markup con, nên không vẽ được chấm màu trong
 * từng dòng. Chấm màu đó vốn cũng không có ở Etsy — giá trong ngoặc đã đủ nói.
 *
 * shadcn/Radix vẫn dùng ở accordion, collapsible, dialog, avatar, progress —
 * những chỗ HTML thuần thật sự không làm được.
 */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<'select'> & {
    invalid?: boolean;
    /** Bề rộng phải đặt lên LỚP BỌC, không lên <select>: mũi tên định vị
     *  tuyệt đối theo lớp bọc, để lớp bọc rộng hết dòng thì mũi tên trôi ra xa
     *  khỏi ô chọn. */
    wrapperClassName?: string;
  }
>(({ className, wrapperClassName, invalid, children, ...props }, ref) => (
  <div className={cn('select', wrapperClassName)}>
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn('field-base select__field', invalid && 'field-base--invalid', className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown aria-hidden className="select__chevron" />
  </div>
));
NativeSelect.displayName = 'NativeSelect';
