'use client';

import * as React from 'react';
import { StarIcon } from '@/components/shared/star-icon';
import { cn } from '@/lib/utils';

/**
 * Chấm sao — ô nhập, không phải ô hiển thị.
 *
 * Dựng bằng `role="radiogroup"` + năm `role="radio"` thật, không phải năm cái
 * `<span>` bắt sự kiện. Chấm sao là một trong những widget hay bị làm hỏng khả
 * năng truy cập nhất: người dùng bàn phím phải tới được và mũi tên phải đổi
 * được giá trị, còn đọc màn hình phải nghe được "4 trên 5 sao, đã chọn".
 *
 * Xem trước khi rê chuột (`hover`) tách khỏi giá trị đã chọn (`value`) — nếu
 * dùng chung một biến thì rê chuột ngang qua đã ghi đè lựa chọn cũ, và người
 * dùng mất điểm mình vừa chấm chỉ vì đưa chuột đi chỗ khác.
 */
export function RatingInput({
  value,
  onChange,
  label,
  size = 'md',
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const [hover, setHover] = React.useState(0);
  const shown = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="rating-input"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
          tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(5, value + 1));
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(1, value - 1));
          }}
          className="rating-input__button"
        >
          {/* Cùng hình sao nhọn với `StarRating` — hai chỗ này luôn xuất hiện
              gần nhau (chấm sao rồi thấy sao hiển thị ngay sau khi gửi), nên
              lệch hình dạng là thấy ngay. Cỡ thì KHÔNG dùng chung: ở đây sao
              bấm được nên phải giữ vùng chạm. */}
          <StarIcon
            className={cn(
              'rating-input__star',
              `rating-input__star--${size}`,
              n <= shown && 'rating-input__star--on',
            )}
          />
        </button>
      ))}
    </div>
  );
}
