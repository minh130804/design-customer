import type { Metadata, Route } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Flag, Sparkles } from 'lucide-react';
import { getProduct, getAllProductSlugs, getRelated, getShopListings } from '@/lib/products';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { KindBadge } from '@/components/shared/kind-badge';
import { SectionHeading } from '@/components/shared/section-heading';
import { Money } from '@/components/shared/money';
import { Button } from '@/components/ui/button';
import { ProductGallery } from '@/components/product/product-gallery';
import { PriceBlock } from '@/components/product/price-block';
import { BuyBox } from '@/components/product/buy-box';
import { StarRating } from '@/components/product/star-rating';
import { ItemDetails } from '@/components/product/item-details';
import { SellerCard } from '@/components/product/seller-card';
import { Reviews } from '@/components/product/reviews';
import { RelatedSearches, type ExploreTile } from '@/components/product/related-searches';
import { ProductGrid } from '@/components/commerce/product-grid';

/**
 * L3 · Chi tiết sản phẩm. SERVER COMPONENT — không có 'use client' ở đây.
 *
 * Chỉ hai nhánh là client:
 *   · ProductGallery — trạng thái ảnh đang chọn và khung phóng to
 *   · BuyBox         — trạng thái biến thể, số lượng, cá nhân hoá
 *
 * ── Thứ tự khối, lấy đúng từ trang sản phẩm Etsy ─────────────────────────
 *
 *                    ─── đường dẫn phân cấp, CĂN GIỮA ───
 *   ┌──────────────────────────────────┬────────────────────────┐
 *   │ thư viện ảnh (dải nhỏ dựng đứng) │ HỘP MUA                │
 *   │ ⚑ Report this item               │  · trong N giỏ          │
 *   │                                  │  · giá + đã gồm phí giao│
 *   │ Reviews for this item            │  · tiêu đề              │
 *   │   chủ đề người mua nhắc tới      │  · shop + sao           │
 *   │   vòng tròn điểm từng trục       │  · bảo đảm ngắn         │
 *   │   danh sách đánh giá             │  · chọn biến thể        │
 *   │   ảnh khách chụp                 │  · Buy it now  (viền)   │
 *   │                                  │  · Add to cart (đặc)    │
 *   │ THẺ NGƯỜI BÁN                    │  · Add to collection    │
 *   │   huy hiệu · More from this shop │ ▸ Item details          │
 *   │                                  │ ▸ Delivery and returns  │
 *   │                                  │ ▸ Did you know?         │
 *   └──────────────────────────────────┴────────────────────────┘
 *   You may also like
 *   Explore related searches · Explore more related searches
 *   Listed on … · N favourites        ─── đường dẫn phân cấp lặp lại ───
 *
 * Hai điểm đáng nói về thứ tự này:
 *
 * · **Thẻ người bán ở CỘT TRÁI**, không phải trong dải accordion bên phải.
 *   Cột phải là nơi để MUA; mọi thứ ở đó phải phục vụ quyết định mua. Người
 *   cuộn tới thẻ người bán đang hỏi một câu khác — "shop này có đáng tin
 *   không" — và câu đó cần chỗ.
 * · **Đường dẫn phân cấp lặp lại ở chân trang.** Người đọc hết trang đang ở
 *   xa header 4–5 màn hình; đưa họ về nhánh danh mục ngay tại chỗ rẻ hơn nhiều
 *   so với bắt cuộn ngược lên.
 *
 * MỌI listing đều có trang này. `getProduct` dựng sản phẩm từ danh mục của nó,
 * nên thêm một listing mới không phải viết thêm một trang mới.
 */

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};

  return {
    title: `${p.title} — ${p.shop.name}`,
    description: p.description[0],
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: 'website',
      title: p.title,
      description: p.description[0],
      // Thẻ chia sẻ luôn dùng ẢNH TĨNH: mục đại diện có thể là video, mà không
      // mạng xã hội nào render video trong thẻ xem trước — poster mới là thứ
      // họ hiển thị.
      images: [p.media[0]?.poster ?? p.media[0]?.src].filter((s): s is string => Boolean(s)),
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, shopListings] = await Promise.all([
    getRelated(slug),
    getShopListings(product.shop.slug, slug),
  ]);

  const path = product.categoryPath;
  const leaf = path[path.length - 1]!;

  // Đường dẫn danh mục ghép lúc chạy từ `categoryPath` của sản phẩm, nên
  // typedRoutes về nguyên tắc không kiểm được — cùng lý do với `Breadcrumbs`.
  const categoryHref = (depth: number) =>
    `/c/${path
      .slice(0, depth)
      .map((s) => s.toLowerCase().replace(/\s+/g, '-'))
      .join('/')}` as Route;

  const crumbs = [
    { label: 'Home', href: '/' },
    ...path.map((c, i) => ({ label: c, href: categoryHref(i + 1) })),
  ];

  /* Cụm từ khám phá dựng từ DANH MỤC và THUỘC TÍNH của chính sản phẩm, không
     phải một danh sách gõ tay. Nhờ vậy chúng luôn khớp nội dung trang, và
     không có cụm từ chết khi seller đổi danh mục. Ảnh ghép từ hàng liên quan
     — mỗi thẻ một ảnh khác nhau, cùng ảnh sáu lần trông như lỗi. */
  const terms = [
    leaf,
    ...product.attributes.slice(0, 3).map((a) => `${a.value} ${leaf}`),
    `${path[0]} by ${product.shop.name}`,
    product.shop.name,
  ].filter((t, i, all) => all.indexOf(t) === i);

  const exploreTiles: ExploreTile[] = terms.slice(0, 6).map((label, i) => ({
    label,
    href: `/search?q=${encodeURIComponent(label)}`,
    image: related[i % Math.max(1, related.length)]?.image ?? product.media[0]!.src,
  }));

  const exploreChips = [
    ...path.map((c) => `${c} ${product.kind === 'file' ? 'downloads' : 'gifts'}`),
    ...product.attributes.map((a) => `${a.label} ${a.value}`.toLowerCase()),
    `handmade ${leaf.toLowerCase()}`,
    `${leaf.toLowerCase()} made to order`,
  ]
    .filter((t, i, all) => all.indexOf(t) === i)
    .slice(0, 12);

  // Dữ liệu có cấu trúc — bắt buộc với sàn thương mại điện tử, thiếu nó thì
  // Google không hiện giá và sao đánh giá trong kết quả tìm kiếm.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.media.filter((m) => m.type === 'image').map((m) => m.src),
    description: product.description[0],
    brand: { '@type': 'Brand', name: product.shop.name },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── đường dẫn phân cấp, căn giữa ──────────────────────── */}
      <div className="product-page__crumbs">
        <Breadcrumbs items={crumbs} />
      </div>

      {/* Khối chọn–mua chặn 1120px thay vì chạy hết 1400px của trang.
          Khung ảnh vuông ở bề ngang đầy đủ cao tới hơn 800px — to hơn cả một
          màn hình laptop, nên người dùng phải cuộn mới thấy nút mua. Chặn lại
          thì ảnh còn ~610px và toàn bộ phần chọn–mua nằm gọn trên một màn.

          Các dải bên dưới (hàng liên quan, cụm từ khám phá) vẫn chạy hết chiều
          ngang: ở đó rộng hơn nghĩa là thêm được một cột sản phẩm. */}
      <div className="product-page__core">
      {/* ── HÀNG 1 · ảnh và phần chọn–mua ────────────────────────
          Nằm trong một lưới RIÊNG, tách khỏi phần đánh giá và thẻ người bán
          bên dưới: hai lưới cùng khuôn cột nên mép vẫn thẳng hàng, nhưng chiều
          cao của hàng này chỉ do ảnh và hộp mua quyết định.

          Cột phải khoá 340/380px thay vì `1fr`: với `2fr_1fr` trên màn 1400px
          nó rộng ~440px và phần chọn–mua trông ngang hàng với khung ảnh —
          thành phần chính của trang thay vì phần phụ. */}
      <div className="product-page__row">
        <div>
          <ProductGallery media={product.media} />

          <p className="product-page__report">
            <button
              type="button"
              className="product-page__report-btn"
            >
              <Flag className="product-page__report-icon" aria-hidden />
              Report this item
            </button>
          </p>
        </div>

        {/* Không có viền, không nền, không đổ bóng.
            Cột này đã được tách khỏi phần còn lại bằng khoảng trắng 60px và
            bằng chính vị trí của nó; thêm một cái khung nữa là vẽ lại một ranh
            giới mà mắt đã thấy. Etsy cũng để trần — xem ảnh chụp trang sản
            phẩm trong document/05-nghien-cuu-doi-thu/. */}
        <div id="buy-box" className="product-page__buy">
            {/* khan hiếm — số THẬT từ backend, không phải đồng hồ đếm ngược bịa */}
            {product.inCarts >= 20 && (
              <p className="product-page__scarcity">
                <Sparkles className="product-page__scarcity-icon" aria-hidden />
                In {product.inCarts}+ carts right now
              </p>
            )}

            <PriceBlock
              priceCents={product.priceCents}
              compareAtCents={product.compareAtCents}
              shippingCents={product.shippingCents}
              saleLabel="Limited time sale"
            />

            {/* TIÊU ĐỀ — 16px thường, nhỏ hơn giá. Đây là chủ ý, xem §2 */}
            <h1 className="product-page__title">{product.title}</h1>

            <div className="product-page__shop">
              <Link
                href={`/shop/${product.shop.slug}` as Route}
                className="product-page__shop-link"
              >
                {product.shop.name}
              </Link>
              <StarRating value={product.rating} count={product.reviewCount} />
            </div>

            {/* Nhãn kiểu hàng KHÔNG còn `force`.
                Quy tắc ở ui-design.md §A2: buyer không cần biết áo được in ở
                đâu, chỉ cần biết bao giờ nhận — nên `stock` và `pod` không hiện
                nhãn nào. Riêng HÀNG SỐ bắt buộc hiện, vì mua nhầm thì buyer
                ngồi đợi một kiện hàng không bao giờ tới, và đó là loại khiếu
                nại tốn tiền nhất để xử lý. `KindBadge` tự trả về null cho hai
                kiểu kia. */}
            <div className="product-page__kind">
              <KindBadge kind={product.kind} />
            </div>

          <div className="product-page__buy-box">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* ── HÀNG 2 · cùng lưới cột để hai bên vẫn thẳng hàng ─────
          `items-start` ở đây chứ không stretch: cột trái dài mấy màn hình, kéo
          khối accordion bên phải cao bằng nó là tạo ra một dải trống khổng lồ. */}
      <div className="product-page__row product-page__row--below">
        <div>
          <Reviews product={product} />
          <SellerCard shop={product.shop} listings={shopListings} />
        </div>

        <div>
          <ItemDetails product={product} />
        </div>
      </div>
      </div>

      {/* ── Sản phẩm liên quan ────────────────────────────────
          Xếp theo độ gần: cùng danh mục lá trước, rồi cùng nhánh gốc, rồi cùng
          shop. Trộn ngẫu nhiên trông "đa dạng" hơn nhưng tỉ lệ bấm thấp hơn —
          người đang xem áo thun muốn xem áo thun khác, không muốn xem ly sứ. */}
      {related.length > 0 && (
        <section className="product-page__related">
          <SectionHeading
            className="product-page__related-heading"
            action={
              <Link
                href={categoryHref(path.length)}
                className="product-page__see-more"
              >
                See more
              </Link>
            }
          >
            You may also like
          </SectionHeading>
          <ProductGrid listings={related} />
        </section>
      )}

      <RelatedSearches tiles={exploreTiles} chips={exploreChips} />

      {/* ── chân trang sản phẩm ───────────────────────────────── */}
      <div className="product-page__foot">
        <p className="product-page__foot-text">
          Listed on {product.listedAt} ·{' '}
          <span className="product-page__favourites">{product.favourites.toLocaleString('en-US')}</span> favourites
        </p>
        <div className="product-page__foot-crumbs">
          <Breadcrumbs items={crumbs} />
        </div>
      </div>

      {/* Chừa chỗ cho thanh dính đáy, nếu không nó che mất dòng cuối */}
      <div className="product-page__spacer" aria-hidden />

      {/* ── thanh mua dính đáy · chỉ trên màn hẹp ─────────────
          Không nhân bản nút mua: nhân bản nghĩa là hai chỗ cùng giữ trạng thái
          biến thể và sớm muộn chúng lệch nhau. Thanh này chỉ CUỘN TỚI hộp mua
          thật, nơi người dùng vẫn phải chọn size trước khi bấm. */}
      <div
        className="product-page__bar"
      >
        <div className="product-page__bar-info">
          <Money cents={product.priceCents} size="lg" />
          <p className="product-page__bar-shop">{product.shop.name}</p>
        </div>
        <Button asChild className="product-page__bar-cta">
          {/* Hàng số không còn trục biến thể nào để chọn (giấy phép đã bỏ), nên
              nhãn phải nói đúng việc: cuộn tới hộp mua rồi bấm thêm vào giỏ. */}
          <a href="#buy-box">{product.kind === 'file' ? 'Add to cart' : 'Choose options'}</a>
        </Button>
      </div>
    </>
  );
}
