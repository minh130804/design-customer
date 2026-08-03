'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight, Menu, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuNode } from '@/lib/catalog';

/**
 * Menu danh mục — HAI cột, dừng ở đó.
 *
 *   cột 1  nhánh gốc  Clothing · Digital · Art …   (danh sách chữ)
 *   cột 2  nhánh con  Tops · Fonts …               (THẺ CÓ ẢNH)
 *                     →  bấm là ra thẳng danh sách hàng
 *
 * ── Vì sao cột 2 là thẻ có ảnh, cột 1 thì không ─────────────────────────
 *
 * Nhánh gốc là những từ ai cũng hiểu — *Clothing*, *Home* — nên ảnh không thêm
 * gì mà chỉ làm cột dài gấp ba. Nhánh con thì ngược lại: *Tops* hay *Graphics*
 * không nói được shop bán loại đồ nào, và một ô ảnh trả lời điều đó nhanh hơn
 * mọi cách viết lại nhãn.
 *
 * ── Vì sao dừng ở hai tầng ───────────────────────────────────────────────
 *
 * Menu không nên gánh việc của trang danh mục: cú bấm ở cột 2 phải dẫn tới
 * HÀNG, không dẫn tới một menu nữa. Đi sâu hơn để cho trang danh mục làm — ở
 * đó đã có dải thẻ nhánh con, có bộ lọc, và có sẵn sản phẩm để nhìn trong lúc
 * chọn.
 *
 * Nhánh cha vẫn bấm được: `/c/clothing/tops` trả về mọi sản phẩm nằm dưới
 * `tops`, không phải một trang trung gian rỗng.
 *
 * ── Ba quyết định về tương tác ───────────────────────────────────────────
 *
 * 1. **Mở panel bằng BẤM, đổi nhánh bằng RÊ.** Menu tự bung khi chuột đi ngang
 *    qua là nguyên nhân số một của "menu nhảy ra khi tôi định bấm cái khác".
 *    Sau khi panel đã mở thì rê là cử chỉ khám phá, không phải cử chỉ chọn.
 * 2. **Rê KHÔNG điều hướng.** Quét qua sáu nhánh để xem chúng có gì không tốn
 *    lượt tải trang nào.
 * 3. **Mọi mục ở cả hai cột đều là `<Link>` thật.** Menu chỉ có mục cha "để mở
 *    ra tiếp" là ngõ cụt cho người dùng bàn phím và cho Google.
 */
export function CategoryMenu({ tree }: { tree: MenuNode[] }) {
  const [open, setOpen] = React.useState(false);
  const [rootSlug, setRootSlug] = React.useState(tree[0]?.slug ?? '');
  const rootRef = React.useRef<HTMLDivElement>(null);

  const activeRoot = tree.find((n) => n.slug === rootSlug) ?? tree[0];

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!tree.length) return null;

  return (
    <div ref={rootRef} className="category-menu">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn('category-menu__trigger', open && 'category-menu__trigger--open')}
      >
        {open ? (
          <X className="category-menu__trigger-icon" />
        ) : (
          <Menu className="category-menu__trigger-icon" />
        )}
        <span className="category-menu__trigger-label">Categories</span>
      </button>

      {open && (
        <>
          {/* Lớp phủ bắt cú bấm đầu tiên ra ngoài menu, nên cú bấm đó chỉ đóng
              menu chứ không kích hoạt nhầm một sản phẩm nằm bên dưới. */}
          <div className="category-menu__scrim" aria-hidden onClick={() => setOpen(false)} />

          <div className="category-menu__panel">
            {/* ── cột 1 · nhánh gốc ──────────────────────────── */}
            <ul className="category-menu__roots">
              {tree.map((root) => (
                <Row
                  key={root.slug}
                  href={root.href}
                  label={root.label}
                  active={root.slug === activeRoot?.slug}
                  chevron
                  onEnter={() => setRootSlug(root.slug)}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </ul>

            {/* ── cột 2 · nhánh con, dạng THẺ CÓ ẢNH · bấm là ra hàng ─── */}
            <div className="category-menu__sub">
              {activeRoot && (
                <>
                  <Link
                    href={activeRoot.href as Route}
                    onClick={() => setOpen(false)}
                    className="category-menu__all"
                  >
                    All of {activeRoot.label}
                    <ArrowRight className="category-menu__all-icon" aria-hidden />
                  </Link>

                  <ul className="category-menu__grid">
                    {activeRoot.children.map((child) => (
                      <li key={child.slug}>
                        {/* Không cần `group`: trạng thái rê đi qua bộ chọn con
                            (`.category-menu__card:hover .category-menu__media`),
                            nên JSX giữ đúng một class mỗi thẻ. */}
                        <Link
                          href={child.href as Route}
                          onClick={() => setOpen(false)}
                          className="category-menu__card"
                        >
                          <div className="category-menu__media">
                            <Image
                              src={child.image}
                              alt=""
                              fill
                              unoptimized
                              sizes="160px"
                              className="category-menu__image"
                            />
                          </div>
                          <p className="category-menu__caption">{child.label}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({
  href,
  label,
  active,
  chevron,
  onEnter,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  /** Chỉ cột 1 có mũi tên — nó báo "còn một tầng nữa", cột 2 thì không */
  chevron?: boolean;
  onEnter?: () => void;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href as Route}
        onMouseEnter={onEnter}
        onFocus={onEnter}
        onClick={onNavigate}
        className={cn('category-menu__row', active && 'category-menu__row--active')}
      >
        <span className="category-menu__row-label">{label}</span>
        {chevron && <ChevronRight className="category-menu__row-chevron" aria-hidden />}
      </Link>
    </li>
  );
}
