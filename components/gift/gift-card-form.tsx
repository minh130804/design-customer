'use client';

import * as React from 'react';
import { Gift, Mail, Printer } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/shared/field';
import { Textarea } from '@/components/ui/textarea';
import { Banner } from '@/components/shared/banner';
import { RadioCard } from '@/components/ui/radio-card';
import { Money } from '@/components/shared/money';
import { GIFT_AMOUNTS_CENTS, type GiftDelivery } from '@/lib/gift-cards';
import { formatUsd } from '@/lib/utils';

/**
 * Mua thẻ quà tặng.
 *
 * ── Xem trước nằm CẠNH biểu mẫu, không nằm sau một cái nút ───────────────
 *
 * Người tặng đang viết một lời nhắn cho người thật. Lỗi chính tả trong một món
 * quà thì không sửa lại được sau khi gửi, nên tấm thẻ phải hiện ngay trong lúc
 * gõ chứ không đợi bấm "xem trước".
 *
 * ── Ngày gửi mặc định là HÔM NAY, và giới hạn dưới cũng là hôm nay ───────
 *
 * Đặt lịch gửi là tính năng phụ; phần lớn người mua muốn gửi ngay. Nhưng đã cho
 * chọn ngày thì phải chặn ngày quá khứ ở chính ô nhập — chặn bằng thông báo lỗi
 * sau khi bấm là bắt người dùng làm lại việc đã làm.
 *
 * Mốc `today` do server truyền xuống, không lấy `new Date()` ở client: trang này
 * là trang tĩnh, đồng hồ máy người dùng lệch múi giờ là chọn được ngày hôm qua.
 */
export function GiftCardForm({ today }: { today: string }) {
  const [amount, setAmount] = React.useState<number>(5000);
  const [delivery, setDelivery] = React.useState<GiftDelivery>('email');
  const [note, setNote] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [added, setAdded] = React.useState(false);

  return (
    <form
      className="gift-card-form"
      onSubmit={(e) => {
        e.preventDefault();
        setAdded(true);
      }}
    >
      <div>
        <Card>
          <CardBody>
            <fieldset>
              <legend className="gift-card-form__legend">Amount</legend>
              <div className="gift-amounts gift-card-form__amounts">
                {GIFT_AMOUNTS_CENTS.map((cents) => (
                  <label key={cents} className="gift-amounts__option">
                    <input
                      type="radio"
                      name="amount"
                      className="gift-amounts__input"
                      checked={amount === cents}
                      onChange={() => setAmount(cents)}
                    />
                    {formatUsd(cents)}
                  </label>
                ))}
              </div>
              <p className="gift-card-form__note">
                Gift cards never expire and can be spent across any number of shops.
              </p>
            </fieldset>
          </CardBody>
        </Card>

        <Card className="gift-card-form__card">
          <CardBody>
            <fieldset>
              <legend className="gift-card-form__legend gift-card-form__legend--spaced">How to deliver it</legend>
              <div className="gift-card-form__deliveries">
                <RadioCard
                  name="delivery"
                  label={
                    <span className="gift-card-form__delivery-label">
                      <Mail className="gift-card-form__delivery-icon" aria-hidden />
                      Email it
                    </span>
                  }
                  description="Sent straight to the recipient on the date you choose."
                  checked={delivery === 'email'}
                  onChange={() => setDelivery('email')}
                />
                <RadioCard
                  name="delivery"
                  label={
                    <span className="gift-card-form__delivery-label">
                      <Printer className="gift-card-form__delivery-icon" aria-hidden />
                      Print it yourself
                    </span>
                  }
                  description="You get a PDF to print and hand over. Nothing is emailed to them."
                  checked={delivery === 'print'}
                  onChange={() => setDelivery('print')}
                />
              </div>
            </fieldset>

            {delivery === 'email' && (
              <div className="gift-card-form__recipient">
                <Field
                  label="Recipient name"
                  name="to"
                  autoComplete="off"
                  placeholder="Thu"
                  required
                />
                <Field
                  label="Recipient email"
                  name="toEmail"
                  type="email"
                  autoComplete="off"
                  placeholder="thu@example.com"
                  required
                />
                <Field
                  label="Send on"
                  name="sendOn"
                  type="date"
                  defaultValue={today}
                  min={today}
                  hint="Leave as today to send as soon as you pay."
                />
              </div>
            )}

            <div className="gift-card-form__message">
              <Field
                label="Your name"
                name="from"
                autoComplete="name"
                placeholder="Dana"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <label htmlFor="gift-note" className="label">
                Message <span className="gift-card-form__optional">(optional)</span>
              </label>
              <Textarea
                id="gift-note"
                name="note"
                rows={3}
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Pick something you would never buy yourself."
              />
              <p className="gift-card-form__count">{note.length}/200</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── xem trước + chốt ─────────────────────────────── */}
      <div className="gift-card-form__aside">
        <div className="gift-preview">
          <p className="gift-preview__brand">
            <Gift className="gift-preview__icon" aria-hidden />
            POD Market gift card
          </p>
          <p className="gift-preview__value">{formatUsd(amount)}</p>
          {note && <p className="gift-preview__note">{note}</p>}
          <p className="gift-preview__from">{from ? `From ${from}` : 'From you'}</p>
        </div>

        <div className="gift-card-form__total">
          <span className="gift-card-form__total-label">Total</span>
          <Money cents={amount} size="lg" />
        </div>
        <p className="gift-card-form__total-note">No delivery charge, no tax on gift cards.</p>

        <Button type="submit" block className="gift-card-form__submit">
          Add gift card to cart
        </Button>

        {added && (
          <Banner tone="success" className="gift-card-form__added" title="Added to your cart">
            <p>
              {delivery === 'email'
                ? 'The code is emailed to the recipient once your payment clears.'
                : 'You get a printable PDF as soon as your payment clears.'}
            </p>
          </Banner>
        )}
      </div>
    </form>
  );
}
