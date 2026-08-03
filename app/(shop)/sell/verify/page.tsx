import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { VerifyForm } from '@/components/sell/verify-form';

export const metadata: Metadata = {
  title: 'Confirm your email — POD Market',
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

/**
 * Server component mỏng: đọc email từ URL rồi giao cho client.
 *
 * Vào thẳng đường dẫn này mà không có email thì quay về màn đăng ký — hiện một
 * ô nhập mã cho một địa chỉ không ai biết là ngõ cụt, người dùng gõ mã xong
 * cũng không có gì để đối chiếu.
 */
export default async function VerifyPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.email) ? sp.email[0] : sp.email;
  if (!raw) redirect('/sell');

  return <VerifyForm email={raw} />;
}
