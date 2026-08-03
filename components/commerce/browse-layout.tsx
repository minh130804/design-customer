import { Suspense } from 'react';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { BrowseToolbar } from './browse-controls';
import { ProductGrid } from './product-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import type { Facet, Listing } from '@/lib/catalog';

/**
 * L2 · Khung màn duyệt — dùng chung cho tìm kiếm, danh mục và trang shop.
 *
 * MỘT cột chạy hết chiều ngang. Rail lọc cố định đã được thay bằng panel trượt
 * (`BrowseToolbar` → `FilterDrawer`); lý do đổi ghi ở đầu browse-controls.tsx.
 * Đổi lại, lưới sản phẩm có thêm một cột và ảnh to hơn đáng kể.
 *
 * `<Suspense>` quanh `BrowseToolbar` là BẮT BUỘC: nó gọi `useSearchParams()`,
 * và Next bắt buộc phải có ranh giới Suspense quanh mọi nhánh client đọc search
 * param — thiếu nó là lỗi build.
 *
 * ĐÁNH ĐỔI ĐÃ CHẤP NHẬN: trang danh mục render động (`ƒ` trong bảng route) vì
 * `page.tsx` `await searchParams` để lọc và đếm facet ở server. Nội dung vẫn
 * render đầy đủ ở server nên Google đọc bình thường và `canonical` vẫn trỏ về
 * URL không kèm bộ lọc — cái mất là cache ở CDN.
 *
 * Trạng thái rỗng nêu ĐÍCH DANH từ khoá và gợi ý bỏ bớt bộ lọc. "Không có kết
 * quả" là ngõ cụt; "không thấy «lotus hoodie» — thử bỏ bộ lọc giá" là đường đi.
 */
export function BrowseLayout({
  header,
  listings,
  facets = [],
  categoryLinks,
  categoryLabel,
  query,
}: {
  /** Khối tiêu đề riêng của từng màn — danh mục có dải thẻ, tìm kiếm thì không */
  header: React.ReactNode;
  listings: Listing[];
  /** Bộ lọc thuộc tính sinh từ danh mục đang xem. Trang tìm kiếm không có. */
  facets?: Facet[];
  categoryLinks?: { label: string; href: string }[];
  categoryLabel?: string;
  /** Từ khoá để nêu đích danh trong trạng thái rỗng */
  query?: string;
}) {
  return (
    <div>
      {header}

      <div className="browse-layout__toolbar">
        <Suspense fallback={<div className="browse-layout__toolbar-fallback" />}>
          <BrowseToolbar
            total={listings.length}
            facets={facets}
            categoryLinks={categoryLinks}
            categoryLabel={categoryLabel}
          />
        </Suspense>
      </div>

      <div className="browse-layout__results">
        {listings.length ? (
          <ProductGrid listings={listings} />
        ) : (
          <EmptyState
            icon={<SearchX className="browse-layout__empty-icon" />}
            title={query ? `Nothing matched “${query}”` : 'Nothing matched those filters'}
            action={
              <Button asChild variant="outline">
                <Link href="/search">Clear filters and start again</Link>
              </Button>
            }
          >
            Try a shorter phrase, or drop the price and rating filters — they narrow results faster
            than anything else.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
