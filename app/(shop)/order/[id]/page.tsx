import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download, Package } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Money } from '@/components/shared/money';
import { StatusPill } from '@/components/commerce/order-line';
import { getOrder, ORDERS } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

type Params = { params: Promise<{ id: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export async function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }));
}

/**
 * B6 · Đặt hàng xong — L6 bố cục một cột tập trung.
 *
 * Thứ tự các khối theo **thứ tự nhận được giá trị**, không theo thứ tự dữ liệu:
 *
 *   1. Khối tải file      — thứ buyer nhận được NGAY LẬP TỨC
 *   2. Khối hàng vật lý   — thứ sẽ tới sau
 *   3. Khối mời tạo tài khoản
 *
 * Khối 3 đặt CUỐI vì đó là lúc buyer vừa nhận được giá trị và thiện chí cao
 * nhất. Đặt nó lên đầu — như phần lớn sàn vẫn làm — là xin xỏ trước khi cho.
 *
 * Lợi ích nêu cụ thể: "kho tải về không giới hạn thời gian" thay vì "lưu thông
 * tin của bạn". Câu thứ hai không nói được gì mà người mua chưa biết.
 */
export default async function OrderPlacedPage({ params }: Params) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const digital = order.lines.filter((l) => l.kind === 'file');
  const physical = order.lines.filter((l) => l.kind !== 'file');

  return (
    <div className="page__focus page__focus--lg">
      <div className="order-placed__head">
        <CheckCircle2 className="order-placed__icon" aria-hidden />
        <div>
          <PageTitle size="display">Order placed</PageTitle>
          <p className="order-placed__lede">
            Order <span className="order-placed__number">#{order.id}</span> · receipt sent to {order.email} ·{' '}
            <Money cents={order.totalCents} tone="quiet" size="sm" /> charged
          </p>
        </div>
      </div>

      {/* 1 · giá trị nhận được NGAY */}
      {digital.length > 0 && (
        <Card className="order-placed__card">
          <CardBody>
            <h2 className="order-placed__panel-title">
              <Download className="order-placed__panel-icon order-placed__panel-icon--file" aria-hidden />
              Ready to download now
            </h2>
            <ul className="order-placed__list">
              {digital.map((l) => (
                <li key={l.id} className="order-placed__item">
                  <span className="order-placed__item-title">{l.title}</span>
                  <Button size="sm">
                    <Download className="order-placed__download-icon" />
                    Download
                  </Button>
                </li>
              ))}
            </ul>
            {/* Không mời tạo tài khoản ở đây: file đã được gửi thẳng tới hộp
                thư và nằm lại đó, nên "tạo tài khoản để giữ file" là một lợi
                ích không có thật. Xin đăng ký bằng một lý do sai là cách nhanh
                nhất để người mua ngừng tin những dòng còn lại. */}
            <p className="order-placed__note">
              We have emailed the same links to {order.email}. They stay in your inbox, so there is
              nothing to save now and nothing to lose if you close this page.
            </p>
          </CardBody>
        </Card>
      )}

      {/* 2 · thứ sẽ tới sau */}
      {physical.length > 0 && (
        <Card className="order-placed__card order-placed__card--later">
          <CardBody>
            <h2 className="order-placed__panel-title">
              <Package className="order-placed__panel-icon" aria-hidden />
              On its way to you
            </h2>
            <p className="order-placed__address">{order.address}</p>
            <ul className="order-placed__list">
              {physical.map((l) => (
                <li key={l.id} className="order-placed__item order-placed__item--wrap">
                  <span className="order-placed__item-title">
                    {l.title}
                    {l.variantLabel && <span className="order-placed__variant"> · {l.variantLabel}</span>}
                  </span>
                  <StatusPill status={l.status} />
                </li>
              ))}
            </ul>
            <p className="order-placed__note">
              Printed items take a few days longer because they are made after you order — we email
              a tracking number the moment each parcel leaves the workshop.
            </p>
          </CardBody>
        </Card>
      )}

      <div className="order-placed__actions">
        <Button asChild variant="outline">
          <Link href={`/account/orders/${order.id}`}>View order details</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
