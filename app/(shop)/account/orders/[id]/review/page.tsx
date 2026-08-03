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
import { CheckboxField } from '@/components/ui/checkbox';
import { Banner } from '@/components/shared/banner';
import { RatingInput } from '@/components/commerce/rating-input';
import { ORDERS } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';
import { cn } from '@/lib/utils';

/**
 * B21 · Viết đánh giá.
 *
 * ── Vì sao chấm BA trục thay vì một số sao ───────────────────────────────
 *
 * Lấy từ Etsy, và với POD thì càng đúng: chất lượng in, tốc độ giao và thái độ
 * người bán là ba nguồn khiếu nại khác nhau. Gộp thành một con số là mất thông
 * tin — người mua sau không biết 4 sao nghĩa là "in đẹp nhưng giao chậm" hay
 * "giao nhanh nhưng in lệch", mà hai điều đó dẫn tới hai quyết định khác nhau.
 *
 * Hàng số đổi trục: "chất lượng file" và "đáng tiền" thay cho "chất lượng in"
 * và "vận chuyển" — chấm điểm vận chuyển cho một file tải về là câu hỏi vô nghĩa.
 *
 * ── Ba điều cố tình làm ──────────────────────────────────────────────────
 *
 * · Chọn dòng hàng TRƯỚC khi chấm. Một đơn có ba món; đánh giá gắn vào món nào
 *   phải rõ, nếu không nhận xét về cái áo sẽ nằm dưới bộ icon.
 * · Ảnh của người mua để TUỲ CHỌN nhưng nêu rõ ích lợi. Ép tải ảnh làm tỉ lệ
 *   viết đánh giá rơi thẳng đứng.
 * · Không có ô "tiêu đề đánh giá". Nó khiến người ta viết một câu rồi thôi.
 */
export default function WriteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  const [lineId, setLineId] = React.useState(order.lines[0]!.id);
  const line = order.lines.find((l) => l.id === lineId)!;
  const digital = line.kind === 'file';

  const [overall, setOverall] = React.useState(0);
  const [detail, setDetail] = React.useState<Record<string, number>>({});
  const [body, setBody] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const axes = digital
    ? [
        { id: 'quality', label: 'File quality' },
        { id: 'value', label: 'Value for money' },
        { id: 'service', label: 'Customer service' },
      ]
    : [
        { id: 'quality', label: 'Print quality' },
        { id: 'shipping', label: 'Shipping speed' },
        { id: 'service', label: 'Customer service' },
      ];

  if (sent) {
    return (
      <div className="page__focus page__focus--md">
        <Banner tone="success" title="Review posted">
          <p>
            It shows on the listing within a few minutes. You can edit it for 30 days — after that
            it is fixed, so later buyers can trust the date on it.
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
      <PageTitle>Review your order</PageTitle>
      <p className="page__lede--under-title">
        Order #{order.id} from {order.shopName}
      </p>

      {/* ── chọn món ────────────────────────────────────────── */}
      <fieldset className="review-form__picker">
        <legend className="review-form__picker-legend">Which item?</legend>
        <div className="review-form__thumbs">
          {order.lines.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={l.id === lineId}
              onClick={() => setLineId(l.id)}
              className={cn('review-form__thumb', l.id === lineId && 'review-form__thumb--on')}
            >
              <Image src={l.image} alt={l.title} fill sizes="64px" className="review-form__thumb-image" />
            </button>
          ))}
        </div>
        <p className="review-form__picked">{line.title}</p>
      </fieldset>

      <Card className="page__card">
        <CardBody>
          <div>
            <span className="review-form__overall-label">Overall</span>
            <RatingInput label="Overall rating" value={overall} onChange={setOverall} />
          </div>

          <div className="review-form__axes">
            {axes.map((a) => (
              <div key={a.id} className="review-form__axis">
                <span className="review-form__axis-label">{a.label}</span>
                <RatingInput
                  size="sm"
                  label={a.label}
                  value={detail[a.id] ?? 0}
                  onChange={(v) => setDetail((d) => ({ ...d, [a.id]: v }))}
                />
              </div>
            ))}
          </div>

          <div className="review-form__group">
            <label htmlFor="body" className="review-form__label">
              What should the next buyer know?
            </label>
            <Textarea
              id="body"
              rows={5}
              value={body}
              maxLength={1000}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                digital
                  ? 'Were the files organised the way you expected? Did they open in your software?'
                  : 'How does it fit, how does the print feel after a wash, did it arrive when they said?'
              }
            />
            <p className="review-form__meta">
              <span>Reviews mentioning fit and washing get read the most.</span>
              <span className="review-form__count">{body.length}/1000</span>
            </p>
          </div>

          <div className="review-form__group">
            <button type="button" className="upload-drop">
              <ImagePlus className="upload-drop__icon" />
              Add a photo (optional)
            </button>
            <p className="review-form__upload-note">
              Listings with buyer photos convert better, so shops tend to reply faster to reviews
              that have one. Yours stays on the listing, not on your profile.
            </p>
          </div>

          <div className="review-form__group">
            <CheckboxField
              label="Post under my initials instead of my full name"
              hint="Shops always see the order behind a review, whichever you pick."
            />
          </div>

          <Button block className="review-form__submit" disabled={overall === 0} onClick={() => setSent(true)}>
            {overall === 0 ? 'Choose an overall rating first' : 'Post review'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
