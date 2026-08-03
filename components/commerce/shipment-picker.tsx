'use client';

import * as React from 'react';
import Image from 'next/image';
import { Package, Download } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { NativeSelect } from '@/components/ui/native-select';
import { Money } from '@/components/shared/money';
import type { Parcel } from '@/lib/cart';

/**
 * Bước 5 · Vận chuyển — hiện **từng kiện riêng**, mỗi kiện chọn phương thức
 * riêng.
 *
 * Một shop có cả áo lẫn file thì đây là HAI kiện. Gộp lại thì không chọn được
 * vận chuyển riêng, và quan trọng hơn: trạng thái hai bên khác nhau hoàn toàn —
 * file được cấp quyền tải ngay khi thanh toán xong, áo còn nằm chờ xưởng in.
 *
 * Kiện hàng số KHÔNG có ô chọn: chỉ có đúng một cách giao và nó miễn phí. Một ô
 * chọn có duy nhất một lựa chọn là một câu hỏi giả.
 */
export function ShipmentPicker({
  parcels,
  onTotalChange,
}: {
  parcels: Parcel[];
  onTotalChange?: (cents: number) => void;
}) {
  const [choice, setChoice] = React.useState<Record<string, string>>(
    () => Object.fromEntries(parcels.map((p) => [p.id, p.options[0]!.value])),
  );

  const total = parcels.reduce((sum, p) => {
    const opt = p.options.find((o) => o.value === choice[p.id]);
    return sum + (opt?.costCents ?? 0);
  }, 0);

  React.useEffect(() => onTotalChange?.(total), [total, onTotalChange]);

  return (
    <div className="shipment-picker">
      {parcels.map((p, i) => (
        <Card key={p.id}>
          <CardBody>
            <div className="shipment-picker__head">
              <h3 className="shipment-picker__title">
                {p.kind === 'physical' ? (
                  <Package className="shipment-picker__icon" aria-hidden />
                ) : (
                  <Download
                    className="shipment-picker__icon shipment-picker__icon--digital"
                    aria-hidden
                  />
                )}
                Parcel {i + 1} · {p.shopName}
              </h3>
              <span className="shipment-picker__mode">
                {p.kind === 'physical' ? 'Shipped to your address' : 'Delivered by email'}
              </span>
            </div>

            <ul className="parcel-lines">
              {p.lines.map((l) => (
                <li key={l.id} className="parcel-lines__item">
                  <div className="parcel-lines__thumb">
                    <Image src={l.image} alt="" fill sizes="40px" className="parcel-lines__image" />
                  </div>
                  <div className="parcel-lines__body">
                    <p className="parcel-lines__title">{l.title}</p>
                    <p className="parcel-lines__meta--plain">
                      {l.variantLabel && `${l.variantLabel} · `}Qty {l.qty}
                    </p>
                  </div>
                  <Money cents={l.unitCents * l.qty} size="sm" />
                </li>
              ))}
            </ul>

            <div className="shipment-picker__choice">
              {p.kind === 'physical' ? (
                <label className="shipment-picker__label">
                  <span className="shipment-picker__label-text">Delivery</span>
                  <NativeSelect
                    wrapperClassName="shipment-picker__select"
                    value={choice[p.id]}
                    onChange={(e) => setChoice((c) => ({ ...c, [p.id]: e.target.value }))}
                  >
                    {p.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label} — {o.costCents === 0 ? 'Free' : `$${(o.costCents / 100).toFixed(2)}`}
                      </option>
                    ))}
                  </NativeSelect>
                </label>
              ) : (
                <p className="shipment-picker__digital">
                  Download link sent the moment your payment clears — no delivery charge.
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
