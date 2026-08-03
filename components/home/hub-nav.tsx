import Link from 'next/link';

/**
 * Dải điểm đến biên tập, ngay đầu trang chủ.
 *
 * Trong ảnh chụp trang chủ Etsy, ngay dưới ô tìm kiếm có một dải:
 * *Gifts · Sellers to Watch · Home Favourites · Fashion Finds · Vintage ·
 * Registry · Gift Cards*.
 *
 * Đọc đường dẫn thật trong bản lưu mới thấy đây KHÔNG phải cây danh mục:
 *
 *     Home Favorites  → /featured/hub/home-favorites
 *     Fashion Finds   → /featured/hub/fashion-favorites
 *     Vintage         → /r/curated/etsys-best-vintage-finds
 *     Wedding Guide   → /featured/hub/weddings-hub
 *     Gift Cards      → /giftcards
 *
 * Toàn bộ là điểm đến do biên tập chọn. Nó trả lời "tôi chưa biết mình muốn gì",
 * còn menu *Categories* trên header trả lời "cho tôi xem cây hàng hoá". Hai câu
 * hỏi khác nhau nên tồn tại song song mà không dẫm chân.
 *
 * ── Vì sao nằm ở trang chủ chứ không phải header ────────────────────────
 *
 * Ở Etsy dải này thuộc header và theo người dùng đi mọi trang. Ở đây nó chỉ nằm
 * trên trang chủ, vì bạn đã yêu cầu bỏ danh sách danh mục khỏi header — một dải
 * link cố định dưới thanh tìm kiếm sẽ trông đúng như thứ vừa bỏ đi, dù nội dung
 * bên trong khác hẳn.
 *
 * Mỗi mục trỏ tới một route CÓ THẬT (`typedRoutes` không cho làm khác), nên đây
 * là những lát cắt dựng từ bộ lọc và cây danh mục sẵn có, không phải trang hub
 * biên tập riêng.
 */
const HUBS = [
  ['Gift cards', '/gift-cards'],
  ['Gift ideas', '/search?q=gift'],
  ['Instant downloads', '/search?kind=file'],
  ['Made for you', '/search?kind=pod'],
  ['Ready to ship', '/search?kind=stock'],
  ['On sale', '/search?sale=1'],
  ['Clothing', '/c/clothing'],
  ['Home & kitchen', '/c/home/kitchen'],
] as const;

export function HubNav() {
  return (
    <nav aria-label="Featured destinations" className="hub-nav">
      {HUBS.map(([label, href]) => (
        <Link key={href} href={href} className="hub-nav__link">
          {label}
        </Link>
      ))}
    </nav>
  );
}
