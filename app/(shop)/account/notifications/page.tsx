import Link from 'next/link';
import type { Metadata, Route } from 'next';
import { Package, AlertCircle, Download, TrendingDown, Store, Star } from 'lucide-react';
import { PageTitle } from '@/components/shared/page-title';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getNotifications } from '@/lib/notifications';
import type { NotificationKind } from '@/lib/notifications';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Updates — POD Market' };

const ICON: Record<NotificationKind, React.ElementType> = {
  shipped: Package,
  'action-needed': AlertCircle,
  'download-ready': Download,
  'price-drop': TrendingDown,
  'shop-update': Store,
  'review-request': Star,
};

/**
 * Trang đầy đủ của hộp thông báo — đích của "See all updates".
 *
 * Dùng lại đúng block `.notify__item` của panel trên header thay vì dựng một
 * dạng thứ hai: cùng một thứ dữ liệu, cùng một cách đọc, nên hai chỗ trông giống
 * nhau là đúng. Khác duy nhất là ở đây không giới hạn chiều cao.
 */
export default async function NotificationsPage() {
  const items = await getNotifications();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No updates yet"
        action={
          <Button asChild>
            <Link href="/search">Start browsing</Link>
          </Button>
        }
      >
        Order progress, download links and price drops on things you saved all land here.
      </EmptyState>
    );
  }

  return (
    <>
      <PageTitle className="page__title">Updates</PageTitle>

      <Card className="notifications__card">
        <ul>
          {items.map((n) => {
            const Icon = ICON[n.kind];
            return (
              <li key={n.id}>
                <Link
                  href={n.href as Route}
                  className={cn('notify__item', !n.read && 'notify__item--unread')}
                >
                  <Icon className={cn('notify__icon', `notify__icon--${n.kind}`)} aria-hidden />
                  <span className="notify__body">
                    <span className="notify__subject">{n.title}</span>
                    <span className="notify__detail">{n.body}</span>
                    <span className="notify__at">{n.at}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
