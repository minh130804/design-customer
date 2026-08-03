import Link from 'next/link';
import type { Route } from 'next';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A14 · Thanh bước.
 *
 * Ràng buộc quan trọng nhất: **bước đã xong phải bấm quay lại sửa được.**
 * Wizard một chiều là nguyên nhân hàng đầu khiến người dùng bỏ dở — họ nhớ ra
 * gõ sai email ở bước 2 lúc đang ở bước 4 và không có đường lùi, nên họ đóng
 * tab.
 *
 * Bước chưa tới KHÔNG bấm được, và render ra `<span>` chứ không phải `<a>` bị
 * vô hiệu hoá: một thẻ `<a>` không dẫn đi đâu vẫn nằm trong thứ tự Tab và vẫn
 * được đọc màn hình đọc lên như một liên kết.
 */
export type Step = { id: string; label: string; href?: Route };

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: Step[];
  /** Chỉ số bước đang làm, tính từ 0 */
  current: number;
  className?: string;
}) {
  return (
    <nav aria-label="Checkout progress" className={className}>
      <ol className="stepper__list">
        {steps.map((s, i) => {
          const done = i < current;
          const now = i === current;
          const state = now ? 'now' : done ? 'done' : 'todo';
          const dot = (
            <>
              <span aria-hidden className={cn('stepper__dot', `stepper__dot--${state}`)}>
                {done ? <Check className="stepper__check" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn('stepper__label', `stepper__label--${state}`)}>{s.label}</span>
            </>
          );

          return (
            <li key={s.id} className="stepper__item">
              {done && s.href ? (
                <Link href={s.href} className="stepper__link">
                  {dot}
                </Link>
              ) : (
                <span className="stepper__static" aria-current={now ? 'step' : undefined}>
                  {dot}
                </span>
              )}
              {i < steps.length - 1 && <span aria-hidden className="stepper__line" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
