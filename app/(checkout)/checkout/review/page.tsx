import type { Metadata } from 'next';
import { ReviewStep } from '@/components/commerce/review-step';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ReviewPage() {
  const session = await getSession();
  return <ReviewStep signedIn={session.signedIn} />;
}
