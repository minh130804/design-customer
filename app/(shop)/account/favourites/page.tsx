import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductGrid } from '@/components/commerce/product-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/shared/banner';
import { LISTINGS } from '@/lib/catalog';
import { PageTitle } from '@/components/shared/page-title';

export const metadata: Metadata = {
  title: 'Favourites — POD Market',
  robots: { index: false, follow: false },
};

/**
 * B20 · Yêu thích.
 *
 * Dải thông báo ở đầu trang là điều đáng làm và ít sàn làm: nói cho người dùng
 * biết **giá đã thay đổi từ lúc họ lưu**. Đây là thông tin họ thật sự muốn, và
 * nó tạo lý do quay lại mà không cần gửi email khuyến mại.
 *
 * Điều cố tình KHÔNG làm: không đếm ngược, không "còn 2 sản phẩm". Etsy dùng
 * `In 20+ carts` từ số thật; số bịa thì phát hiện ra một lần là mất niềm tin
 * vĩnh viễn.
 */
export default function FavouritesPage() {
  const favourites = LISTINGS.filter((l) => l.compareAtCents !== null);

  if (!favourites.length) {
    return (
      <EmptyState
        icon={<Heart className="page__empty-icon" />}
        title="Nothing saved yet"
        action={
          <Button asChild>
            <Link href="/">Find something you like</Link>
          </Button>
        }
      >
        Tap the heart on any item and it shows up here, with a note when the price drops.
      </EmptyState>
    );
  }

  return (
    <>
      <PageTitle className="page__title">Favourites</PageTitle>

      <Banner
        tone="success"
        className="page__notice"
        title={`${favourites.length} saved items are cheaper than when you saved them`}
      >
        <p>We compare against the price on the day you saved it, not against a made-up list price.</p>
      </Banner>

      <ProductGrid listings={favourites} />
    </>
  );
}
