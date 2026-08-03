import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge chỉ biết các nhóm utility CHUẨN của Tailwind.
 * Thang tuỳ chỉnh của ta (shadow-elev-*, rounded-card, text-h1…) là class lạ
 * với nó, nên `shadow-elev-1 shadow-elev-3` sẽ được giữ cả hai và bóng chồng lên nhau.
 * Phải khai báo thêm nhóm — đây là bước hay bị bỏ sót nhất khi dùng bộ ba này.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['elev-1', 'elev-2', 'elev-3', 'elev-4'] }],
      rounded: [{ rounded: ['pill', 'base', 'card'] }],
      'font-size': [
        {
          text: [
            'heading', 'price', 'title-lg', 'title', 'title-sm',
            'body', 'body-sm', 'caption',
          ],
        },
      ],
    },
  },
});

/**
 * clsx nối và lọc → twMerge khử class xung đột, giữ cái sau.
 * Thứ tự có ý nghĩa: `className` của người gọi luôn đứng cuối nên luôn thắng.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Tiền lưu bằng số nguyên cent — không bao giờ dùng float cho tiền. */
export const formatUsd = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );

/**
 * Etsy không hứa "5–7 ngày" mà in ra một KHOẢNG NGÀY cụ thể:
 * "Order today to get by Feb 18–Mar 2".
 *
 * `from` phải do server truyền vào (ngày cắt đơn của backend), không lấy
 * Date.now() ở client: máy người dùng có thể lệch múi giờ hoặc sai đồng hồ,
 * và một trang ISR sẽ đóng băng ngày sai vào HTML tĩnh.
 */
export function deliveryWindow(from: string, minDays: number, maxDays: number) {
  const base = new Date(from + 'T00:00:00Z');
  const at = (d: number) => {
    const x = new Date(base);
    x.setUTCDate(x.getUTCDate() + d);
    return x;
  };
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return `${fmt.format(at(minDays))}–${fmt.format(at(maxDays))}`;
}

/**
 * Ảnh demo lấy từ picsum.photos.
 *
 * ── Vì sao dạng `/seed/<khoá>/` chứ không phải URL ngẫu nhiên ────────────
 *
 * `picsum.photos/800/800` trả về một ảnh KHÁC mỗi lần gọi. Với 18 trang sản phẩm
 * prerender thì ảnh nướng vào HTML tĩnh lúc build sẽ khác ảnh trình duyệt tải
 * lúc xem, và mỗi lần F5 là sản phẩm đổi mặt. `/seed/<khoá>/` băm khoá ra một
 * ảnh cố định, nên cùng một khoá luôn cho cùng một ảnh.
 *
 * Khoá luôn chứa slug sản phẩm, nhờ đó ảnh trên thẻ ở lưới và ảnh đầu trong
 * thư viện của trang chi tiết là CÙNG một ảnh — thẻ hiện một thứ rồi bấm vào ra
 * thứ khác là lỗi dễ thấy nhất của dữ liệu demo.
 *
 * Đây chỉ là ảnh tạm. Ở bản thật ảnh đi qua CDN riêng
 * (`cdn.podmarket.com/public/**`, xem `next.config.ts`).
 */
export function demoPhoto(seed: string, size = 800) {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}
