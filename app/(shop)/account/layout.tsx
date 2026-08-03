import Link from 'next/link';
import { Package, Download, MapPin, Heart } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

/**
 * L5 · Bố cục tài khoản — menu dọc 200px + nội dung.
 *
 * Menu là ĐIỀU HƯỚNG thật (`<Link>`), không phải tab đổi nội dung tại chỗ. Bốn
 * mục này là bốn trang có URL riêng vì người dùng cần gửi được đường dẫn "kho
 * tải về của tôi" cho chính mình trên máy khác, và cần nút Back hoạt động.
 *
 * Trên điện thoại menu chuyển thành dải cuộn ngang chứ không thu vào ngăn kéo:
 * chỉ có bốn mục, và một ngăn kéo cho bốn mục là thêm một cú chạm không đổi lại
 * được gì.
 */
const NAV = [
  { href: '/account/orders', label: 'Orders', Icon: Package },
  { href: '/account/downloads', label: 'Downloads', Icon: Download },
  { href: '/account/addresses', label: 'Addresses', Icon: MapPin },
  { href: '/account/favourites', label: 'Favourites', Icon: Heart },
] as const;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Your account' }]} />

      <div className="account-layout">
        <nav
          aria-label="Account"
          className="account-layout__nav"
        >
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="account-layout__link"
            >
              <Icon className="account-layout__icon" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="account-layout__body">{children}</div>
      </div>
    </>
  );
}
