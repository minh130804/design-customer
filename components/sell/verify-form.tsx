'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/shared/banner';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/shared/page-title';

const LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * C1b · Xác thực email sau khi đăng ký bán hàng.
 *
 * ── Vì sao sáu ô chứ không phải một ô ───────────────────────────────────
 *
 * Một ô `maxLength=6` viết ngắn hơn, nhưng nó không cho biết mã dài bao nhiêu
 * cho tới khi người ta gõ hết. Sáu ô nói điều đó trước khi ai gõ chữ nào, và
 * dán mã từ email vào ô đầu vẫn điền đủ cả sáu — xử lý ở `onPaste`.
 *
 * ── Vì sao nút gửi lại đếm ngược 60 giây ────────────────────────────────
 *
 * Yêu cầu từ ui-design.md §C1. Email chậm vài chục giây là chuyện bình thường;
 * không có bộ đếm thì người dùng bấm gửi lại bốn lần trong một phút, nhận bốn
 * mã, và **ba mã đầu đã bị vô hiệu** — họ gõ mã trong email đầu tiên nhìn thấy
 * và nó báo sai. Bộ đếm không phải để chống lạm dụng, nó để chống chính tình
 * huống đó.
 *
 * ── Tài khoản đã tồn tại trước khi xác thực ─────────────────────────────
 *
 * Theo luồng 1: tài khoản và shop nháp được tạo ngay lúc đăng ký, mã chỉ mở
 * khoá việc ĐĂNG BÁN. Người bán mất đà nếu phải chờ email mới thấy tài khoản
 * của mình tồn tại.
 */
export function VerifyForm({ email }: { email: string }) {
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(''));
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [verified, setVerified] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const code = digits.join('');

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = clean;
      return next;
    });
    setError('');
    if (clean && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace ở ô trống lùi về ô trước và xoá ở đó — nếu không, người dùng
    // phải bấm Backspace rồi mũi tên trái xen kẽ để sửa một chữ số ở giữa.
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      inputs.current[index - 1]?.focus();
      setDigits((current) => {
        const next = [...current];
        next[index - 1] = '';
        return next;
      });
    }
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < LENGTH) {
      setError('Enter all six digits.');
      inputs.current[code.length]?.focus();
      return;
    }

    setBusy(true);
    // Ở bản thật: POST /v1/sellers/verify. Mã sai thì Spring trả 400 và ta
    // hiện lỗi TẠI CHỖ, không điều hướng đi đâu — người dùng còn đang cầm email.
    window.setTimeout(() => {
      setBusy(false);
      setVerified(true);
    }, 600);
  }

  function resend() {
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
  }

  if (verified) {
    return (
      <div className="verify-form verify-form--done">
        <div className="verify-form__head">
          <CheckCircle2 className="verify-form__head-icon verify-form__head-icon--ok" aria-hidden />
          <div>
            <PageTitle size="display">Your seller account is ready</PageTitle>
            <p className="verify-form__lede">
              {email} is confirmed. Everything else happens in Shop Manager.
            </p>
          </div>
        </div>

        <Card tone="trust" className="verify-form__card">
          <CardBody>
            <h2 className="verify-form__next-title">Next: name your shop</h2>
            <ul className="verify-form__next-list">
              <li>· Choose a shop name and address — we check availability as you type</li>
              <li>· Add a logo, banner and a line about what you make</li>
              <li>· Create your first listing — we show the print cost and your margin</li>
              <li>· Add payout details before your first payout, not before your first sale</li>
            </ul>
            <Button asChild block className="verify-form__next-cta">
              <a href="https://seller.podmarket.example">
                Open Shop Manager
                <ArrowRight className="verify-form__next-icon" />
              </a>
            </Button>
          </CardBody>
        </Card>

        <p className="verify-form__foot">
          <Link href="/" className="verify-form__foot-link">
            Back to the marketplace
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="verify-form">
      <div className="verify-form__head">
        <MailCheck className="verify-form__head-icon" aria-hidden />
        <div>
          <PageTitle size="display">Confirm your email</PageTitle>
          <p className="verify-form__lede">
            We sent a six-digit code to <span className="verify-form__email">{email}</span>.
          </p>
        </div>
      </div>

      <Card tone="trust" className="verify-form__card">
        <CardBody>
          <form onSubmit={onSubmit} noValidate>
            <fieldset>
              <legend className="verify-form__legend">Verification code</legend>

              <div className="verify-form__digits">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={onPaste}
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${i + 1} of ${LENGTH}`}
                    autoFocus={i === 0}
                    /* Ngoại lệ có chủ ý của thang ô nhập — lý do ghi ở
                       `.verify-form__digit` trong `app/styles/sell.css`. */
                    className={cn(
                      'verify-form__digit',
                      error && 'verify-form__digit--invalid',
                    )}
                  />
                ))}
              </div>

              {error && <p className="verify-form__error">{error}</p>}
            </fieldset>

            <Button type="submit" block className="verify-form__submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="verify-form__spinner" />
                  Checking…
                </>
              ) : (
                'Confirm and open my shop'
              )}
            </Button>
          </form>

          <div className="verify-form__resend">
            <p className="verify-form__resend-hint">Did not get it? Check the spam folder first.</p>
            <Button variant="ghost" size="sm" onClick={resend} disabled={secondsLeft > 0}>
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend the code'}
            </Button>
          </div>
        </CardBody>
      </Card>

      <Banner tone="info" className="verify-form__notice" title="Your account already exists">
        <p>
          We created it the moment you signed up. The code only unlocks publishing, so nothing is
          lost if you finish this later — the link stays valid for 24 hours.
        </p>
      </Banner>

      <p className="verify-form__foot">
        Wrong address?{' '}
        <Link href="/sell" className="verify-form__foot-link">
          Sign up again with a different email
        </Link>
      </p>
    </div>
  );
}
