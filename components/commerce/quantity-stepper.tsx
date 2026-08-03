'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Ô số lượng — hai nút tăng/giảm và một ô gõ được ở giữa.
 *
 * Với hàng số, component này KHÔNG render — không phải render rồi vô hiệu hoá.
 * Mua hai lần cùng một giấy phép là vô nghĩa: cần dùng rộng hơn thì nâng cấp
 * giấy phép chứ không nhân số lượng. Một ô xám nằm đó chỉ khiến buyer đi tìm
 * lý do vì sao mình không được bấm.
 *
 * ── Vì sao ô giữa gõ được ────────────────────────────────────────────────
 *
 * Hai nút là đường nhanh cho 1→2→3, nhưng người mua sỉ nhấn 14 lần để lên 15
 * thì đó là ô nhập bị giấu đi chứ không phải bộ tăng giảm. Gõ thẳng số là cách
 * duy nhất không phụ thuộc vào việc số cần nhập lớn tới đâu.
 *
 * ── Vì sao `type="text"` chứ không phải `type="number"` ─────────────────
 *
 * `type="number"` tự mọc thêm cặp mũi tên của trình duyệt, tức là bốn nút tăng
 * giảm trên cùng một ô. Nó còn nhận cả bánh xe chuột: cuộn trang lúc con trỏ
 * vô tình nằm trên ô là số lượng đổi mà không ai bấm gì. `inputMode="numeric"`
 * vẫn bật bàn phím số trên điện thoại, không mất gì.
 *
 * ── Vì sao có `draft` ───────────────────────────────────────────────────
 *
 * Kẹp giá trị ngay từng phím gõ thì không xoá ô được: xoá "1" thành rỗng sẽ bị
 * kẹp về 1 ngay lập tức, và người muốn gõ "12" phải xoá được "1" trước đã.
 * `draft` giữ nguyên chuỗi đang gõ; chỉ tới lúc rời ô hoặc nhấn Enter mới kẹp
 * vào [1, max] và báo ra ngoài.
 *
 * ── Kiểu dáng đi mượn, không viết lại ───────────────────────────────────
 *
 * Hai nút là `<Button variant="ghost" size="icon-sm">` — đúng biến thể đã có
 * trong `components/ui/button.tsx`, nên chiều cao 28px, bo viên thuốc, nền hover
 * và trạng thái vô hiệu hoá đều đến từ hệ thống. Trước đó chỗ này là một chuỗi
 * lớp tự gõ dựng lại đúng những thứ ấy: nó trông giống nút hệ thống cho tới lần
 * đầu ai đó sửa `buttonVariants` và chỉ riêng hai nút này không đổi theo.
 *
 * Ô số ở giữa thì KHÔNG bọc qua `Input`: `Input` mang theo viền, nền, ring focus
 * và `w-full` — tức là bốn thứ phải tắt đi để nó nằm gọn trong khung viên thuốc.
 * Ghi đè bốn thuộc tính tốn nhiều lớp hơn là không mượn, và kết quả là một
 * `Input` không còn giống `Input` nào khác trong hệ thống.
 */
export function QuantityStepper({
  value,
  onChange,
  max = 20,
  label,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);

  const clamp = (n: number) => Math.min(max, Math.max(1, n));

  // Rỗng hoặc rác thì quay về giá trị cũ, không về 1: người xoá sạch ô rồi bỏ
  // đi không có ý đặt lại số lượng về 1, họ chỉ đổi ý giữa chừng.
  const commit = () => {
    if (draft === null) return;
    const parsed = Number.parseInt(draft, 10);
    setDraft(null);
    if (!Number.isNaN(parsed)) onChange(clamp(parsed));
  };

  const step = (delta: number) => {
    setDraft(null);
    onChange(clamp(value + delta));
  };

  return (
    <div
      className={cn('quantity-stepper', className)}
      role="group"
      aria-label={label}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => step(-1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="quantity-stepper__icon" />
      </Button>

      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={draft ?? String(value)}
        // Lọc phi-số ngay tại chỗ gõ thay vì báo lỗi sau: ô này chỉ có một dạng
        // dữ liệu hợp lệ, nên chặn luôn rẻ hơn là giải thích. Cắt 3 ký tự vì
        // `max` thực tế không bao giờ chạm 4 chữ số.
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 3))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
        className="quantity-stepper__input"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => step(1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="quantity-stepper__icon" />
      </Button>
    </div>
  );
}
