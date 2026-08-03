'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { ImagePlus } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioCard } from '@/components/ui/radio-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Banner } from '@/components/shared/banner';
import { Money } from '@/components/shared/money';
import { KindBadge } from '@/components/shared/kind-badge';
import { ORDERS } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

/**
 * B22 · Yêu cầu đổi trả.
 *
 * ── Ba nhánh, và chúng KHÁC NHAU THẬT ────────────────────────────────────
 *
 *   hàng có sẵn  → trả lại được, buyer trả phí gửi về
 *   in theo đơn  → trả lại được nếu LỖI in; đổi ý thì không, vì món đó làm
 *                  riêng cho một người và không bán lại được cho ai khác
 *   file thiết kế→ đã tải rồi thì không hoàn được. Chưa tải thì hoàn đầy đủ
 *
 * Nhánh thứ ba là nhánh dễ gây tranh chấp nhất, nên nó hiện NGAY khi chọn dòng
 * hàng số, không đợi tới lúc bấm gửi. Người mua biết luật trước khi bỏ công
 * điền form là chênh lệch giữa một câu trả lời và một vụ khiếu nại thanh toán.
 *
 * ── Lý do trả hàng quyết định AI TRẢ PHÍ GỬI VỀ ──────────────────────────
 *
 * Vì vậy nó không phải một `<select>` cho gọn: mỗi lý do phải nói luôn hệ quả
 * của nó. Giấu điều đó tới màn xác nhận là cách chắc chắn nhất để biến một
 * lượt đổi trả bình thường thành một lượt khiếu nại.
 */
const REASONS = [
  {
    value: 'damaged',
    label: 'Arrived damaged',
    detail: 'The shop pays return shipping, and we ask for a photo so the workshop can fix the cause.',
    needsPhoto: true,
  },
  {
    value: 'wrong',
    label: 'Not what was ordered',
    detail: 'Wrong size, wrong colour, wrong item. The shop pays return shipping.',
    needsPhoto: true,
  },
  {
    value: 'quality',
    label: 'Print or build quality',
    detail: 'Misaligned print, cracking ink, loose stitching. The shop pays return shipping.',
    needsPhoto: true,
  },
  {
    value: 'changed-mind',
    label: 'Changed my mind',
    detail: 'You pay return shipping. Not available on made-to-order or personalised items.',
    needsPhoto: false,
  },
] as const;

export default function ReturnRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  const [picked, setPicked] = React.useState<string[]>([order.lines[0]!.id]);
  const [reason, setReason] = React.useState<string>('damaged');
  const [note, setNote] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const lines = order.lines.filter((l) => picked.includes(l.id));
  const hasDigital = lines.some((l) => l.kind === 'file');
  const hasMadeToOrder = lines.some((l) => l.kind === 'pod');
  const refundCents = lines.reduce((s, l) => s + l.unitCents * l.qty, 0);

  // "Đổi ý" không áp dụng cho hàng làm riêng — chặn ở đây, và nói vì sao.
  const changedMindBlocked = reason === 'changed-mind' && hasMadeToOrder;
  const selectedReason = REASONS.find((r) => r.value === reason)!;

  const toggle = (lineId: string) =>
    setPicked((p) => (p.includes(lineId) ? p.filter((x) => x !== lineId) : [...p, lineId]));

  if (sent) {
    return (
      <div className="page__focus page__focus--md">
        <Banner tone="success" title="Request sent to the shop">
          <p>
            Shops have 48 hours to respond. If nobody replies in that time the marketplace steps in
            and decides — you do not have to chase it.
          </p>
        </Banner>
        <Button asChild className="page__card">
          <Link href={`/account/orders/${order.id}`}>Back to the order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="page__focus page__focus--md">
      <PageTitle>Return or exchange</PageTitle>
      <p className="page__lede--under-title">
        Order #{order.id} from {order.shopName} · placed {order.placedAt}
      </p>

      {/* ── chọn dòng hàng ──────────────────────────────────── */}
      <Card className="page__card">
        <CardBody>
          <h2 className="return-form__title">What are you returning?</h2>
          <ul className="return-form__lines">
            {order.lines.map((l) => (
              <li key={l.id}>
                <label
                  className="return-form__line"
                >
                  <Checkbox
                    checked={picked.includes(l.id)}
                    onChange={() => toggle(l.id)}
                    aria-label={`Include ${l.title}`}
                  />
                  <div className="return-form__thumb">
                    <Image src={l.image} alt="" fill sizes="48px" className="parcel-lines__image" />
                  </div>
                  <div className="parcel-lines__body">
                    <p className="parcel-lines__title">{l.title}</p>
                    <p className="parcel-lines__meta">
                      {l.variantLabel && `${l.variantLabel} · `}Qty {l.qty}
                      <KindBadge kind={l.kind} />
                    </p>
                  </div>
                  <Money cents={l.unitCents * l.qty} size="sm" />
                </label>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Luật của hàng số hiện NGAY khi chọn, không đợi lúc bấm gửi */}
      {hasDigital && (
        <Banner tone="warning" className="page__notice--after" title="Design files cannot be returned once downloaded">
          <p>
            We cannot take a file back, so a refund after download would mean giving it away. If a
            file is genuinely broken or does not match the listing, pick a reason below — that is a
            different case and it is refundable.
          </p>
        </Banner>
      )}

      {/* ── lý do ───────────────────────────────────────────── */}
      <div className="return-form__section">
        <h2 className="return-form__reasons-title">Why are you sending it back?</h2>
        <div className="return-form__reasons">
          {REASONS.map((r) => (
            <RadioCard
              key={r.value}
              name="reason"
              value={r.value}
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
              label={r.label}
              description={r.detail}
            />
          ))}
        </div>
      </div>

      {changedMindBlocked && (
        <Banner tone="critical" className="page__notice--after" title="Made-to-order items cannot be returned for a change of mind">
          <p>
            This one was printed for you after you ordered it, so there is no second buyer for it
            and no shelf to put it back on.
          </p>
          <p>
            If something is actually wrong with it — the print, the size, the condition it arrived
            in — choose that reason instead and it is covered.
          </p>
        </Banner>
      )}

      <Card className="page__card">
        <CardBody>
          <label htmlFor="note" className="return-form__label">
            Tell the shop what happened
          </label>
          <Textarea
            id="note"
            rows={4}
            value={note}
            maxLength={600}
            onChange={(e) => setNote(e.target.value)}
            placeholder="The more specific you are, the faster this gets resolved — “the lotus is 2 cm off centre” beats “it looks wrong”."
          />
          <p className="return-form__count">{note.length}/600</p>

          {selectedReason.needsPhoto && (
            <button
              type="button"
              className="upload-drop upload-drop--after"
            >
              <ImagePlus className="upload-drop__icon" />
              Add photos
            </button>
          )}

          <dl className="return-form__summary">
            <div className="return-form__summary-row">
              <dt className="return-form__summary-term">Refund if approved</dt>
              <dd>
                <Money cents={refundCents} />
              </dd>
            </div>
            <div className="return-form__summary-row">
              <dt className="return-form__summary-term">Return shipping</dt>
              <dd className="return-form__summary-value">
                {reason === 'changed-mind' ? 'Paid by you' : 'Paid by the shop'}
              </dd>
            </div>
          </dl>

          <Button
            block
            className="return-form__submit"
            disabled={!picked.length || changedMindBlocked}
            onClick={() => setSent(true)}
          >
            {!picked.length ? 'Choose at least one item' : 'Send request to the shop'}
          </Button>

          <p className="return-form__fineprint">
            Refunds go back to the original payment method. If the shop does not reply within 48
            hours, the marketplace decides on your behalf.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
