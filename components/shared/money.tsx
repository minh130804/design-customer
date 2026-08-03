import { cva, type VariantProps } from 'class-variance-authority';
import { cn, formatUsd } from '@/lib/utils';

/**
 * A4 · Số tiền.
 *
 * Đây là component tôi lấy thẳng từ `--clg-color-sem-text-monetary-value` của
 * Collage: Etsy nâng "giá tiền" lên thành một token NGỮ NGHĨA, ngang hàng với
 * lỗi và cảnh báo. Một design system mà tiền có màu riêng là design system của
 * một cái chợ.
 *
 * Hai điều bắt buộc, không có ngoại lệ:
 *
 * 1. **Nhận cent nguyên.** Không nhận số thực, không nhận chuỗi đã format sẵn
 *    từ backend. Chuỗi format sẵn sớm muộn sẽ lệch với con số thật khi có
 *    khuyến mại, và không ai phát hiện được vì hai thứ nằm ở hai endpoint.
 * 2. **`tabular-nums`.** Thiếu nó thì cột số trong bảng đối soát so le, và
 *    người đọc mất tin tưởng vào con số trước khi kịp đọc.
 *
 * Giá bán để ĐEN, không tô đỏ. Đỏ ở sàn châu Á là tín hiệu giảm giá; nếu mọi
 * giá đều đỏ thì lúc giảm giá thật không còn cách nào nhấn mạnh.
 */
const moneyVariants = cva('money', {
  variants: {
    tone: {
      /** Giá bán cho buyer */
      price: 'money--price',
      /** Tiền vào — chỉ dùng ở phía seller và ở dòng "bạn tiết kiệm được" */
      in: 'money--in',
      /** Tiền ra, công nợ */
      out: 'money--out',
      /** Giá tham chiếu, giá vốn */
      quiet: 'money--quiet',
      /** Giá cũ bị gạch */
      struck: 'money--struck',
    },
    size: {
      hero: 'money--hero',
      lg: 'money--lg',
      base: 'money--base',
      sm: 'money--sm',
    },
  },
  defaultVariants: { tone: 'price', size: 'base' },
});

export type MoneyProps = React.ComponentProps<'span'> &
  VariantProps<typeof moneyVariants> & {
    cents: number;
    /** Hiện dấu `+` cho số dương — dùng ở sổ đối soát, không dùng ở giá bán */
    signed?: boolean;
  };

export function Money({ cents, signed, tone, size, className, ...props }: MoneyProps) {
  const sign = signed && cents > 0 ? '+' : '';
  return (
    <span className={cn(moneyVariants({ tone, size }), className)} {...props}>
      {sign}
      {formatUsd(cents)}
    </span>
  );
}
