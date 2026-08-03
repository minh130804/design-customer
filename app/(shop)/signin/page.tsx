'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Field } from '@/components/shared/field';
import { Banner } from '@/components/shared/banner';
import { PageTitle } from '@/components/shared/page-title';

/**
 * B9 · Đăng nhập và tạo tài khoản — L6 bố cục một cột tập trung.
 *
 * ── Vì sao hai chế độ nằm trên MỘT trang, đổi bằng tab ───────────────────
 *
 * Người dùng thường không nhớ mình đã có tài khoản hay chưa. Tách thành hai
 * trang riêng thì lần đoán sai nào cũng tốn một lần tải trang và một thông báo
 * lỗi. Một trang, hai tab, dữ liệu email giữ nguyên khi đổi tab.
 *
 * ── Vì sao có nút "gửi link đăng nhập" ───────────────────────────────────
 *
 * Trên sàn, phần lớn tài khoản đăng nhập vài lần một năm, và mật khẩu của
 * những tài khoản đó chắc chắn bị quên. Link một lần qua email loại bỏ hẳn
 * bước "quên mật khẩu" — vốn cũng chỉ là gửi một email.
 *
 * ── Điều KHÔNG làm ───────────────────────────────────────────────────────
 *
 * Không chặn giỏ hàng sau tường đăng nhập. Khách vãng lai vẫn mua được, và
 * trang này chỉ nêu lợi ích chứ không doạ mất dữ liệu.
 */
export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<'signin' | 'register'>('signin');
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  /**
   * Đặt cookie phiên qua Route Handler rồi `router.refresh()`.
   *
   * `refresh()` là bước bắt buộc: cookie đã đổi nhưng mọi Server Component vẫn
   * giữ bản render cũ, nên không làm mới thì header vẫn hiện "Sign in" và
   * checkout vẫn rẽ vào nhánh khách vãng lai.
   */
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    router.refresh();
    router.push('/account/orders');
  }

  return (
    <div className="signin">
      <PageTitle size="display">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </PageTitle>
      <p className="signin__lede">
        Saved addresses, every order in one place, and a download library that never expires.
      </p>

      <Card className="page__card">
        <CardBody>
          <Tabs
            label="Sign in or register"
            className="signin__tabs"
            value={mode}
            onValueChange={setMode}
            items={[
              { value: 'signin', label: 'Sign in' },
              { value: 'register', label: 'Create account' },
            ]}
          />

          <form onSubmit={signIn}>
            {/* Email giữ nguyên khi đổi tab — người dùng gõ xong email rồi mới
                nhận ra mình bấm nhầm tab thì không phải gõ lại. */}
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {mode === 'register' && <Field label="Your name" autoComplete="name" />}

            <Field
              label="Password"
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              hint={
                mode === 'register' ? 'At least 10 characters. Length beats symbols.' : undefined
              }
            />

            <Button type="submit" block disabled={busy}>
              {busy ? 'Signing you in…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="signin__divider">
            <span className="signin__rule" aria-hidden />
            <span className="signin__divider-text">or</span>
            <span className="signin__rule" aria-hidden />
          </div>

          <Button variant="outline" block onClick={() => setSent(true)} disabled={!email || sent}>
            <Mail className="signin__magic-icon" />
            {sent ? 'Link sent — check your inbox' : 'Email me a sign-in link'}
          </Button>

          {sent && (
            <Banner tone="success" className="signin__sent" title="Link sent">
              <p>
                It works once and expires in 15 minutes. If it does not arrive, check the spam
                folder before requesting another — the second link cancels the first.
              </p>
            </Banner>
          )}
        </CardBody>
      </Card>

      <Card tone="quiet" className="signin__guest">
        <CardBody>
          <h2 className="signin__guest-title">Not ready for an account?</h2>
          <p className="signin__guest-text">
            You can buy as a guest. Download links are emailed and expire after 7 days, and you type
            your address each time — everything else works the same.
          </p>
          <Button asChild variant="ghost" size="sm" className="signin__guest-cta">
            <Link href="/cart">Go to your cart</Link>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
