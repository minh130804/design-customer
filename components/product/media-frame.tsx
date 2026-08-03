'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductMedia } from '@/lib/products';

/** `.mp4`/`.webm` cần thẻ `<video>`; mọi thứ khác là ảnh (kể cả ảnh động). */
const isVideoFile = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/**
 * Khung hiển thị một mục media — ảnh hoặc video — với hành vi "rê chuột là phát".
 *
 * ── Vì sao có hai nhánh render ─────────────────────────────────────────
 *
 * Video thật (`.mp4`) đi qua `<video>`: có `muted` `loop` `playsInline`, và
 * `preload="none"` để trang không tải vài trăm KB video cho một thứ có thể
 * không ai xem. Ảnh động (SVG có animation, GIF, WebP động) đi qua `<img>` và
 * "phát" bằng cách ĐỔI `src` từ poster sang file động.
 *
 * Hai nhánh vì hai loại tệp cần hai thẻ, nhưng người gọi không phải biết:
 * cùng một `ProductMedia`, cùng một prop `playOnHover`.
 *
 * ── Vì sao không tự phát ngay ──────────────────────────────────────────
 *
 * Video tự chạy trong một lưới hai chục sản phẩm biến trang duyệt thành một
 * bức tường chuyển động, và nó tốn băng thông của người chỉ đang cuộn qua.
 * Rê chuột là tín hiệu quan tâm — đó là lúc phát.
 *
 * Người bật "giảm chuyển động" ở hệ điều hành không bao giờ thấy nó chạy:
 * `prefers-reduced-motion` được kiểm ở đây chứ không chỉ trong CSS, vì với
 * `<video>` thì CSS không dừng được luồng phát.
 */
export function MediaFrame({
  media,
  className,
  imageClassName,
  sizes,
  priority,
  playOnHover = true,
  playing,
}: {
  media: ProductMedia;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Tự phát khi con trỏ vào khung. Tắt đi khi phần cha tự điều khiển. */
  playOnHover?: boolean;
  /** Ép trạng thái phát từ bên ngoài — thẻ sản phẩm dùng để nghe hover cả thẻ. */
  playing?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [allowMotion, setAllowMotion] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAllowMotion(!query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const active = (playing ?? hovered) && allowMotion && media.type === 'video';

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => {
        /* Trình duyệt chặn phát tự động thì cứ để nguyên poster — không có gì
           để báo cho người dùng, và một thông báo lỗi ở đây còn tệ hơn. */
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  const hoverProps = playOnHover
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
      }
    : {};

  if (media.type === 'video' && isVideoFile(media.src)) {
    return (
      <span className={cn('media-frame', className)} {...hoverProps}>
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.alt}
          className={cn('media-frame__media', imageClassName)}
        />
      </span>
    );
  }

  return (
    <span className={cn('media-frame', className)} {...hoverProps}>
      <Image
        // Ảnh động chỉ được nạp khi thật sự phát; lúc còn lại dùng poster tĩnh.
        src={active ? media.src : (media.poster ?? media.src)}
        alt={media.alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
        className={cn('media-frame__media', imageClassName)}
      />
    </span>
  );
}

/** Nhãn nhỏ báo mục này là video — dùng ở dải ảnh nhỏ và ở thẻ sản phẩm. */
export function VideoBadge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('video-badge', className)}>
      {/* Tam giác vẽ bằng border — một icon nữa cho một hình đơn giản thế này
          là thêm một import không đổi lại được gì. */}
      <span className="video-badge__triangle" />
    </span>
  );
}
