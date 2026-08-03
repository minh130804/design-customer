import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * `<h1>` của một trang.
 *
 * Trước khi có component này, đúng chuỗi `font-serif text-…-… text-ink` được gõ
 * lại ở 22 chỗ. Vấn đề không phải độ dài chuỗi mà là ở chỗ nó KHÔNG có tên: đọc
 * mã không biết đây là tiêu đề trang hay chỉ là một dòng chữ serif to, và đổi
 * kiểu tiêu đề trang phải sửa 22 chỗ mà không có cách nào biết đã sửa hết chưa.
 *
 * ── Khác `SectionHeading` ở chỗ nào ─────────────────────────────────────
 *
 * `SectionHeading` là `<h2>/<h3>` mở đầu một KHỐI bên trong trang, có vạch cam
 * trang trí và chỗ gắn liên kết phụ bên phải. `PageTitle` là `<h1>`, mỗi trang
 * đúng một cái, không trang trí. Hai vai khác nhau nên là hai component — gộp
 * lại sẽ thành một component có cờ `isPageTitle`, tức là hai component dán vào
 * nhau bằng câu lệnh if.
 *
 * ── Hai cỡ ──────────────────────────────────────────────────────────────
 *
 * `base` (19px) cho trang tiện ích — giỏ hàng, đơn hàng, địa chỉ, tải về. Ở đó
 * tiêu đề chỉ cần nói mình đang ở đâu; thứ người dùng vào để xem là dữ liệu bên
 * dưới, nên tiêu đề to chỉ đẩy dữ liệu xuống thấp.
 *
 * `display` (31px) cho trang mà chính tiêu đề là nội dung — kết quả tìm kiếm,
 * trang danh mục, mời bán hàng, đăng nhập, xác nhận đặt hàng.
 *
 * Khoảng cách quanh tiêu đề vẫn truyền qua `className`, nhưng bây giờ là một
 * tên BEM của TRANG (`page__title`, `hero-banner__title`, `category-page__title`)
 * chứ không phải một chuỗi utility — khoảng cách đó là việc của trang, và nó
 * được khai ở tệp kiểu dáng của trang đó.
 */
const pageTitleVariants = cva('page-title', {
  variants: {
    size: {
      base: 'page-title--base',
      display: 'page-title--display',
    },
  },
  defaultVariants: { size: 'base' },
});

export function PageTitle({
  size,
  className,
  children,
  ...props
}: React.ComponentProps<'h1'> & VariantProps<typeof pageTitleVariants>) {
  return (
    <h1 className={cn(pageTitleVariants({ size }), className)} {...props}>
      {children}
    </h1>
  );
}
