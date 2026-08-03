/**
 * Ngôi sao đặc, năm cánh NHỌN.
 *
 * ── Vì sao không dùng `Star` của lucide ─────────────────────────────────
 *
 * CLAUDE.md quy định lucide-react là bộ icon duy nhất, và quy định đó vẫn giữ:
 * đây không phải một bộ icon khác, mà là một hình duy nhất vẽ tay vì lucide
 * không vẽ được thứ cần. Đường path của lucide có cung bo ngay tại mỗi đỉnh:
 *
 *     M11.525 2.295a.53.53 0 0 1 .95 0 …
 *                  ^^^^^^^^^^^^^^^^^^ cung bán kính .53 ở đầu cánh
 *
 * Nghĩa là đầu cánh tròn nằm trong CHÍNH hình, không phải do `stroke-linejoin`.
 * Đặt `strokeWidth={0}` hay `strokeLinejoin="miter"` đều không làm nó nhọn được
 * — muốn nhọn thì phải là hình khác.
 *
 * ── Vì sao đặc chứ không viền ───────────────────────────────────────────
 *
 * Icon lucide vẽ bằng nét dày 2 trên khung 24. Thu về 10px thì nét còn
 * 2 ÷ 24 × 10 ≈ 0,83px — mảnh tới mức nhoè, và phần rỗng bên trong hẹp hơn cả
 * nét bao quanh. Ở cỡ này hình đặc là cách duy nhất còn đọc ra là ngôi sao.
 * Màu do lớp gọi quyết định bằng `fill-*`; `fill` là thuộc tính SVG kế thừa nên
 * đặt trên `<svg>` là `<polygon>` nhận theo.
 *
 * ── Toạ độ ──────────────────────────────────────────────────────────────
 *
 * Sao năm cánh đều, tâm (12,12) trên khung 24×24 — cùng khung với lucide nên
 * mọi lớp `h-*`/`w-*` đang dùng vẫn cho ra đúng kích thước cũ.
 *
 * Bán kính ngoài 11,2 · bán kính trong 4,3 · tỉ lệ trong/ngoài 0,384.
 * Chính tỉ lệ đó quyết định độ nhọn: càng nhỏ cánh càng mảnh và nhọn. Ngôi sao
 * "tròn trịa" kiểu lucide tương đương tỉ lệ khoảng 0,52.
 *
 * Đỉnh tính bằng θ = −90° + k×36°, k = 0…9, bán kính đảo ngoài/trong.
 */
const STAR_POINTS = [
  '12,0.8', // đỉnh trên
  '14.53,8.52',
  '22.65,8.54', // cánh phải
  '16.09,13.33',
  '18.58,21.06', // chân phải
  '12,16.3',
  '5.42,21.06', // chân trái
  '7.91,13.33',
  '1.35,8.54', // cánh trái
  '9.47,8.52',
].join(' ');

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <polygon points={STAR_POINTS} />
    </svg>
  );
}
