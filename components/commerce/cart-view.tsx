'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { KindBadge } from '@/components/shared/kind-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { QuantityStepper } from './quantity-stepper';
import { OrderSummary } from './order-summary';
import { totals, type CartGroup } from '@/lib/cart';
import { deliveryWindow } from '@/lib/utils';

/**
 * A7 · Giỏ hàng nhóm theo shop.
 *
 * Giỏ **bắt buộc nhóm theo shop** vì mỗi shop là một đơn con, một kiện, một
 * dòng đối soát riêng. Danh sách phẳng không biểu diễn được điều đó — và hậu
 * quả không lộ ra ở màn giỏ, nó lộ ra ba ngày sau khi buyer nhận kiện đầu tiên
 * và nghĩ mình bị giao thiếu.
 *
 * Ô chọn ở ĐẦU NHÓM là ba trạng thái: chọn hết, không chọn, chọn một phần
 * (`indeterminate`). Trạng thái thứ ba phải đặt bằng JavaScript vì HTML không
 * có thuộc tính cho nó — đây là lý do có `useEffect` ở dưới, và là một trong
 * số rất ít chỗ `useEffect` là đúng.
 *
 * Buyer được thanh toán TỪNG PHẦN giỏ. Giỏ ba shop mà bắt trả hết một lần là
 * ép người ta xoá bớt rồi thêm lại sau — thao tác mà một nửa sẽ không quay lại
 * làm.
 */
export function CartView({ initial }: { initial: CartGroup[] }) {
  const [groups, setGroups] = React.useState(initial);

  const update = (lineId: string, patch: Partial<CartGroup['lines'][number]>) =>
    setGroups((gs) =>
      gs.map((g) => ({ ...g, lines: g.lines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)) })),
    );

  const remove = (lineId: string) =>
    setGroups((gs) =>
      gs.map((g) => ({ ...g, lines: g.lines.filter((l) => l.id !== lineId) })).filter((g) => g.lines.length),
    );

  const toggleShop = (shopSlug: string, on: boolean) =>
    setGroups((gs) =>
      gs.map((g) =>
        g.shopSlug === shopSlug ? { ...g, lines: g.lines.map((l) => ({ ...l, selected: on })) } : g,
      ),
    );

  const t = totals(groups);

  if (!groups.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="cart__empty-icon" />}
        title="Your cart is empty"
        action={
          <Button asChild>
            <Link href="/">Browse the marketplace</Link>
          </Button>
        }
      >
        Items you add stay here for 30 days, grouped by the shop they come from.
      </EmptyState>
    );
  }

  return (
    <div className="cart">
      <div className="cart__groups">
        {groups.map((g) => {
          const picked = g.lines.filter((l) => l.selected).length;
          const all = picked === g.lines.length;
          const some = picked > 0 && !all;
          const groupSubtotal = g.lines
            .filter((l) => l.selected)
            .reduce((s, l) => s + l.unitCents * l.qty, 0);
          const hasPhysical = g.lines.some((l) => l.selected && l.kind !== 'file');
          const freeByThreshold =
            g.freeShippingOverCents !== null && groupSubtotal >= g.freeShippingOverCents;

          return (
            <Card key={g.shopSlug}>
              <div className="cart__shop">
                <TriCheckbox
                  checked={all}
                  indeterminate={some}
                  onChange={(e) => toggleShop(g.shopSlug, e.target.checked)}
                  aria-label={`Select all items from ${g.shopName}`}
                />
                <Store className="cart__shop-icon" aria-hidden />
                <Link href={`/shop/${g.shopSlug}`} className="cart__shop-link">
                  {g.shopName}
                </Link>
              </div>

              <ul>
                {g.lines.map((l) => (
                  <li key={l.id} className="cart__item">
                    <Checkbox
                      className="cart__check"
                      checked={l.selected}
                      onChange={(e) => update(l.id, { selected: e.target.checked })}
                      aria-label={`Select ${l.title}`}
                    />

                    <Link href={`/product/${l.slug}`} className="cart__thumb">
                      <Image src={l.image} alt="" fill sizes="64px" className="parcel-lines__image" />
                    </Link>

                    <div className="cart__body">
                      <Link href={`/product/${l.slug}`} className="cart__title">
                        {l.title}
                      </Link>
                      {l.variantLabel && <p className="cart__variant">{l.variantLabel}</p>}
                      {l.personalisation && (
                        <p className="cart__personalisation">{l.personalisation}</p>
                      )}

                      <div className="cart__meta">
                        <KindBadge kind={l.kind} />
                        <span className="cart__eta">
                          {l.leadDays
                            ? `Arrives ${deliveryWindow('2026-07-29', l.leadDays[0], l.leadDays[1])}`
                            : 'Download link as soon as you pay'}
                        </span>
                      </div>

                      <div className="cart__actions">
                        {/* Hàng số: KHÔNG render ô số lượng, không phải vô hiệu hoá nó */}
                        {!l.qtyLocked && (
                          <QuantityStepper
                            label={`Quantity for ${l.title}`}
                            value={l.qty}
                            onChange={(v) => update(l.id, { qty: v })}
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(l.id)}
                          aria-label={`Remove ${l.title}`}
                        >
                          <Trash2 className="cart__remove-icon" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="cart__amount">
                      <Money cents={l.unitCents * l.qty} />
                      {l.qty > 1 && (
                        <p className="cart__each">
                          <Money cents={l.unitCents} tone="quiet" size="sm" /> each
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart__foot">
                <span>
                  {hasPhysical ? (
                    freeByThreshold || g.shippingCents === 0 ? (
                      <span className="cart__free">Free shipping on this parcel</span>
                    ) : (
                      <>
                        Shipping <Money cents={g.shippingCents} tone="quiet" size="sm" />
                        {g.freeShippingOverCents !== null && (
                          <>
                            {' · free over '}
                            <Money cents={g.freeShippingOverCents} tone="quiet" size="sm" />
                          </>
                        )}
                      </>
                    )
                  ) : (
                    'Digital items ship instantly — no delivery charge'
                  )}
                </span>
                <span>
                  Shop subtotal <Money cents={groupSubtotal} size="sm" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <OrderSummary
        totals={t}
        note="You will not be charged until the last step."
      >
        {/* Đi thẳng vào bước giao hàng. Nhánh đã đăng nhập hay khách vãng lai
            do cookie phiên quyết định ở server — không hỏi lại người dùng một
            câu mà hệ thống đã biết câu trả lời. */}
        <Button asChild block disabled={t.itemCount === 0}>
          <Link href="/checkout/delivery">
            {t.itemCount === 0 ? 'Select an item to continue' : 'Proceed to checkout'}
          </Link>
        </Button>
      </OrderSummary>
    </div>
  );
}

/**
 * Ô chọn ba trạng thái. `indeterminate` không có trong HTML — chỉ đặt được qua
 * thuộc tính DOM, nên phải chạm vào ref sau khi render.
 */
function TriCheckbox({
  indeterminate,
  ...props
}: React.ComponentProps<'input'> & { indeterminate?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return <Checkbox ref={ref} {...props} />;
}
