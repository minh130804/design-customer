'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Lớp phủ trượt vào — hai hướng, cho hai việc khác nhau:
 *
 *   side="left"    panel lọc, cao hết màn hình, có chân cố định Cancel/Apply
 *   side="bottom"  ngăn kéo ngắn trên điện thoại
 *
 * ĐÂY là chỗ Radix xứng đáng có mặt: khoá tiêu điểm trong lớp phủ, trả tiêu
 * điểm về nút mở khi đóng, khoá cuộn nền, `aria-modal`, phím Esc. Viết tay đủ
 * cả sáu thứ đó thì dài hơn 30 KB của thư viện.
 *
 * `footer` nằm NGOÀI vùng cuộn và luôn dính đáy. Panel lọc của Etsy dài hơn
 * hai màn hình; nếu nút Apply cuộn theo nội dung thì người dùng phải cuộn tới
 * cuối mới bấm được, và phần lớn sẽ đóng panel bằng nút X thay vì tìm nó.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  side = 'bottom',
  footer,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  side?: 'left' | 'bottom';
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet__overlay" />
        <Dialog.Content
          className={cn(
            'sheet__panel',
            side === 'left' ? 'sheet__panel--left' : 'sheet__panel--bottom',
          )}
        >
          <div className="sheet__head">
            <Dialog.Title className="sheet__title">{title}</Dialog.Title>
            <Dialog.Close className="sheet__close" aria-label="Close">
              <X className="sheet__close-icon" />
            </Dialog.Close>
          </div>

          <div className="sheet__body">{children}</div>

          {footer && <div className="sheet__foot">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
