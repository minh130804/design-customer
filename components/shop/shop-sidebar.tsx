import Link from 'next/link';
import type { Route } from 'next';
import { Flag, MessageSquare, PencilRuler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { shopCategories, type Listing } from '@/lib/catalog';
import type { FulfilmentKind } from '@/lib/products';

/**
 * Rail trái của trang shop.
 *
 * ── Vì sao rail này TỒN TẠI, trong khi trang danh mục đã bỏ rail ────────
 *
 * Hai chỗ lọc hai thứ khác nhau. Trang danh mục lọc theo THUỘC TÍNH (màu, size,
 * chất liệu) — nhiều nhóm, mỗi nhóm nhiều giá trị, nên nó thuộc về một panel
 * mở ra khi cần. Rail này lọc theo LÁT CẮT của một shop: danh mục shop bán,
 * đang giảm giá, kiểu hàng. Người xem một shop nhìn chúng để hiểu shop này bán
 * gì chứ không hẳn để lọc.
 *
 * ── Danh mục sinh từ HÀNG CỦA SHOP, không phải cây toàn sàn ─────────────
 *
 * Shop bán áo và túi thì rail chỉ có hai dòng đó. Liệt kê cả cây rồi để hai
 * mươi dòng đếm 0 là biến bộ lọc thành danh sách những thứ shop này KHÔNG bán.
 *
 * ── Số đếm là bắt buộc ─────────────────────────────────────────────────
 *
 * "On sale" không có số thì người dùng bấm vào rồi mới biết là rỗng. Lát cắt
 * nào không có món nào thì không hiện dòng đó.
 *
 * Hai nút hành động nằm NGAY dưới bộ lọc chứ không ở cuối rail: *Request a
 * custom order* là thứ chỉ trang shop mới có, và nó là lý do nhiều người mở
 * trang shop thay vì mua thẳng từ trang sản phẩm.
 */
const KIND_SLICES: { kind: FulfilmentKind; label: string }[] = [
  { kind: 'stock', label: 'Ready to ship' },
  { kind: 'pod', label: 'Made for you' },
  { kind: 'file', label: 'Instant download' },
];

export function ShopSidebar({
  slug,
  listings,
  activeKind,
  activeCategory,
  onSaleOnly,
  sales,
  admirers,
}: {
  slug: string;
  /** Toàn bộ hàng của shop, CHƯA lọc — số đếm phải tính trên tập này */
  listings: Listing[];
  activeKind?: FulfilmentKind;
  /** Đường dẫn danh mục đang lọc, ví dụ `clothing/tops/t-shirts` */
  activeCategory?: string;
  onSaleOnly: boolean;
  sales: number;
  admirers: number;
}) {
  const base = `/shop/${slug}`;
  const nothingActive = !activeKind && !activeCategory && !onSaleOnly;

  const categories = shopCategories(listings);
  const onSaleCount = listings.filter(
    (l) => l.compareAtCents && l.compareAtCents > l.priceCents,
  ).length;

  const kinds = KIND_SLICES.map((s) => ({
    href: `${base}?kind=${s.kind}`,
    label: s.label,
    count: listings.filter((l) => l.kind === s.kind).length,
    active: activeKind === s.kind,
  })).filter((s) => s.count > 0);

  return (
    <aside className="shop-sidebar" aria-label="Shop sections">
      {/* ── danh mục của riêng shop ────────────────────────── */}
      <nav aria-label="Categories in this shop">
        <h2 className="shop-sidebar__title">Categories</h2>
        <ul>
          <Slice href={base} label="All items" count={listings.length} active={nothingActive} />
          {categories.map((c) => (
            <Slice
              key={c.path.join('/')}
              href={`${base}?cat=${c.path.join('/')}`}
              label={c.label}
              count={c.count}
              active={activeCategory === c.path.join('/')}
            />
          ))}
        </ul>
      </nav>

      {/* ── lát cắt khác ───────────────────────────────────── */}
      {(onSaleCount > 0 || kinds.length > 1) && (
        <nav aria-label="Other ways to browse" className="shop-sidebar__group">
          <h2 className="shop-sidebar__title">Ways to buy</h2>
          <ul>
            {onSaleCount > 0 && (
              <Slice
                href={`${base}?sale=1`}
                label="On sale"
                count={onSaleCount}
                active={onSaleOnly}
              />
            )}
            {kinds.map((k) => (
              <Slice key={k.href} href={k.href} label={k.label} count={k.count} active={k.active} />
            ))}
          </ul>
        </nav>
      )}

      <div className="shop-sidebar__actions">
        <Button block>
          <PencilRuler className="shop-sidebar__action-icon" />
          Request a custom order
        </Button>
        <Button block variant="outline">
          <MessageSquare className="shop-sidebar__action-icon" />
          Contact shop owner
        </Button>
      </div>

      <dl className="shop-sidebar__stats">
        <div className="shop-sidebar__stat">
          <dt className="shop-sidebar__stat-term">Sales</dt>
          <dd className="shop-sidebar__stat-value">{sales.toLocaleString('en-US')}</dd>
        </div>
        <div className="shop-sidebar__stat">
          <dt className="shop-sidebar__stat-term">Admirers</dt>
          <dd className="shop-sidebar__stat-value">{admirers.toLocaleString('en-US')}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="shop-sidebar__report"
      >
        <Flag className="shop-sidebar__report-icon" aria-hidden />
        Report this shop
      </button>
    </aside>
  );
}

function Slice({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href as Route}
        aria-current={active ? 'page' : undefined}
        className={cn('shop-slice', active && 'shop-slice--active')}
      >
        {label}
        <span className="shop-slice__count">{count}</span>
      </Link>
    </li>
  );
}
