/**
 * Chú giải cho nút chỉ có biểu tượng — bong bóng đen hiện khi rê chuột hoặc khi
 * tiêu điểm bàn phím rơi vào nút, đúng như ảnh chụp header Etsy.
 *
 * Bọc quanh nút, không thay thế `aria-label` của nút: bong bóng là `aria-hidden`
 * nên trình đọc màn hình chỉ nghe nhãn một lần. Lý do dùng CSS thuần thay vì
 * Radix Tooltip ghi ở block `.icon-tip` trong `app/styles/layout.css`.
 */
export function IconTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="icon-tip">
      {children}
      <span aria-hidden className="icon-tip__bubble">
        {label}
      </span>
    </span>
  );
}
