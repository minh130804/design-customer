import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';

/**
 * Đường dẫn phân cấp.
 *
 * Đây không chỉ là trang trí: nó là dữ liệu có cấu trúc cho Google
 * (`BreadcrumbList`), và trên sàn POD long-tail search là nguồn khách chính —
 * xem stack-decision.md §2. Vì vậy nó render JSON-LD luôn, không tách ra chỗ
 * khác nơi người ta dễ quên cập nhật.
 */
/**
 * `href` khai là `string` chứ không phải `Route`, và đó là quyết định có ý thức:
 * đường dẫn breadcrumb được GHÉP LÚC CHẠY từ `categoryPath` của sản phẩm
 * (`/c/clothing/tops/t-shirts`), nên typedRoutes về nguyên tắc không kiểm được.
 * Ép kiểu một lần ở đây, ngay chỗ có lời giải thích, thay vì bắt sáu trang gọi
 * mỗi trang tự ép một kiểu khác nhau.
 */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: it.href } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumbs__list">
          {/* Khoá là VỊ TRÍ, không phải nhãn.
              Nhãn trùng nhau được, và trùng thật: nhánh danh mục *Home* (đồ gia
              dụng) trùng tên với *Home* của trang chủ, nên `/c/home` sinh ra hai
              mắt cùng nhãn `Home` và React cảnh báo trùng khoá.
              Ở đây vị trí đúng là danh tính: breadcrumb là một đường dẫn có thứ
              tự cố định, không bao giờ bị đảo hay lọc, và các mắt không giữ
              trạng thái nào — mỗi lần điều hướng là dựng lại toàn bộ. */}
          {items.map((it, i) => (
            <li key={i} className="breadcrumbs__item">
              {it.href && i < items.length - 1 ? (
                <Link href={it.href as Route} className="breadcrumbs__link">
                  {it.label}
                </Link>
              ) : (
                <span className="breadcrumbs__current" aria-current="page">
                  {it.label}
                </span>
              )}
              {i < items.length - 1 && <ChevronRight className="breadcrumbs__sep" aria-hidden />}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
