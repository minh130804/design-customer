import { StarIcon } from '@/components/shared/star-icon';
import { cn } from '@/lib/utils';

/**
 * Sao đánh giá, màu vàng `--color-star` (lý do chọn sắc độ ghi ở globals.css).
 *
 * Nửa sao vẽ bằng cách chồng một lớp sao đặc bị cắt theo chiều ngang, chứ
 * không dùng icon nửa sao riêng: cách này cho mọi phân số, không chỉ 0.5.
 *
 * Sao rỗng dùng `fill-line` (#dbdbdb) chứ không phải `text-line-strong` (#222)
 * như bản vẽ bằng nét: khi hình đã đặc thì #222 cho ra một ngôi sao ĐEN, đọc
 * thành "đã chấm" chứ không phải "chưa chấm".
 */
export function StarRating({
  value,
  count,
  size = 'sm',
  className,
}: {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  // Lớp sao đặc chồng lên nằm trong `.star-rating__fill`, nên nó thừa hưởng
  // `fill-star` qua bộ chọn con — JSX chỉ cần đúng một cỡ cho cả hai lớp.
  const px = `star-rating__star--${size}`;

  return (
    <span className={cn('star-rating', className)}>
      <span className="star-rating__stars" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={cn('star-rating__star', px)} />
        ))}
        <span
          className="star-rating__fill"
          style={{ width: `${(Math.max(0, Math.min(5, value)) / 5) * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className={cn('star-rating__star', px)} />
          ))}
        </span>
      </span>
      <span className="sr-only">{value} out of 5 stars</span>
      {count !== undefined && (
        <span className="star-rating__count">({count.toLocaleString('en-US')})</span>
      )}
    </span>
  );
}
