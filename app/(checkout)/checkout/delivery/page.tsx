import type { Metadata } from 'next';
import { DeliveryStep } from '@/components/commerce/delivery-step';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Server component mỏng: đọc phiên rồi giao cho client.
 *
 * Cookie phiên là `httpOnly` nên chỉ đọc được ở đây. Đọc ở server còn có lợi
 * thứ hai: không bao giờ có cảnh lần vẽ đầu hiện form khách vãng lai rồi nhấp
 * nháy đổi sang sổ địa chỉ khi JavaScript kịp chạy.
 */
export default async function DeliveryPage() {
  const session = await getSession();
  return <DeliveryStep signedIn={session.signedIn} name={session.name} />;
}
