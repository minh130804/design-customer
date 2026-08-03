import { cn } from '@/lib/utils';

/**
 * Khung xương lúc chờ dữ liệu — dùng trong `loading.tsx` của App Router.
 *
 * Khung xương phải có ĐÚNG kích thước của nội dung thật, nếu không lúc dữ liệu
 * về trang sẽ nhảy và người dùng bấm nhầm. Đây là lý do `ProductGridSkeleton`
 * dùng lại đúng `aspect-square` và số cột của lưới thật.
 */
export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div aria-hidden className={cn('skeleton', className)} {...props} />;
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="skeleton-grid" aria-busy aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div aria-hidden className="skeleton-grid__media" />
          <div aria-hidden className="skeleton-grid__title" />
          <div aria-hidden className="skeleton-grid__meta" />
          <div aria-hidden className="skeleton-grid__price" />
        </div>
      ))}
    </div>
  );
}
