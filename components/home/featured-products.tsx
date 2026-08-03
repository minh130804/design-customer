'use client';

import * as React from 'react';
import { ProductGrid } from '@/components/commerce/product-grid';
import { Button } from '@/components/ui/button';
import type { Listing } from '@/lib/catalog';

const FIRST_BATCH = 5;
const STEP = 5;

/**
 * Dải sản phẩm nổi bật ở trang chủ, mở rộng dần bằng nút *Show more*.
 *
 * ── Vì sao mở dần thay vì bày hết ───────────────────────────────────────
 *
 * Trang chủ bày gần hết kho hàng là trang chủ **không nhấn được thứ gì** —
 * người vào lần đầu phải tự quét qua mọi thứ để tìm điểm bắt đầu, đúng việc
 * trang chủ sinh ra để làm hộ họ. Năm món đầu đủ để nói sàn này bán gì; ai
 * muốn xem tiếp thì bấm.
 *
 * ── Vì sao nút KHÔNG hiện số còn lại ────────────────────────────────────
 *
 * "Show more (13)" nói cho người mua biết cả sàn chỉ có 18 món. Con số quy mô
 * chỉ thuyết phục khi nó lớn, và ở giai đoạn đầu thì tốt nhất là không nhắc
 * tới — nhất là ở trang chủ, chỗ ấn tượng đầu tiên được hình thành.
 *
 * ── Vì sao mở dần chứ không mở hết một lần ──────────────────────────────
 *
 * Bấm một cái rồi trang dài thêm ba màn hình là mất luôn vị trí đang đọc. Mỗi
 * lần thêm một hàng thì cái nút vẫn nằm gần chỗ vừa bấm.
 *
 * Toàn bộ danh sách đã có sẵn từ server — nút này chỉ hé lộ dần, không gọi
 * mạng. Ở bản thật, khi danh mục lớn lên thì đây là chỗ đổi sang phân trang
 * theo con trỏ; giao diện không đổi.
 */
export function FeaturedProducts({ listings }: { listings: Listing[] }) {
  const [visible, setVisible] = React.useState(FIRST_BATCH);
  const shown = listings.slice(0, visible);
  const hasMore = visible < listings.length;

  return (
    <>
      <ProductGrid listings={shown} />

      {hasMore && (
        <div className="featured-products__more">
          <Button variant="outline" onClick={() => setVisible((v) => v + STEP)}>
            Show more
          </Button>
        </div>
      )}
    </>
  );
}
