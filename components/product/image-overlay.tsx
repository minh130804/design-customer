'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ImageViewer } from './image-viewer';
import type { ProductImage } from '@/lib/products';

/**
 * Khung phóng to toàn màn hình (`#image-overlay` của Etsy).
 *
 * Nằm ở file RIÊNG để `next/dynamic` cắt được nó khỏi gói tải lần đầu:
 * @radix-ui/react-dialog cộng ImageViewer chiếm khoảng 24 KB, mà không ai
 * nhìn thấy chúng cho tới khi bấm vào ảnh. Trang chi tiết sản phẩm có ngân
 * sách 120 KB JS gzip cho toàn trang, nên 24 KB nạp sẵn là không mua nổi.
 *
 * Đổi lại: lần bấm đầu tiên phải chờ tải mã. Chấp nhận được vì thao tác đó
 * là chủ động, khác với việc trang nặng ngay khi vừa mở.
 */
export default function ImageOverlay({
  images,
  active,
  open,
  onOpenChange,
  onStep,
}: {
  images: ProductImage[];
  active: number;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStep: (delta: number) => void;
}) {
  const current = images[active];
  if (!current) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="image-overlay__scrim" />
        <Dialog.Content className="image-overlay__panel">
          <div className="image-overlay__head">
            <Dialog.Title className="image-overlay__title">{current.alt}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Zoomable product image. Use the plus and minus buttons, the mouse wheel or a pinch
              gesture to change the zoom level, and the arrow keys to move between images.
            </Dialog.Description>
            <Dialog.Close
              aria-label="Close"
              className="image-overlay__close"
            >
              <X className="image-overlay__close-icon" />
            </Dialog.Close>
          </div>

          <ImageViewer
            src={current.src}
            alt={current.alt}
            caption={current.caption}
            index={active}
            total={images.length}
            onPrev={() => onStep(-1)}
            onNext={() => onStep(1)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
