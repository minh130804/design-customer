'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Góc tài khoản trên header: *Sign in* khi chưa đăng nhập, tên + *Sign out*
 * khi đã đăng nhập.
 *
 * ── Vì sao hỏi trạng thái phiên bằng `fetch` chứ không đọc ở server ──────
 *
 * Cookie phiên là `httpOnly`, nên Server Component muốn biết trạng thái phải
 * gọi `cookies()`. Nhưng header nằm trong layout dùng chung — chạm vào
 * `cookies()` ở đây làm **mọi trang bên dưới thành render động**, và 18 trang
 * sản phẩm cộng toàn bộ trang danh mục mất khả năng prerender. Với sàn POD,
 * nơi long-tail search là nguồn khách chính, đó là cái giá quá đắt để đổi lấy
 * một cái tên ở góc màn hình.
 *
 * Cái mất: người đã đăng nhập thấy nút "Sign in" trong khoảnh khắc đầu. Người
 * chưa đăng nhập — phần lớn lượt truy cập, và là tất cả những gì Google thấy —
 * không thấy nhấp nháy gì.
 *
 * Chỗ trạng thái phiên thật sự quan trọng là checkout, và ở đó nó vẫn được đọc
 * thẳng ở server (`lib/session.ts`).
 *
 * `router.refresh()` sau khi đăng xuất là bắt buộc: xoá cookie xong mà không
 * làm mới thì các trang động đã render vẫn giữ dữ liệu của phiên cũ.
 */
export function AccountMenu() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch('/api/session')
      .then((r) => r.json() as Promise<{ name?: string }>)
      .then((data) => {
        if (alive) setName(data.name ?? '');
      })
      .catch(() => {
        /* Không lấy được phiên thì cứ hiện "Sign in" — trạng thái mặc định an
           toàn, và bấm vào đó vẫn dẫn tới đúng chỗ. */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!name) {
    return (
      <Button asChild variant="outline" size="sm" className="account-menu__signin">
        <Link href="/signin">Sign in</Link>
      </Button>
    );
  }

  async function signOut() {
    setBusy(true);
    await fetch('/api/session', { method: 'DELETE' });
    setName('');
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="account-menu">
      <span className="account-menu__name" title={name}>
        {name}
      </span>
      <Button variant="ghost" size="sm" onClick={signOut} disabled={busy}>
        {busy ? 'Signing out…' : 'Sign out'}
      </Button>
    </div>
  );
}
