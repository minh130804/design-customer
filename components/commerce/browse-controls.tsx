'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronRight, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import { Sheet } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { KIND_FACET, SORTS, type Facet, type SortKey } from '@/lib/catalog';

/**
 * Bộ lọc — MỘT nút "All Filters" mở panel trượt từ trái, không phải rail cố định.
 *
 * ── Vì sao bỏ rail ───────────────────────────────────────────────────────
 *
 * Rail 240px ăn một phần sáu chiều ngang ở MỌI lúc, kể cả khi người dùng không
 * lọc gì — mà phần lớn phiên duyệt là như vậy. Đổi lại, lưới sản phẩm rộng
 * thêm được một cột và ảnh to hẳn lên, thứ quyết định tỉ lệ bấm trên sàn bán
 * đồ nhìn-là-mua.
 *
 * ── Vì sao có Cancel / Apply thay vì lọc ngay khi tích ───────────────────
 *
 * Panel này dài hơn hai màn hình. Nếu mỗi ô tích đẩy một lượt điều hướng thì
 * người dùng chọn năm tiêu chí sẽ tạo năm lượt tải, năm mục lịch sử, và lưới
 * phía sau nhảy liên tục trong lúc họ còn đang chọn. Gom lại thành một lượt
 * `Apply` là đúng với cách người ta thật sự dùng: chọn xong mới muốn xem.
 *
 * Hệ quả bắt buộc: **`Cancel` phải huỷ thật.** Nháp được nạp lại từ URL mỗi lần
 * mở panel, nên đóng panel không để lại dấu vết gì.
 *
 * Đánh đổi đã chấp nhận: bộ lọc không còn nhìn thấy thường trực. Bù lại bằng
 * hai thứ — số đếm trên nút, và **dải chip tiêu chí đang bật** dưới thanh công
 * cụ, gỡ được từng cái. Không có hai thứ đó thì người dùng quên mất mình đang
 * lọc và kết luận là sàn hết hàng.
 */

const ATTR_PREFIX = 'a_';

/* ── Nháp: ảnh chụp của bộ lọc trong lúc người dùng còn đang chọn ────── */

type Draft = {
  kind: string;
  price: 'any' | 'under' | 'mid' | 'high' | 'custom';
  min: string;
  max: string;
  rating: string;
  free: boolean;
  sale: boolean;
  attrs: Record<string, string[]>;
};

const PRICE_BANDS = {
  under: { min: '', max: '2000', label: 'Under $20' },
  mid: { min: '2000', max: '5000', label: '$20 to $50' },
  high: { min: '5000', max: '10000', label: '$50 to $100' },
} as const;

function draftFromParams(params: URLSearchParams): Draft {
  const min = params.get('min') ?? '';
  const max = params.get('max') ?? '';

  let price: Draft['price'] = 'any';
  if (min || max) {
    const band = (Object.keys(PRICE_BANDS) as (keyof typeof PRICE_BANDS)[]).find(
      (k) => PRICE_BANDS[k].min === min && PRICE_BANDS[k].max === max,
    );
    price = band ?? 'custom';
  }

  const attrs: Record<string, string[]> = {};
  params.forEach((value, key) => {
    if (key.startsWith(ATTR_PREFIX)) attrs[key.slice(2)] = value.split(',').filter(Boolean);
  });

  return {
    kind: params.get('kind') ?? 'all',
    price,
    min: min ? String(Number(min) / 100) : '',
    max: max ? String(Number(max) / 100) : '',
    rating: params.get('rating') ?? '',
    free: params.get('free') === '1',
    sale: params.get('sale') === '1',
    attrs,
  };
}

/** Đếm số TIÊU CHÍ đang bật, không phải số giá trị — "3 filters" dễ hiểu hơn "7 values". */
function activeCount(d: Draft) {
  return (
    (d.kind !== 'all' ? 1 : 0) +
    (d.price !== 'any' ? 1 : 0) +
    (d.rating ? 1 : 0) +
    (d.free ? 1 : 0) +
    (d.sale ? 1 : 0) +
    Object.values(d.attrs).filter((v) => v.length).length
  );
}

function useApply() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();

  return React.useCallback(
    (draft: Draft) => {
      const next = new URLSearchParams();
      // Giữ lại thứ KHÔNG thuộc bộ lọc: từ khoá và cách sắp xếp. Xoá sạch rồi
      // dựng lại là cách duy nhất chắc chắn bỏ được tiêu chí người dùng vừa gỡ.
      const q = params.get('q');
      const sort = params.get('sort');
      if (q) next.set('q', q);
      if (sort) next.set('sort', sort);

      if (draft.kind !== 'all') next.set('kind', draft.kind);
      if (draft.rating) next.set('rating', draft.rating);
      if (draft.free) next.set('free', '1');
      if (draft.sale) next.set('sale', '1');

      if (draft.price === 'custom') {
        const toCents = (v: string) => {
          const n = Number(v.replace(/[^\d.]/g, ''));
          return n > 0 ? String(Math.round(n * 100)) : '';
        };
        const min = toCents(draft.min);
        const max = toCents(draft.max);
        if (min) next.set('min', min);
        if (max) next.set('max', max);
      } else if (draft.price !== 'any') {
        const band = PRICE_BANDS[draft.price];
        if (band.min) next.set('min', band.min);
        if (band.max) next.set('max', band.max);
      }

      for (const [code, values] of Object.entries(draft.attrs)) {
        if (values.length) next.set(ATTR_PREFIX + code, values.join(','));
      }

      const qs = next.toString();
      // `path` từ `usePathname()` chỉ là `string`; `Route` là kiểu thoát chính
      // thức của Next cho URL dựng lúc chạy.
      router.push((qs ? `${path}?${qs}` : path) as Route, { scroll: false });
    },
    [router, path, params],
  );
}

/* ── Thanh công cụ ───────────────────────────────────────────────────── */

export function BrowseToolbar({
  total,
  facets,
  categoryLinks,
  categoryLabel,
}: {
  total: number;
  facets: Facet[];
  categoryLinks?: { label: string; href: string }[];
  categoryLabel?: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const apply = useApply();
  const sort = (params.get('sort') ?? 'relevance') as SortKey;
  const applied = draftFromParams(new URLSearchParams(params.toString()));
  const count = activeCount(applied);

  const clearOne = (patch: Partial<Draft>) => apply({ ...applied, ...patch });

  /* Sắp xếp KHÔNG đi qua nháp: nó là một lựa chọn duy nhất, đổi là muốn thấy
     kết quả ngay. Bắt nó chờ nút Apply chung với bộ lọc là thêm một cú bấm cho
     thao tác thường xuyên nhất trên trang. */
  function changeSort(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === 'relevance') next.delete('sort');
    else next.set('sort', value);
    const qs = next.toString();
    router.push((qs ? `${path}?${qs}` : path) as Route, { scroll: false });
  }

  return (
    <>
      <div className="browse-toolbar">
        <FilterDrawer
          total={total}
          facets={facets}
          categoryLinks={categoryLinks}
          categoryLabel={categoryLabel}
          activeCount={count}
        />

        <div className="browse-toolbar__right">
          <p className="browse-toolbar__count">
            {total.toLocaleString('en-US')} {total === 1 ? 'item' : 'items'}
          </p>
          <label className="browse-toolbar__sort">
            <span className="browse-toolbar__sort-label">Sort by</span>
            <NativeSelect
              aria-label="Sort by"
              wrapperClassName="browse-toolbar__sort-wrap"
              className="browse-toolbar__sort-field"
              value={sort}
              onChange={(e) => changeSort(e.target.value)}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </label>
        </div>
      </div>

      {/* Chip tiêu chí đang bật — cái giá phải trả cho việc bỏ rail, và là cách
          duy nhất để người dùng thấy mình đang lọc mà không phải mở panel. */}
      {count > 0 && (
        <ul className="browse-toolbar__chips">
          {applied.kind !== 'all' && (
            <FilterChip
              label={KIND_FACET.find((k) => k.value === applied.kind)?.label ?? applied.kind}
              onRemove={() => clearOne({ kind: 'all' })}
            />
          )}
          {applied.price !== 'any' && (
            <FilterChip
              label={
                applied.price === 'custom'
                  ? `$${applied.min || '0'}–$${applied.max || '∞'}`
                  : PRICE_BANDS[applied.price].label
              }
              onRemove={() => clearOne({ price: 'any', min: '', max: '' })}
            />
          )}
          {applied.rating && (
            <FilterChip
              label={`${applied.rating}★ and up`}
              onRemove={() => clearOne({ rating: '' })}
            />
          )}
          {applied.free && (
            <FilterChip label="Free shipping" onRemove={() => clearOne({ free: false })} />
          )}
          {applied.sale && <FilterChip label="On sale" onRemove={() => clearOne({ sale: false })} />}

          {Object.entries(applied.attrs).flatMap(([code, values]) => {
            const facet = facets.find((f) => f.code === code);
            return values.map((v) => (
              <FilterChip
                key={`${code}-${v}`}
                label={facet?.options.find((o) => o.value === v)?.label ?? v}
                onRemove={() =>
                  clearOne({
                    attrs: { ...applied.attrs, [code]: values.filter((x) => x !== v) },
                  })
                }
              />
            ));
          })}

          <li>
            <button
              type="button"
              onClick={() =>
                apply({
                  kind: 'all',
                  price: 'any',
                  min: '',
                  max: '',
                  rating: '',
                  free: false,
                  sale: false,
                  attrs: {},
                })
              }
              className="browse-toolbar__clear"
            >
              Clear all
            </button>
          </li>
        </ul>
      )}
    </>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        className="filter-chip"
      >
        {label}
        <X className="filter-chip__icon" aria-hidden />
        <span className="sr-only">Remove filter</span>
      </button>
    </li>
  );
}

/* ── Panel lọc ───────────────────────────────────────────────────────── */

function FilterDrawer({
  total,
  facets,
  categoryLinks,
  categoryLabel,
  activeCount: count,
}: {
  total: number;
  facets: Facet[];
  categoryLinks?: { label: string; href: string }[];
  categoryLabel?: string;
  activeCount: number;
}) {
  const params = useSearchParams();
  const apply = useApply();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(() =>
    draftFromParams(new URLSearchParams(params.toString())),
  );

  // Nạp lại nháp mỗi lần MỞ, không phải mỗi lần render: nhờ vậy Cancel huỷ thật,
  // và một lượt lọc vừa áp xong không ghi đè thứ người dùng đang gõ dở.
  function openPanel() {
    setDraft(draftFromParams(new URLSearchParams(params.toString())));
    setOpen(true);
  }

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const toggleAttr = (code: string, value: string) =>
    setDraft((d) => {
      const current = d.attrs[code] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...d, attrs: { ...d.attrs, [code]: next } };
    });

  return (
    <>
      {/* `size="sm"` để cao 32px, bằng ô sắp xếp ngay cạnh — nút 40px cạnh ô
          32px là chỗ lệch dễ thấy nhất trên một thanh công cụ. */}
      <Button variant="outline" size="sm" onClick={openPanel}>
        <SlidersHorizontal className="browse-toolbar__filter-icon" />
        All filters
        {count > 0 && <span className="browse-toolbar__filter-count">{count}</span>}
      </Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        side="left"
        title="Filters"
        footer={
          <div className="filter-panel__foot">
            <Button variant="outline" block onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              block
              onClick={() => {
                apply(draft);
                setOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        }
      >
        <div className="filter-panel">
          {/* ── lọc theo danh mục ───────────────────────────── */}
          {categoryLinks && categoryLinks.length > 0 && (
            <Group title="Filter by category">
              {categoryLabel && <p className="filter-panel__current">{categoryLabel}</p>}
              <ul>
                {categoryLinks.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href as Route}
                      onClick={() => setOpen(false)}
                      className="filter-panel__category"
                    >
                      {c.label}
                      <ChevronRight className="filter-panel__category-icon" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Group>
          )}

          {/* ── ưu đãi ──────────────────────────────────────── */}
          <Group title="Special offers">
            <Tick
              label="Free shipping"
              checked={draft.free}
              onChange={() => set({ free: !draft.free })}
            />
            <Tick label="On sale" checked={draft.sale} onChange={() => set({ sale: !draft.sale })} />
          </Group>

          {/* ── kiểu hàng ───────────────────────────────────── */}
          <Group title="Item type">
            {/* Chữ hiển thị KHÔNG dùng từ "POD". Buyer không cần biết hàng in ở
                đâu, họ cần biết bao giờ nhận — xem ui-design.md §B2. */}
            {KIND_FACET.map((f) => (
              <Pick
                key={f.value}
                name="kind"
                label={f.label}
                checked={draft.kind === f.value}
                onChange={() => set({ kind: f.value })}
              />
            ))}
          </Group>

          {/* ── giá ─────────────────────────────────────────── */}
          <Group title="Price" note="Before shipping and taxes">
            <Pick
              name="price"
              label="Any price"
              checked={draft.price === 'any'}
              onChange={() => set({ price: 'any', min: '', max: '' })}
            />
            {(Object.keys(PRICE_BANDS) as (keyof typeof PRICE_BANDS)[]).map((band) => (
              <Pick
                key={band}
                name="price"
                label={PRICE_BANDS[band].label}
                checked={draft.price === band}
                onChange={() => set({ price: band, min: '', max: '' })}
              />
            ))}
            <Pick
              name="price"
              label="Custom"
              checked={draft.price === 'custom'}
              onChange={() => set({ price: 'custom' })}
            />
            {draft.price === 'custom' && (
              <div className="filter-panel__range">
                {/* inputMode="decimal", KHÔNG dùng type="number": cuộn chuột trên
                    ô số làm đổi giá trị mà người dùng không nhận ra. */}
                <Input
                  inputMode="decimal"
                  placeholder="Low"
                  aria-label="Lowest price"
                  className="filter-panel__range-input"
                  value={draft.min}
                  onChange={(e) => set({ min: e.target.value })}
                />
                <span className="filter-panel__range-sep">to</span>
                <Input
                  inputMode="decimal"
                  placeholder="High"
                  aria-label="Highest price"
                  className="filter-panel__range-input"
                  value={draft.max}
                  onChange={(e) => set({ max: e.target.value })}
                />
              </div>
            )}
          </Group>

          {/* ── đánh giá ────────────────────────────────────── */}
          <Group title="Rating">
            <Pick
              name="rating"
              label="Any rating"
              checked={!draft.rating}
              onChange={() => set({ rating: '' })}
            />
            {['4.5', '4', '3'].map((r) => (
              <Pick
                key={r}
                name="rating"
                label={`${r} and up`}
                checked={draft.rating === r}
                onChange={() => set({ rating: r })}
              />
            ))}
          </Group>

          {/* ── thuộc tính động của danh mục ────────────────── */}
          {facets.map((facet) => (
            <Group key={facet.code} title={facet.label}>
              <ShowMore
                items={facet.options}
                render={(o) => (
                  <Tick
                    key={o.value}
                    label={o.label}
                    count={o.count}
                    swatch={facet.inputType === 'SWATCH' ? o.swatch : undefined}
                    checked={(draft.attrs[facet.code] ?? []).includes(o.value)}
                    onChange={() => toggleAttr(facet.code, o.value)}
                  />
                )}
              />
            </Group>
          ))}
        </div>
      </Sheet>
    </>
  );
}

/* ── Mảnh dùng lại trong panel ───────────────────────────────────────── */

function Group({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="filter-group__title">{title}</legend>
      {note && <p className="filter-group__note">{note}</p>}
      <div className="filter-group__body">{children}</div>
    </fieldset>
  );
}

function Tick({
  label,
  count,
  swatch,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  swatch?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="filter-option">
      <input
        type="checkbox"
        className="filter-option__input"
        checked={checked}
        onChange={onChange}
      />
      {swatch && (
        <span aria-hidden className="filter-option__swatch" style={{ background: swatch }} />
      )}
      <span className="filter-option__label">{label}</span>
      {count !== undefined && <span className="filter-option__count">{count}</span>}
    </label>
  );
}

function Pick({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="filter-option">
      <input
        type="radio"
        name={name}
        className="filter-option__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="filter-option__label">{label}</span>
    </label>
  );
}

/**
 * Danh sách dài thì cắt còn 5 dòng và mở tiếp bằng "Show more".
 *
 * Năm chứ không phải mười: nhóm *Colour* của Etsy có hơn hai mươi giá trị, và
 * bốn nhóm liên tiếp mở hết là một panel dài sáu màn hình mà không ai cuộn tới
 * đáy. Cắt ngắn khiến các nhóm bên dưới còn cơ hội được nhìn thấy.
 */
function ShowMore<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(false);
  const LIMIT = 5;
  const hidden = items.length - LIMIT;

  return (
    <>
      {(expanded ? items : items.slice(0, LIMIT)).map(render)}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="show-more"
        >
          {expanded ? (
            <Minus className="show-more__icon" />
          ) : (
            <Plus className="show-more__icon" />
          )}
          {expanded ? 'Show less' : `Show ${hidden} more`}
        </button>
      )}
    </>
  );
}
