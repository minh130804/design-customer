'use client';

import * as React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Heart, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { MediaFrame, VideoBadge } from './media-frame';
import { cn } from '@/lib/utils';
import type { ProductMedia } from '@/lib/products';

/* Khung phóng to chỉ tải khi người dùng bấm vào ảnh — xem ghi chú trong
   image-overlay.tsx. ssr:false vì nó không bao giờ mở sẵn lúc trang vừa dựng. */
const ImageOverlay = dynamic(() => import('./image-overlay'), { ssr: false });

/**
 * Thư viện media của sản phẩm — dải nhỏ DỰNG ĐỨNG bên trái, mục lớn bên phải,
 * đúng `listing-page-image-carousel` của Etsy.
 *
 * ── Mục có thể là ẢNH hoặc VIDEO ────────────────────────────────────────
 *
 * Video hiện poster tĩnh và **tự phát khi rê chuột vào**, im tiếng và lặp lại.
 * Trong dải ảnh nhỏ nó mang một nhãn tam giác — không có nhãn thì người dùng
 * chỉ thấy một khung hình tĩnh nữa và không biết có gì để xem.
 *
 * ── Khung phóng to chỉ mở với ẢNH ───────────────────────────────────────
 *
 * Phóng to một video là bài toán khác hẳn (điều khiển phát, thanh thời gian,
 * phụ đề), và nó không giải quyết nhu cầu nào có thật ở đây: người ta phóng to
 * để soi đường chỉ và kết cấu mực, tức là để soi ẢNH. Vì vậy khung phóng to
 * nhận một danh sách CHỈ CÓ ẢNH, với chỉ số riêng — nếu dùng chung chỉ số với
 * dải media thì mũi tên trong khung phóng to sẽ nhảy qua một mục trống.
 *
 * Khung mục lớn VUÔNG, không phải 5:4: thẻ trong lưới giữ 5:4 vì ở đó chiều
 * cao nhân lên theo số hàng, còn ở đây khung vuông cho ảnh lớn hơn ~25% ở cùng
 * bề ngang.
 */
export function ProductGallery({ media }: { media: ProductMedia[] }) {
  const [active, setActive] = React.useState(0);
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null);
  const [faved, setFaved] = React.useState(false);
  const stripRef = React.useRef<HTMLUListElement>(null);

  const images = React.useMemo(() => media.filter((m) => m.type === 'image'), [media]);
  const current = media[active];

  const go = React.useCallback(
    (d: number) => setActive((i) => (i + d + media.length) % media.length),
    [media.length],
  );

  /* Mục đang chọn phải luôn nằm trong tầm nhìn: bấm mũi tên qua mục thứ 7 mà
     dải không cuộn theo thì người dùng mất dấu mình đang ở đâu. */
  React.useEffect(() => {
    stripRef.current?.children[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [active]);

  if (!current) return null;

  function openViewer() {
    const item = media[active];
    if (!item || item.type !== 'image') return;
    setViewerIndex(images.findIndex((m) => m.id === item.id));
  }

  const thumb = (item: ProductMedia, i: number) => (
    <button
      onClick={() => setActive(i)}
      aria-label={item.caption}
      aria-current={i === active}
      className={cn('gallery__thumb', i === active && 'gallery__thumb--active')}
    >
      <Image
        src={item.poster ?? item.src}
        alt=""
        width={item.width}
        height={item.height}
        unoptimized
        sizes="64px"
        className="gallery__thumb-image"
      />
      {item.type === 'video' && <VideoBadge className="gallery__thumb-video" />}
      {item.role === 'chart' && <span className="gallery__thumb-chart">SIZES</span>}
    </button>
  );

  return (
    <div>
      <div className="gallery__layout">
        {/* ── dải nhỏ dựng đứng ────────────────────────────────
            Lý do phải có `min-h-0` và vì sao ngưỡng là `md` chứ không `sm` ghi
            ở `.gallery__strip` trong `app/styles/product.css`. */}
        <ul ref={stripRef} className="gallery__strip">
          {media.map((item, i) => (
            <li key={item.id}>{thumb(item, i)}</li>
          ))}
        </ul>

        {/* ── mục lớn ──────────────────────────────────────────── */}
        <div className="gallery__main">
          <div className="gallery__stage">
            <button
              onClick={openViewer}
              aria-label={current.type === 'video' ? current.alt : 'Open image viewer'}
              className={cn(
                'gallery__open',
                current.type === 'image' && 'gallery__open--zoomable',
              )}
            >
              <MediaFrame
                media={current}
                className="gallery__media"
                imageClassName="gallery__image"
                sizes="(max-width: 1024px) 100vw, 620px"
                priority={active === 0}
              />

              {current.type === 'image' && (
                <span className="gallery__zoom-hint">
                  <Expand className="gallery__zoom-icon" /> Click to zoom
                </span>
              )}
            </button>

            <button
              onClick={() => setFaved((v) => !v)}
              aria-pressed={faved}
              aria-label={faved ? 'Remove from favourites' : 'Add to favourites'}
              className="gallery__fav"
            >
              <Heart className={cn('gallery__fav-icon', faved && 'gallery__fav-icon--on')} />
            </button>

            {media.length > 1 && (
              <>
                <CarouselNav side="left" onClick={() => go(-1)} />
                <CarouselNav side="right" onClick={() => go(1)} />
              </>
            )}
          </div>

          <p className="gallery__caption">
            {current.caption} · <span className="gallery__caption-index">{active + 1}</span> of{' '}
            {media.length}
          </p>
        </div>
      </div>

      {/* ── dải ngang thay thế, CHỈ dưới `sm` ─────────────────── */}
      <ul className="gallery__strip--horizontal">
        {media.map((item, i) => (
          <li key={item.id} className="gallery__strip-item">
            {thumb(item, i)}
          </li>
        ))}
      </ul>

      {/* Chỉ dựng sau lần bấm đầu tiên → mã của Dialog không nằm trong gói đầu */}
      {viewerIndex !== null && (
        <ImageOverlay
          images={images}
          active={viewerIndex}
          open
          onOpenChange={(v) => !v && setViewerIndex(null)}
          onStep={(d) => setViewerIndex((i) => ((i ?? 0) + d + images.length) % images.length)}
        />
      )}
    </div>
  );
}

function CarouselNav({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous item' : 'Next item'}
      className={cn(
        'gallery__nav',
        side === 'left' ? 'gallery__nav--prev' : 'gallery__nav--next',
      )}
    >
      <Icon className="gallery__nav-icon" />
    </button>
  );
}
