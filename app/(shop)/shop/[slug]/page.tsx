import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BrowseLayout } from '@/components/commerce/browse-layout';
import { SectionHeading } from '@/components/shared/section-heading';
import { ShopHeader, SHOP_TABS, type ShopTab } from '@/components/shop/shop-header';
import { ShopSidebar } from '@/components/shop/shop-sidebar';
import { ShopAbout, ShopPolicies, ShopReviews } from '@/components/shop/shop-panels';
import { getShop, readQuery, searchListings, SHOPS } from '@/lib/catalog';
import { getShopReviews } from '@/lib/products';
import type { FulfilmentKind } from '@/lib/products';

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

/**
 * B1 · Trang shop — bốn tab: Items · Reviews · About · Shop policies.
 *
 * ── Vì sao tab nằm ở URL ────────────────────────────────────────────────
 *
 * `?tab=reviews` gửi được cho người khác, quay lại được bằng nút Back, và
 * render sẵn ở server nên Google đọc được phần đánh giá. Ba thứ đó mất sạch
 * nếu tab là `useState`.
 *
 * ── Hai loại thông tin, tách rõ về mặt thị giác ─────────────────────────
 *
 *   HỆ THỐNG tính, seller không sửa được    SELLER tự viết
 *   ─────────────────────────────────────   ─────────────────────────
 *   điểm · số đơn · số năm · % đúng hạn     ảnh bìa · câu giới thiệu
 *   số người theo dõi · số đánh giá         câu chuyện · chính sách shop
 *
 * Nhóm thứ nhất nằm cạnh tên shop; nhóm thứ hai nằm trên ảnh bìa và trong hai
 * tab riêng. Trộn chúng lại thì nhóm thứ nhất mất chỗ đứng khách quan — mà đó
 * là toàn bộ lý do nó có giá trị.
 *
 * ── Rail trái ở đây KHÁC rail đã bỏ ở trang danh mục ────────────────────
 *
 * Trang danh mục lọc theo THUỘC TÍNH (màu, size, chất liệu) — nhiều nhóm,
 * nhiều giá trị, nên nó thuộc về panel mở ra khi cần. Rail này lọc theo LÁT
 * CẮT của một shop: tất cả, đang giảm giá, theo kiểu hàng. Năm dòng có số đếm,
 * và người xem shop nhìn chúng để hiểu shop bán gì hơn là để lọc.
 */
export async function generateStaticParams() {
  return SHOPS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShop(slug);
  if (!shop) return {};
  return {
    title: `${shop.name} — POD Market`,
    description: shop.tagline,
    alternates: { canonical: `/shop/${shop.slug}` },
  };
}

const isTab = (value: string | undefined): value is ShopTab =>
  SHOP_TABS.some((t) => t.id === value);

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { slug } = await params;
  const shop = await getShop(slug);
  if (!shop) notFound();

  const sp = await searchParams;
  const rawTab = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab: ShopTab = isTab(rawTab) ? rawTab : 'items';

  const query = readQuery(sp);
  const allOfShop = await searchListings({ shop: slug });
  const listings = await searchListings({ ...query, shop: slug });

  const header = (
    <ShopHeader
      shop={shop}
      tab={tab}
      itemCount={allOfShop.length}
      query={query.q}
      covers={allOfShop.slice(0, 3).map((l) => l.image)}
    />
  );

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: shop.name }]} />

      <div className="shop-page__header">{header}</div>

      <div className="shop-page__body">
        {tab === 'items' && (
          <div className="shop-page__items">
            <ShopSidebar
              slug={slug}
              listings={allOfShop}
              activeKind={
                query.kind && query.kind !== 'all' ? (query.kind as FulfilmentKind) : undefined
              }
              activeCategory={query.category?.join('/')}
              onSaleOnly={Boolean(query.onSale)}
              sales={shop.sales}
              admirers={shop.admirers}
            />

            <div className="shop-page__main">
              {/* Không có bộ lọc thuộc tính ở trang shop: hàng của một shop trải
                  nhiều danh mục, mà "chất liệu" của áo và "định dạng" của file
                  không so sánh được. */}
              <BrowseLayout
                listings={listings}
                query={query.q}
                header={<SectionHeading>Featured items</SectionHeading>}
              />
            </div>
          </div>
        )}

        {tab === 'reviews' && <ShopReviews shop={shop} reviews={await getShopReviews(slug)} />}
        {tab === 'about' && <ShopAbout shop={shop} />}
        {tab === 'policies' && <ShopPolicies shop={shop} />}
      </div>
    </>
  );
}
