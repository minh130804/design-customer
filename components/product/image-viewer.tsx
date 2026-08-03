'use client';

import * as React from 'react';
import { Minus, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.5;

/** Mức phóng khi bấm vào ảnh. */
const CLICK_ZOOM = 2.5;

/** Ngưỡng phân biệt BẤM với KÉO, tính bằng pixel.
 *
 *  Trình duyệt vẫn phát sự kiện `click` sau một cú kéo, nên nếu không đo quãng
 *  di chuyển thì mỗi lần người dùng kéo ảnh xong là nó tự thu về. Ngón tay trên
 *  cảm ứng luôn xê dịch vài pixel ngay cả khi người dùng nghĩ mình bấm đứng
 *  yên — 6px đủ rộng để tha thứ, đủ hẹp để không nuốt mất một cú kéo thật. */
const CLICK_SLOP = 6;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Props = {
  src: string;
  alt: string;
  caption?: string;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Bộ xem ảnh có phóng to — viết tay, không dùng thư viện lightbox.
 *
 * Thư viện lightbox phổ biến nặng 20–40 KB cho việc mà ~150 dòng này làm được,
 * và trang chi tiết sản phẩm có ngân sách 120 KB JS gzip cho TOÀN BỘ trang.
 *
 * ── MỘT cú bấm là phóng ──────────────────────────────────────────────────
 *
 * Khung mở ra ở cỡ vừa khung, đúng như người dùng vừa thấy ở lưới. Muốn soi kỹ
 * thì bấm MỘT lần vào chỗ cần soi — trước đây chỗ này bắt nháy đúp, một cử chỉ
 * phải học và không có gì trên màn hình gợi ý.
 *
 * Hỗ trợ: bấm · cuộn chuột · nút · kéo để di · chụm hai ngón · bàn phím.
 */
export function ImageViewer({ src, alt, caption, index, total, onPrev, onNext }: Props) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const [scale, setScale] = React.useState(1);
  const [tx, setTx] = React.useState(0);
  const [ty, setTy] = React.useState(0);
  const [smooth, setSmooth] = React.useState(true);

  // con trỏ đang chạm — dùng cho kéo (1 ngón) và chụm (2 ngón)
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = React.useRef<{ dist: number; scale: number } | null>(null);
  const dragStart = React.useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  /** Điểm nhấn xuống gần nhất — dùng để phân biệt một cú BẤM với một cú KÉO. */
  const downAt = React.useRef<{ x: number; y: number } | null>(null);

  /** Chặn ảnh bị kéo ra ngoài khung. Dùng offsetWidth (kích thước bố cục,
   *  không bị transform ảnh hưởng) nên số đo luôn đúng ở mọi mức phóng. */
  const clampOffset = React.useCallback((s: number, nx: number, ny: number) => {
    const vp = viewportRef.current;
    const img = imgRef.current;
    if (!vp || !img) return { x: nx, y: ny };
    const maxX = Math.max(0, (img.offsetWidth * s - vp.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * s - vp.clientHeight) / 2);
    return { x: clamp(nx, -maxX, maxX), y: clamp(ny, -maxY, maxY) };
  }, []);

  /** Phóng quanh một điểm — giữ nguyên điểm dưới con trỏ.
   *  screen = offset + scale · image  ⇒  offset' = p − (p − offset)·(s'/s) */
  const zoomAround = React.useCallback(
    (next: number, clientX?: number, clientY?: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const s = clamp(next, MIN_SCALE, MAX_SCALE);

      let nx = tx;
      let ny = ty;
      if (clientX !== undefined && clientY !== undefined) {
        const r = vp.getBoundingClientRect();
        const px = clientX - r.left - r.width / 2;
        const py = clientY - r.top - r.height / 2;
        const k = s / scale;
        nx = px - (px - tx) * k;
        ny = py - (py - ty) * k;
      } else {
        const k = s / scale;
        nx = tx * k;
        ny = ty * k;
      }

      const c = clampOffset(s, s === MIN_SCALE ? 0 : nx, s === MIN_SCALE ? 0 : ny);
      setScale(s);
      setTx(c.x);
      setTy(c.y);
    },
    [scale, tx, ty, clampOffset],
  );

  const reset = React.useCallback(() => {
    setSmooth(true);
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  // Đổi ảnh thì trả về mức phóng ban đầu — người dùng không mong ảnh mới
  // mở ra ở giữa vùng đã phóng của ảnh trước.
  React.useEffect(() => {
    reset();
  }, [src, reset]);

  // Cuộn chuột. Phải addEventListener thủ công với passive:false —
  // React gắn onWheel ở dạng passive nên preventDefault() sẽ bị bỏ qua
  // và cả trang cuộn theo.
  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setSmooth(false);
      zoomAround(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [scale, zoomAround]);

  // Bàn phím: +/− phóng, 0 đặt lại, ←/→ đổi ảnh
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') { setSmooth(true); zoomAround(scale + STEP); }
      else if (e.key === '-' || e.key === '_') { setSmooth(true); zoomAround(scale - STEP); }
      else if (e.key === '0') reset();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scale, zoomAround, reset, onPrev, onNext]);

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downAt.current = { x: e.clientX, y: e.clientY };

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (a && b) pinchStart.current = { dist: dist(a, b), scale };
      dragStart.current = null;
    } else if (scale > MIN_SCALE) {
      dragStart.current = { x: e.clientX, y: e.clientY, tx, ty };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setSmooth(false);

    // chụm hai ngón
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const ratio = dist(a, b) / pinchStart.current.dist;
      zoomAround(pinchStart.current.scale * ratio, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }

    // kéo để di — chỉ khi đã phóng
    if (dragStart.current) {
      const d = dragStart.current;
      const c = clampOffset(scale, d.tx + (e.clientX - d.x), d.ty + (e.clientY - d.y));
      setTx(c.x);
      setTy(c.y);
    }
  }

  function endPointer(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
  }

  /**
   * MỘT cú bấm là phóng, ngay tại điểm vừa bấm. Bấm lần nữa thì thu về.
   *
   * Trước đây đây là `onDoubleClick`, và nháy đúp là một cử chỉ phải học: người
   * mua bấm một lần, không thấy gì đổi, rồi bỏ cuộc — trong khi con trỏ hình
   * kính lúp đang hứa ngược lại.
   *
   * Hai thứ phải loại ra, nếu không cú bấm sẽ bắn nhầm:
   *
   * · **Cú kéo.** Trình duyệt vẫn phát `click` sau khi kéo xong, nên kéo ảnh
   *   sang chỗ khác sẽ tự thu về ngay khi thả tay. Đo quãng con trỏ đi được từ
   *   lúc nhấn xuống; quá `CLICK_SLOP` thì đó là kéo, không phải bấm.
   * · **Nút bên trong khung.** Hai mũi tên đổi ảnh nằm chồng trên ảnh và sự
   *   kiện của chúng nổi bọt lên đây; không chặn thì đổi ảnh cũng kéo theo một
   *   lần phóng.
   */
  function onClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return;

    const down = downAt.current;
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > CLICK_SLOP) return;

    setSmooth(true);
    zoomAround(scale > 1.2 ? MIN_SCALE : CLICK_ZOOM, e.clientX, e.clientY);
  }

  const zoomed = scale > MIN_SCALE + 0.001;

  return (
    <div className="image-viewer">
      {/* khung ảnh */}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onClick={onClick}
        className={cn(
          'image-viewer__stage',
          zoomed && 'image-viewer__stage--zoomed',
          zoomed && dragStart.current && 'image-viewer__stage--grabbing',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh trong khung
            phóng phải là <img> thường: next/image bọc thêm lớp và cản transform.
            Ảnh lưới bên ngoài vẫn dùng next/image. */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transition: smooth ? 'transform 180ms cubic-bezier(.2,.8,.2,1)' : 'none',
          }}
          className="image-viewer__img"
        />

        {/* điều hướng ảnh */}
        {total > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous image"
              className="image-viewer__nav image-viewer__nav--prev"
            >
              <ChevronLeft className="image-viewer__nav-icon" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next image"
              className="image-viewer__nav image-viewer__nav--next"
            >
              <ChevronRight className="image-viewer__nav-icon" />
            </button>
          </>
        )}

        <div className="image-viewer__badge">
          {index + 1} / {total} · {Math.round(scale * 100)}%
        </div>
      </div>

      {/* thanh điều khiển */}
      <div className="image-viewer__bar">
        <button
          onClick={() => { setSmooth(true); zoomAround(scale - STEP); }}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="image-viewer__zoom"
        >
          <Minus className="image-viewer__zoom-icon" />
        </button>

        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.1}
          value={scale}
          aria-label="Zoom level"
          onChange={(e) => { setSmooth(false); zoomAround(Number(e.target.value)); }}
          className="image-viewer__range"
        />

        <button
          onClick={() => { setSmooth(true); zoomAround(scale + STEP); }}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="image-viewer__zoom"
        >
          <Plus className="image-viewer__zoom-icon" />
        </button>

        <button onClick={reset} disabled={!zoomed} className="image-viewer__reset">
          <RotateCcw className="image-viewer__reset-icon" /> Reset
        </button>

        <p className="image-viewer__caption">
          {caption ?? alt} · scroll or pinch to zoom, drag to pan, double-click to toggle
        </p>
      </div>
    </div>
  );
}
