import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BrowseLayout } from '@/components/commerce/browse-layout';
import { readQuery, searchListings } from '@/lib/catalog';
import { PageTitle } from '@/components/shared/page-title';

type SP = Promise<Record<string, string | string[] | undefined>>;

/**
 * B3 · Kết quả tìm kiếm.
 *
 * `robots: noindex` cho trang có từ khoá: trang kết quả sinh ra vô hạn URL và
 * để Google đánh chỉ mục hết là tự làm loãng chính mình. Trang DANH MỤC thì
 * ngược lại — nó có URL hữu hạn, ổn định, và là nguồn khách long-tail chính.
 *
 * KHÔNG có bộ lọc thuộc tính ở đây, và đó là chủ ý: kết quả tìm kiếm trải
 * khắp mọi danh mục, mà "chất liệu" của áo thun và "định dạng" của file là hai
 * trục không so sánh được. Lọc theo thuộc tính chỉ có nghĩa khi đã ở trong một
 * nhánh danh mục — xem product-attributes.md §6.
 */
export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';
  return {
    title: q ? `${q} — POD Market` : 'Search — POD Market',
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const query = readQuery(sp);
  const listings = await searchListings(query);

  return (
    <BrowseLayout
      listings={listings}
      query={query.q}
      header={
        <header>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: query.q ? `Search: ${query.q}` : 'Search' },
            ]}
          />
          <PageTitle size="display" className="search-page__title">
            {query.q ? `Results for “${query.q}”` : 'Everything on POD Market'}
          </PageTitle>
          <p className="page__lede--under-title">
            Physical items are printed after you order. Design files download straight away.
          </p>
        </header>
      }
    />
  );
}
