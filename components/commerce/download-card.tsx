import Image from 'next/image';
import { Download, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/shared/banner';
import * as Progress from '@radix-ui/react-progress';
import { Money } from '@/components/shared/money';
import { cn } from '@/lib/utils';
import type { DownloadGrant } from '@/lib/account';

/**
 * A10 · Thẻ tải file — chỉ có ở nhánh hàng số.
 *
 * Ba thông tin BẮT BUỘC, và thiếu bất kỳ cái nào là một ticket hỗ trợ:
 *   · trong gói có gì   → buyer biết mình đã mua đúng thứ cần
 *   · còn bao nhiêu lượt → buyer không hoảng khi tải lần thứ ba
 *   · hạn đến bao giờ    → buyer biết có cần tải ngay không
 *
 * Nút *Tải về* không dẫn thẳng tới file. Bấm là gọi backend, backend kiểm quyền
 * rồi mới phát một đường dẫn tạm sống 60 giây — nếu không thì link rò ra ngoài
 * là ai cũng tải được, mãi mãi.
 */
export function DownloadCard({ grant }: { grant: DownloadGrant }) {
  const exhausted = grant.used >= grant.limit;
  const expired = grant.expiresAt !== null && new Date(grant.expiresAt) < new Date('2026-07-29');

  return (
    <Card>
      <div className="download-card__row">
        <div className="download-card__thumb">
          <Image src={grant.image} alt="" fill sizes="80px" className="download-card__image" />
        </div>

        <div className="download-card__body">
          <h3 className="download-card__title">{grant.title}</h3>

          <p className="download-card__bought">
            Bought {grant.purchasedAt} · order #{grant.orderId}
          </p>

          <p className="download-card__contents">
            {grant.contents.join(' · ')}{' '}
            <span className="download-card__size">· {grant.sizeLabel}</span>
          </p>

          {/* Số lượt còn lại — thanh tiến độ ĐI NGƯỢC: đầy nghĩa là sắp hết. */}
          <div className="download-card__quota">
            <Progress.Root
              value={(grant.used / grant.limit) * 100}
              className="download-card__meter"
            >
              <Progress.Indicator
                className={cn(
                  'download-card__meter-bar',
                  exhausted && 'download-card__meter-bar--exhausted',
                )}
                style={{ width: `${(grant.used / grant.limit) * 100}%` }}
              />
            </Progress.Root>
            <span className="download-card__quota-text">
              {grant.used} of {grant.limit} downloads used
            </span>
            {grant.expiresAt && (
              <span className="download-card__expiry">· link valid until {grant.expiresAt}</span>
            )}
          </div>

          <div className="download-card__actions">
            {grant.revoked ? null : exhausted ? (
              <Button size="sm" variant="outline">
                <RotateCcw className="download-card__action-icon" />
                Ask the shop for more downloads
              </Button>
            ) : expired ? (
              <Button size="sm" variant="outline">
                Send me a fresh link
              </Button>
            ) : (
              <Button size="sm">
                <Download className="download-card__action-icon" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>

      {grant.revoked && (
        <div className="download-card__notice">
          <Banner tone="critical" title="These files were withdrawn after a refund">
            <p>{grant.revoked.reason}</p>
            <p>
              <Money cents={grant.revoked.refundedCents} tone="in" size="sm" /> was returned to your
              original payment method.
            </p>
          </Banner>
        </div>
      )}

      {exhausted && !grant.revoked && (
        <div className="download-card__notice">
          <Banner tone="warning" title="You have used all 5 downloads">
            <p>
              Downloads are capped so a purchased file cannot be passed around indefinitely. Shops
              almost always grant more when you ask — say which device you lost the files on.
            </p>
          </Banner>
        </div>
      )}
    </Card>
  );
}
