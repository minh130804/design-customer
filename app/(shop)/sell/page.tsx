'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Package, Palette, Wallet } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/checkbox';
import { Field } from '@/components/shared/field';
import { Banner } from '@/components/shared/banner';
import { SectionHeading } from '@/components/shared/section-heading';
import { PageTitle } from '@/components/shared/page-title';

/**
 * C1 · Đăng ký bán hàng — luồng 1 của seller-main-flows.md, đặt ở storefront.
 *
 * ── Hai trường, một màn. Không hơn. ─────────────────────────────────────
 *
 * Email và mật khẩu. **Không hỏi tên shop, không hỏi giấy tờ, không hỏi tài
 * khoản ngân hàng ở đây.**
 *
 * ui-design.md §C1 vẽ thêm ô *tên shop* ngay trên màn này. Ô đó đã bỏ, và lý
 * do đáng ghi lại: tên shop là **quyết định thương hiệu**, không phải thông tin
 * đăng ký. Nó là ô duy nhất ở màn này có thể bị từ chối vì trùng, nên nó biến
 * một biểu mẫu chắc chắn thành công thành một biểu mẫu có thể thất bại — ở
 * đúng bước mà người ta còn đang cân nhắc có làm hay không. Người bán nghĩ ra
 * tên trong lúc dựng thương hiệu, và đó là chỗ nó thuộc về.
 *
 * Giấy tờ và tài khoản ngân hàng cũng vậy: chúng chỉ cần trước lần CHI TRẢ đầu
 * tiên, tức là sau khi đã bán được hàng và đã có lý do để điền.
 *
 * ── Nền kem ─────────────────────────────────────────────────────────────
 *
 * `--surface-trust` là màu của khu vực seller trong toàn hệ thống. Ngay từ màn
 * đầu người bán đã ở trong một không gian màu khác với khu mua sắm.
 */
export default function SellPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const passwordTooShort = password.length > 0 && password.length < 10;
  const canSubmit = Boolean(email) && password.length >= 10 && agreed;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    setBusy(true);
    // Ở bản thật: POST /v1/sellers → Spring tạo tài khoản, gửi mã xác thực, rồi
    // trả về id phiên đăng ký. Shop được tạo ở trạng thái NHÁP CHƯA ĐẶT TÊN —
    // đặt tên là việc đầu tiên trong Shop Manager, không phải ở đây.
    router.push(`/sell/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="page__focus page__focus--xl">
      <header className="sell-page__head">
        <PageTitle size="display">Sell on POD Market</PageTitle>
        <p className="sell-page__lede">
          Upload a design, pick a blank, and we print and ship it when someone buys. No stock to
          carry, no minimum order, and nothing to pay until you make a sale.
        </p>
      </header>

      <div className="sell-page__grid">
        {/* ── điều gì xảy ra sau khi đăng ký ─────────────────── */}
        <div>
          <SectionHeading>What happens after you sign up</SectionHeading>

          <ol className="sell-page__steps">
            <Step
              n={1}
              icon={<Check className="sell-page__step-icon" />}
              title="Confirm your email"
              body="We send a six-digit code. That is the last thing standing between you and Shop Manager."
            />
            <Step
              n={2}
              icon={<Palette className="sell-page__step-icon" />}
              title="Name your shop and set the look"
              body="Shop name, address, logo, banner and a short introduction. You pick the name here rather than on the sign-up form, so you can take your time over it — and change it later."
            />
            <Step
              n={3}
              icon={<Package className="sell-page__step-icon" />}
              title="Add your first listing"
              body="Pick a blank, drop your artwork on it, set a price. We show you the print cost and your margin before you publish."
            />
            <Step
              n={4}
              icon={<Wallet className="sell-page__step-icon" />}
              title="Add payout details when you are ready"
              body="Only needed before your first payout, not before your first sale. You can sell while it is still being verified — the money waits in Pending, it does not disappear."
            />
          </ol>

          <Banner tone="info" className="sell-page__notice" title="What we do not ask for today">
            <p>
              No shop name, no ID documents, no bank account, no company registration. Each of those
              belongs to a later step where you already have a reason to fill it in — asking now
              would only stop people who have not decided yet.
            </p>
          </Banner>
        </div>

        {/* ── biểu mẫu · nền kem đánh dấu khu vực seller ─────── */}
        <Card tone="trust" className="sell-page__form-card">
          <CardBody>
            <h2 className="sell-page__form-title">Create your seller account</h2>
            <p className="sell-page__form-note">Two fields. That is the whole form.</p>

            <form onSubmit={onSubmit} noValidate className="sell-page__form">
              <Field
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={touched && !email ? 'We need an email to send the code to.' : undefined}
              />

              <Field
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint={!passwordTooShort ? 'At least 10 characters. Length beats symbols.' : undefined}
                error={passwordTooShort ? 'Use at least 10 characters.' : undefined}
              />

              <CheckboxField
                className="sell-page__terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                label={
                  <>
                    I agree to the{' '}
                    <Link href="/help/selling" className="link">
                      seller terms
                    </Link>
                  </>
                }
                hint="Covers what you may sell, how payouts work, and how disputes are settled."
              />

              <Button type="submit" block disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="sell-page__spinner" />
                    Creating your account…
                  </>
                ) : (
                  'Create seller account'
                )}
              </Button>

              {touched && !canSubmit && !busy && (
                <p className="sell-page__error">
                  {!agreed
                    ? 'Please accept the seller terms to continue.'
                    : 'Check the fields above.'}
                </p>
              )}

              <p className="sell-page__signin">
                Already selling?{' '}
                <Link href="/signin" className="link">
                  Sign in
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="sell-page__step">
      <span aria-hidden className="sell-page__step-badge">
        {icon}
      </span>
      <div>
        <p className="sell-page__step-title">
          <span className="sell-page__step-n">{n}. </span>
          {title}
        </p>
        <p className="sell-page__step-body">{body}</p>
      </div>
    </li>
  );
}
