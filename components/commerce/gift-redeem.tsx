'use client';

import * as React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Banner } from '@/components/shared/banner';
import { formatUsd } from '@/lib/utils';
import { redeemGiftCode } from '@/lib/gift-cards';

/**
 * Nhập mã thẻ quà tặng ở bước thanh toán.
 *
 * ── Vì sao KHÔNG nói rõ "mã không tồn tại" ──────────────────────────────
 *
 * Có hai kiểu hỏng: gõ sai DẠNG, và đúng dạng nhưng không có mã đó. Kiểu đầu báo
 * rõ được vì nó là lỗi của người gõ. Kiểu sau thì không: phân biệt "sai dạng"
 * với "không tồn tại" chính là công cụ để dò mã hàng loạt — cứ thử mã đúng dạng
 * tới khi hệ thống ngừng nói "không tồn tại".
 *
 * Nên thông báo cho trường hợp thứ hai cố tình mơ hồ, và ở bản thật nó còn phải
 * kèm giới hạn số lần thử phía backend.
 *
 * ── Vì sao số dư chỉ đến từ máy chủ ─────────────────────────────────────
 *
 * `redeemGiftCode` là chỗ duy nhất biết một mã đáng bao nhiêu. Không đoán, không
 * lưu số dư vào state rồi tính tiếp ở client — tiền luôn được chốt ở server.
 */
export function GiftRedeem({ onApply }: { onApply?: (cents: number) => void }) {
  const [code, setCode] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [applied, setApplied] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await redeemGiftCode(code);
    setBusy(false);

    if (res.ok) {
      setApplied(res.balanceCents);
      onApply?.(res.balanceCents);
      return;
    }
    setError(
      res.reason === 'shape'
        ? 'Gift card codes look like POD-XXXX-XXXX-XXXX.'
        : 'We could not apply that code. Check it against your email and try again.',
    );
  }

  if (applied !== null) {
    return (
      <Banner tone="success" title={`${formatUsd(applied)} gift card applied`}>
        <p>It comes off the total below. Anything left over stays on the card.</p>
      </Banner>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="gift-redeem">
        <div className="gift-redeem__field">
          <label htmlFor="gift-code" className="label">
            <Gift className="gift-redeem__icon" aria-hidden />
            Gift card code
          </label>
          <Input
            id="gift-code"
            name="giftCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            invalid={Boolean(error)}
            placeholder="POD-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            className="gift-redeem__input"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" disabled={!code || busy}>
          {busy ? 'Checking…' : 'Apply'}
        </Button>
      </div>
      {error && <p className="gift-redeem__error">{error}</p>}
    </form>
  );
}
