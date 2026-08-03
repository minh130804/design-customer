import type { Metadata } from 'next';
import { PaymentStep } from '@/components/commerce/payment-step';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PaymentPage() {
  return <PaymentStep />;
}
