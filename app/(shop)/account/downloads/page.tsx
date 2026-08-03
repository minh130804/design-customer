import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderDown } from 'lucide-react';
import { DownloadCard } from '@/components/commerce/download-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Banner } from '@/components/shared/banner';
import { Button } from '@/components/ui/button';
import { getDownloads } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

export const metadata: Metadata = {
  title: 'Your downloads — POD Market',
  robots: { index: false, follow: false },
};

/**
 * B18 · Kho tải về.
 *
 * Đây là lợi ích cụ thể nhất của việc có tài khoản, và là lý do khối mời tạo
 * tài khoản ở trang đặt hàng thành công nói "kho tải về không giới hạn thời
 * gian" chứ không nói "lưu thông tin của bạn".
 *
 * Ba trạng thái lỗi đều có màn riêng, không gộp: **hết lượt** (cho xin thêm) ·
 * **link hết hạn** (cho gửi lại) · **bị thu hồi do hoàn tiền** (nêu rõ số tiền
 * đã hoàn). Gộp cả ba thành "không khả dụng" là cách chắc chắn nhất để biến ba
 * tình huống khác nhau thành cùng một ticket hỗ trợ.
 */
export default async function DownloadsPage() {
  const grants = await getDownloads();

  if (!grants.length) {
    return (
      <EmptyState
        icon={<FolderDown className="page__empty-icon" />}
        title="You have not bought any design files yet"
        action={
          <Button asChild>
            <Link href="/search?kind=file">Browse instant downloads</Link>
          </Button>
        }
      >
        Files you buy stay here for good — no expiry, and you can re-download them on a new
        computer.
      </EmptyState>
    );
  }

  return (
    <>
      <PageTitle className="page__title--tight">Your downloads</PageTitle>
      <p className="page__lede">
        Everything here is yours to keep. The download counter exists so a purchased file cannot be
        passed around indefinitely — it is not a time limit.
      </p>

      <Banner tone="info" className="page__notice" title="Links are generated when you click">
        <p>
          We never store a public URL to your files. Pressing Download asks the server to check your
          purchase and then issues a link that stops working after 60 seconds.
        </p>
      </Banner>

      <div className="page__stack">
        {grants.map((g) => (
          <DownloadCard key={g.id} grant={g} />
        ))}
      </div>
    </>
  );
}
