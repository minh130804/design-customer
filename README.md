# customers — demo trang chi tiết sản phẩm

Bản chạy được của **một** màn duy nhất: `/product/lotus-tee`. Mục đích là chứng minh
bằng mã nguồn những công nghệ đã chốt trong [stack-decision.md](../document/02-cong-nghe-frontend/stack-decision.md),
chứ không phải dựng nửa cái sàn.

```bash
npm install
npm run dev     # http://localhost:3000  → tự chuyển tới /product/lotus-tee
```

Không cần backend. Dữ liệu nằm trong [lib/products.ts](lib/products.ts), giả lập một
lượt gọi API bằng `await`.

---

## Yêu cầu đã làm

| Yêu cầu | Ở đâu |
|---|---|
| Ảnh sản phẩm | ảnh chính + dải 5 ảnh mô tả — [product-gallery.tsx](components/product/product-gallery.tsx) |
| Bấm vào ảnh thì hiện ảnh | Radix Dialog toàn màn hình, bấm ảnh chính hoặc nháy đúp ảnh nhỏ |
| Phóng to / thu nhỏ | [image-viewer.tsx](components/product/image-viewer.tsx) — 1×…6× |
| Tiếng Anh | toàn bộ chữ trên giao diện |
| Tiền `$` | `formatUsd()` trong [lib/utils.ts](lib/utils.ts) |

Khung phóng to nhận: con lăn chuột, hai nút `+ −`, thanh trượt, nháy đúp để bật/tắt,
kéo để di chuyển ảnh, chụm hai ngón trên cảm ứng, và bàn phím `+ − 0 ← →`.

Ảnh `size-chart.svg` cố ý có dòng chữ 13px: ở kích thước thường không đọc nổi, phóng
lên 3× mới rõ. Đó là lý do trang bán hàng cần phóng to — không phải để trông đẹp.

---

## Mỗi tệp minh hoạ quyết định nào

**[app/product/[slug]/page.tsx](app/product/%5Bslug%5D/page.tsx) — React Server Component.**
Không có `'use client'`. Cả trang render ở server; chỉ hai nhánh là client:
`ProductGallery` (cần trạng thái ảnh đang chọn) và `PurchasePanel` (cần biến thể và
số lượng). Mô tả sản phẩm, thông tin shop, JSON-LD đều không tốn một byte JS nào của
người dùng. Đây là lý do chọn Next.js cho customer thay vì SPA.

**JSON-LD `Product` + `Offer` + `AggregateRating`** ngay trong cùng tệp. Thiếu nó thì
Google không hiện giá và sao đánh giá trong kết quả tìm kiếm — với sàn thương mại
điện tử đó là mất lưu lượng thật.

**[app/globals.css](app/globals.css) — Tailwind v4 `@theme`.** Token ba tầng của
`design-system.md` khai báo thẳng ở đây, `--spacing: 6px` đúng cơ sở của Collage nên
`p-3` = 18px. Khối `@layer base` bên dưới là **cầu nối shadcn**: ánh xạ `--primary`,
`--destructive`, `--ring`… về token của mình đúng một lần, để component shadcn không
bao giờ nhắc tới tên riêng của nó nữa.

Một cái bẫy đã vấp: đừng đặt token màu tên `body`. Tailwind v4 sinh utility từ cả
`--color-*` lẫn `--text-*`, nên `--color-body` và `--text-body` cùng đẻ ra `text-body`.
Màu đó giờ tên là `--color-copy`.

**[lib/utils.ts](lib/utils.ts) — `cn()` = clsx + tailwind-merge.** `extendTailwindMerge`
là bắt buộc: `shadow-elev-2`, `rounded-card`, `text-body-sm` là lớp tự chế, thư viện
không biết chúng thuộc nhóm nào nên sẽ không gộp đúng khi đè lớp. Ba nhóm đã khai
trong `classGroups`.

**[components/ui/button.tsx](components/ui/button.tsx) — CVA.** Biến thể là dữ liệu,
không phải chuỗi `if`. `variant × size` sinh kiểu TypeScript, gõ sai tên biến thể là
lỗi biên dịch.

**Tiền là số nguyên cent.** `priceCents: 2500` = $25.00. Dùng float thì
`25.00 - 7.80 = 17.199999999999996` — với hệ có công nợ seller thì đó là sai sổ sách.
Chỉ chia cho 100 ở đúng một chỗ: lúc định dạng.

**[next.config.ts](next.config.ts) — `remotePatterns` chỉ mở prefix `public/`.**
Kèm ghi chú: tệp ở prefix private (raw, template, file in) không bao giờ được đi qua
`next/image`, vì Next sẽ proxy và cache lại trên đĩa server, thành ra rò tệp trả phí.

**`next/font` với `subsets: ['latin', 'vietnamese']`** trong [app/layout.tsx](app/layout.tsx).
Thiếu `'vietnamese'` thì `ế ộ ữ` rơi về font hệ thống — chữ so le ngay giữa câu.

---

## Hai điểm cần biết trước khi dùng lại

**Ảnh minh hoạ là SVG nên phải `unoptimized`.** Cách xử lý đúng *không phải* bật
`images.dangerouslyAllowSVG`. Trong hệ này seller tải lên file thiết kế SVG; cho bộ
tối ưu ảnh đụng vào SVG người dùng gửi lên là mở đường XSS. Khi thay bằng ảnh raster
thật từ CDN thì bỏ hẳn prop `unoptimized` đi.

**Khung phóng to dùng `<img>` thường, không dùng `next/image`.** `next/image` bọc thẻ
ảnh trong một `<span>` định vị và tự đặt `style` — đè `transform` lên nó sẽ chống nhau.
Ảnh trong khung phóng to cần đúng một tệp gốc độ phân giải cao, không cần `srcset`.

Toán phóng-to-tại-con-trỏ nằm ở [image-viewer.tsx](components/product/image-viewer.tsx):
đổi tỉ lệ quanh tâm khung, rồi dịch `tx/ty` sao cho điểm ảnh dưới con trỏ đứng yên.
Giới hạn kéo tính theo `img.offsetWidth * scale` — dùng kích thước bố cục chứ không
dùng `getBoundingClientRect()`, vì cái sau đã bị chính `transform` làm sai lệch.
Trình nghe `wheel` gắn bằng `addEventListener(..., { passive: false })` chứ không dùng
`onWheel` của React, vì React gắn sự kiện wheel ở chế độ passive nên
`preventDefault()` không có tác dụng — trang sẽ vẫn cuộn khi đang phóng ảnh.

---

## Kết quả `next build`

```
Route (app)                          Size    First Load JS
└ ƒ /product/[slug]               30.8 kB          133 kB
+ First Load JS shared by all                      103 kB
```

**133 kB vượt ngân sách 120 kB đã đặt cho trang này.** Chưa xử lý, vì demo còn
thiếu ba thứ sẽ kéo con số xuống: `next/font` đang tải hai họ chữ đầy đủ thay vì tập
con, `lucide-react` chưa bật `optimizePackageImports`, và Radix Dialog nên nạp động
(khung phóng to chỉ cần khi người dùng bấm vào ảnh). Riêng việc hoãn nạp Dialog đã
đủ đưa lần tải đầu về dưới mức.

## Chưa có trong demo

Giỏ hàng, đăng nhập, đánh giá, sản phẩm liên quan, thuộc tính động theo danh mục,
gọi API thật, chọn tiền tệ. Đó là các màn khác — bản này cố tình chỉ có một trang.
