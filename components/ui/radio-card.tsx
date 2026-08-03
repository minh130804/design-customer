import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Thẻ radio — dùng ở bộ chọn giấy phép (A6b), sổ địa chỉ (A8), phương thức
 * thanh toán và phương thức vận chuyển.
 *
 * Vì sao là THẺ chứ không phải một hàng radio gọn:
 * bốn chỗ trên đều là lựa chọn mà người dùng **chưa biết nghĩa** — "giấy phép
 * thương mại" khác "giấy phép cá nhân" ở đâu, "COD" áp dụng cho kiện nào. Mỗi
 * lựa chọn phải mang theo một dòng mô tả, và mô tả cần chỗ.
 *
 * Ngược lại size áo thì dùng `<select>`: người mua đã biết mình mặc size gì.
 *
 * Ô radio thật vẫn nằm trong DOM (không `display:none`) nên bàn phím mũi tên,
 * `name` gộp nhóm và đọc màn hình đều chạy như radio chuẩn.
 */
export function RadioCard({
  label,
  description,
  aside,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Góc phải — thường là giá, hoặc nhãn "Mặc định" */
  aside?: React.ReactNode;
}) {
  return (
    <label
      className={cn('radio-card', className)}
    >
      <input type="radio" className="radio-card__input" {...props} />
      <span className="radio-card__body">
        <span className="radio-card__head">
          <span className="radio-card__label">{label}</span>
          {aside && <span className="radio-card__aside">{aside}</span>}
        </span>
        {description && <span className="radio-card__description">{description}</span>}
        {children}
      </span>
    </label>
  );
}
