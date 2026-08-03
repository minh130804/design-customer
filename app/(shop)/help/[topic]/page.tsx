import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/shared/page-title';

type Params = { params: Promise<{ topic: string }> };

/**
 * Trang chính sách — L6 bố cục một cột, tối đa 720px.
 *
 * Ba chủ đề này không phải "trang tĩnh cho đủ bộ": cả ba đều được dẫn link từ
 * đúng lúc người dùng cần đọc — chính sách hàng số nằm cạnh nút mua, chính sách
 * đổi trả nằm trong hộp mua, và liên hệ nằm ở chi tiết đơn.
 *
 * Bề rộng chặn 720px vì dòng chữ dài quá 75 ký tự thì mắt mất dấu khi xuống
 * dòng — với văn bản pháp lý người ta vốn đã đọc miễn cưỡng, điều đó đủ để họ bỏ.
 */
const TOPICS: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  returns: {
    title: 'Returns and refunds',
    intro:
      'Every shop sets its own window, shown on the listing before you buy. The rules below are the marketplace floor — a shop may be more generous, never less.',
    sections: [
      [
        'Physical items',
        'You have at least 30 days from delivery to start a return. Buyers pay return shipping unless the item arrived damaged or differs from the listing.',
      ],
      [
        'Made-to-order items',
        'Printed items are produced after you order, so we cannot resell a returned one. They are still returnable if the print is faulty, misaligned, or on the wrong garment.',
      ],
      [
        'Personalised items',
        'Items carrying a name or custom line cannot be returned for a change of mind. They can be returned if they arrive damaged or do not match what you ordered.',
      ],
    ],
  },
  digital: {
    title: 'Design file policy',
    intro:
      'Design files are delivered the moment your payment clears, which makes them different from everything else on the marketplace.',
    sections: [
      [
        'No returns once downloaded',
        'The file cannot be taken back, so a refund after download would mean giving it away. If you have not downloaded a file yet, you can still cancel and get a full refund.',
      ],
      [
        'Download limits',
        'Each purchase comes with five downloads. The cap exists so a purchased file cannot be handed around indefinitely — it is not a time limit, and shops almost always grant more when asked.',
      ],
    ],
  },
  selling: {
    title: 'How selling works',
    intro:
      'You upload a design and choose what it goes on. Nothing is made until someone buys, and the marketplace pays the print shop up front — so you never buy stock.',
    sections: [
      [
        'What you are responsible for',
        'The artwork, the listing, and answering buyers. You must own the rights to what you upload or hold a licence that allows resale — this is the single most common reason a listing gets rejected.',
      ],
      [
        'What we are responsible for',
        'Printing, packing, shipping, tracking and the payment itself. If a print comes out wrong, we reprint it and settle with the workshop; it does not come out of your payout.',
      ],
      [
        'What you cannot do',
        'Sell below print cost. The marketplace advances that money to the workshop before you are paid, so a listing priced under cost would lose real money on every sale. The listing editor blocks it rather than warning about it.',
      ],
      [
        'How long approval takes',
        'A new listing is usually reviewed within two hours. We check copyright and print resolution, not taste — a rejection always names the rule and what to change.',
      ],
    ],
  },
  fees: {
    title: 'Fees and payouts',
    intro:
      'Nothing to pay until you sell. One percentage comes off each order, and print costs are deducted from that same order rather than billed to you.',
    sections: [
      [
        'What comes off a sale',
        'The marketplace fee is 10% of what the buyer pays. For printed items the print cost is deducted as well, and it is shown to you before you publish — you always see the margin, not just the price.',
      ],
      [
        'When money becomes yours',
        'An order moves through three states: Pending while the return window is open, then Next payout once the books close, then Paid. Every seller dashboard shows all three separately, because "why is my money not here yet" is the question sellers ask most.',
      ],
      [
        'Payout schedule',
        'Weekly, twice monthly, or monthly — your choice. Books close on the schedule you pick and the transfer leaves two working days later.',
      ],
      [
        'Selling before you are verified',
        'You can. Payout details are only needed before the first transfer, not before the first sale. Money earned in the meantime sits in Pending; it is not lost and it is not held against you.',
      ],
    ],
  },
  contact: {
    title: 'Contact us',
    intro:
      'Message the shop first for anything about a specific order — they can act on it directly and usually answer within hours.',
    sections: [
      [
        'When to contact the marketplace instead',
        'Payment problems, a shop that has not replied in 48 hours, or anything about your account rather than an order.',
      ],
      [
        'What to include',
        'Your order number and what you would like to happen. "Order 10231, the print is off-centre, I would like a replacement" gets resolved in one round; "my order is wrong" takes four.',
      ],
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(TOPICS).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { topic } = await params;
  const t = TOPICS[topic];
  return t ? { title: `${t.title} — POD Market`, description: t.intro } : {};
}

export default async function HelpTopicPage({ params }: Params) {
  const { topic } = await params;
  const t = TOPICS[topic];
  if (!t) notFound();

  return (
    <div className="page__focus page__focus--lg">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: t.title }]} />

      <PageTitle size="display" className="help-page__title">{t.title}</PageTitle>
      <p className="help-page__intro">{t.intro}</p>

      <div className="help-page__sections">
        {t.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2 className="help-page__heading">{heading}</h2>
            <p className="help-page__body">{body}</p>
          </section>
        ))}
      </div>

      <div className="help-page__actions">
        <Button asChild variant="outline">
          <Link href="/account/orders">Go to your orders</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/order/lookup">Track an order without an account</Link>
        </Button>
      </div>
    </div>
  );
}
