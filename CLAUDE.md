# CLAUDE.md — customers (POD storefront)

Storefront cho người mua. Next.js App Router + Tailwind CSS v4 + shadcn/ui.
Tài liệu thiết kế nguồn nằm ở `../document/`:
[`05-nghien-cuu-doi-thu/etsy-product-page.md`](../document/05-nghien-cuu-doi-thu/etsy-product-page.md) ·
[`03-thiet-ke-ui/design-system.md`](../document/03-thiet-ke-ui/design-system.md) (§12 = quy ước BEM) ·
[`02-cong-nghe-frontend/stack-decision.md`](../document/02-cong-nghe-frontend/stack-decision.md) §2
(`frontend-stack.md` đã gộp vào đó, không còn tồn tại).

## Lệnh

```bash
npm run dev        # dev server
npm run build      # production build
npm run typecheck  # next typegen && tsc --noEmit — chạy trước khi báo hoàn thành
npm run typegen    # chỉ sinh lại type của route
```

Không có script `lint`: `next lint` đã bị gỡ ở Next 16 và dự án chưa cấu hình
ESLint. Đừng gọi `next lint`.

## Stack bắt buộc

Ba công nghệ dưới đây là ràng buộc cứng của dự án. Không thay thế, không bổ sung
thư viện cùng vai trò, không hỏi lại — nếu một yêu cầu chỉ giải được bằng cách phá
ràng buộc thì dừng và nói rõ với người dùng.

| Vai trò | Bắt buộc dùng |
|---|---|
| Framework | **Next.js 16 App Router** + React 19 + TypeScript 7 (`strict`, `noUncheckedIndexedAccess`) |
| Styling | **BEM + Tailwind v4 qua `@apply`** — xem mục dưới |
| Component | **shadcn/ui** (style `new-york`, `rsc: true`, base color `neutral`, CSS variables) |
| Icon | `lucide-react` — bộ icon duy nhất |

Cấm dùng: UI kit khác (MUI, Chakra, Ant Design, Bootstrap, Mantine…), CSS-in-JS
(styled-components, emotion), CSS Modules, SCSS, file `.css` đặt ngoài
`app/styles/`, thuộc tính `style=` để làm mỹ thuật (chỉ chấp nhận khi truyền
CSS variable động hoặc giá trị tính lúc chạy như `width: 62%`), bộ icon khác,
state manager ngoài (Redux, Zustand, Jotai) khi `useState`/URL/server state đã đủ.

Thêm dependency mới = quyết định của người dùng, không phải của agent. Hỏi trước.

### BEM — quy ước styling của dự án

**JSX chỉ mang tên class BEM.** Không rải utility Tailwind trong JSX nữa.

```tsx
<button className="btn btn--filled btn--base">      {/* ĐÚNG */}
<button className="inline-flex rounded-pill bg-btn"> {/* SAI */}
```

Kiểu dáng khai trong `app/styles/*.css`, thân class viết bằng `@apply` nên vốn từ
vẫn là Tailwind và token vẫn là `@theme`:

```css
.btn--filled { @apply bg-btn text-on-dark hover:bg-btn-hover; }
```

- Đặt tên `block__element--modifier`. Block trùng tên component (`btn`, `card`,
  `product-card`, `buy-box`).
- **Tên block không được trùng utility của Tailwind.** `.table`, `.grid`,
  `.container`, `.fixed`, `.visible`… là utility có thật; `@layer utilities` xếp
  sau `@layer components` nên utility sẽ đè mất block. Đặt `.data-table` thay vì
  `.table`.
- Mỗi tệp BEM trong `app/styles/` bọc toàn bộ trong `@layer components`, và phải
  được `@import` từ `app/globals.css`.
- **`app/globals.css` là entry CSS duy nhất** — chỉ nó `@import "tailwindcss"`,
  chỉ nó được nạp từ React (`app/layout.tsx`), và nó **không chứa quy tắc CSS
  nào**: theo chuẩn CSS mọi `@import` phải nằm trên mọi quy tắc, nên thêm một
  dòng CSS vào đó là chặn mất khả năng `@import` thêm tệp sau này. Thêm tệp mới =
  thêm một dòng `@import` ở đây.
- Tệp con **không** tự `@import "tailwindcss"`: mỗi lần import là một entry riêng
  sinh lại toàn bộ preflight, tức một bản sao framework trong bundle.
- Tệp con cũng **không cần `@reference`**. Tài liệu v4 nói "có thể cần", nhưng
  điều đó chỉ đúng khi tệp được biên dịch RIÊNG (CSS Modules, hay `.css` đặt cạnh
  component do bundler nạp riêng). Đi vào qua `@import` của entry thì chúng ở
  cùng một lượt biên dịch và đã thấy `@theme`. Đây cũng là lý do **không** đặt
  tệp `.css` cạnh component.
- `@apply` **chỉ nhận utility của Tailwind, không nhận class BEM khác**. Cần dùng
  chung thì gom vào danh sách bộ chọn (`.a, .b { @apply … }`) hoặc đặt hai class
  trong JSX (`className="field-base input"`), đừng viết `@apply skeleton`.
- Chỗ nào Tailwind diễn đạt vụng (`::after`, `clip-path`, keyframes, bộ chọn con)
  thì viết CSS thật ngay trong block đó — trộn chung được.
- `className` truyền từ chỗ gọi **chỉ dùng cho bố cục ngoài component** (`mt-3`,
  `shrink-0`, `lg:w-[240px]`). Muốn đổi diện mạo thì thêm modifier.

### Tailwind v4

- Cấu hình **CSS-first**: mọi token khai trong `@theme` ở `app/globals.css`.
  **Không tạo `tailwind.config.js/ts`** — v4 không cần và dự án cố tình không có.
- Giá trị mỹ thuật phải là token (`text-ink`, `text-price`, `shadow-elev-2`,
  `rounded-card`). Không hard-code hex, hạn chế tối đa arbitrary value
  (`text-[13px]`, `bg-[#222]`) — nếu cần một giá trị mới, thêm token vào `@theme`.
- Điểm ngắt theo thang Etsy, KHÔNG phải mặc định Tailwind: `sm` 480 · `md` 640 ·
  `lg` 900 · `xl` 1200, trần trang 1400 (`max-w-page`). Không có `2xl`.
  Bằng chứng ở [`../document/03-thiet-ke-ui/responsive-rules.md`](../document/03-thiet-ke-ui/responsive-rules.md).
- Token có kèm chú thích nguồn gốc (mã Etsy, tỉ lệ tương phản). Sửa token thì cập
  nhật luôn chú thích, đừng để chú thích nói dối.
- Gộp class **luôn qua `cn()`** trong `lib/utils.ts` — nó vẫn cần cho việc nối
  class theo điều kiện. Nhưng **`tailwind-merge` không xử lý được class BEM**:
  hai class BEM cùng đặt `padding` thì thứ tự trong CSS quyết định, không phải
  thứ tự truyền vào. Đừng dựa vào "class người gọi luôn thắng" nữa.

### shadcn/ui

- Thêm component bằng `npx shadcn@latest add <name>` → rơi vào `components/ui/`.
  **Không tự viết tay** primitive mà shadcn đã có.
- `components/ui/` là code sở hữu, được phép sửa; sửa thì chú thích lý do lệch
  khỏi bản gốc (xem `button.tsx`). Không import trực tiếp `@radix-ui/*` trong
  `components/product/` — bọc qua một component trong `components/ui/`.
- Biến thể khai bằng `cva`, không phải chuỗi ternary trong JSX. `cva` giờ ánh xạ
  props → **tên class BEM**, không phải → chuỗi utility (xem `button.tsx`). Vẫn
  giữ được kiểu TypeScript sinh từ chính bản đồ biến thể.
- Component thêm bằng `npx shadcn@latest add` sẽ mang utility Tailwind trong JSX
  — phải chuyển sang BEM ngay khi thêm, đừng để lẫn hai lối.

## Kiến trúc

```
app/                  route, layout, page — Server Component mặc định
app/globals.css       ENTRY CSS DUY NHẤT — chỉ chứa @import, không quy tắc nào
app/styles/theme.css  @theme: token + điểm ngắt + keyframes
app/styles/base.css   cầu nối shadcn, reset, @utility tự định nghĩa
app/styles/*.css      khối BEM, một tệp cho mỗi nhóm component
components/ui/        primitive shadcn (chung, không biết gì về domain)
components/shared/    mảnh tái dùng nhiều nơi (money, banner, field, stepper…)
components/layout/    header, footer, breadcrumbs
components/commerce/  giỏ hàng, thẻ sản phẩm, lưới, bộ lọc
components/product/   trang chi tiết sản phẩm
lib/                  dữ liệu + helper thuần
```

- **Server Component là mặc định.** `'use client'` chỉ đặt ở lá thật sự cần
  state/effect/handler, không đẩy lên `page.tsx` hay `layout.tsx`.
- `components/{shared,layout,commerce,product}/*` được phép biết về domain;
  `components/ui/*` thì không.
- **`typedRoutes: true`** — `href` phải trỏ tới route CÓ THẬT trong `app/`.
  Link tới trang chưa tồn tại là lỗi biên dịch, không phải 404 lúc chạy: tạo
  `app/<route>/page.tsx` trước rồi mới link. Không chữa bằng `as never`/`as any`
  hay tắt `typedRoutes`.
- Alias `@/` cho mọi import nội bộ, không dùng `../../`.
- Tiền = số nguyên cent. Không float, không format sẵn ở backend.
- Ngày/giờ hiển thị phải tính từ mốc do server truyền vào, không `Date.now()` ở
  client (trang ISR sẽ đóng băng ngày sai vào HTML).
- Có chữ tiếng Việt thì font phải khai `subsets: ['vietnamese']`.

## Clean code

- Tên nói đúng việc nó làm. Hàm ngắn, một nhiệm vụ. Early return thay vì lồng sâu.
- Component nhận props tường minh; không truyền một object `data` mơ hồ rồi bới trong.
- Không `any`, không `@ts-ignore`, không `!` để bịt lỗi type — sửa type cho đúng.
- Không dead code, không code bị comment lại, không `console.log` sót.
- Chú thích giải thích **tại sao**, không mô tả lại code. Quy ước hiện tại: chú
  thích viết tiếng Việt, có dẫn nguồn khi lấy số từ `document/`. Giữ nguyên quy ước này.
- Không đổi format/sắp xếp lại file ngoài phạm vi việc đang làm.

## Không over-engineering

- Làm **đúng yêu cầu hiện tại**. Không thêm option, prop, hook, hay lớp cấu hình
  cho tình huống chưa ai yêu cầu.
- Trùng lặp 2 lần thì cứ để trùng; trừu tượng hoá từ lần thứ 3, khi đã thấy rõ trục biến thiên.
- Không factory/provider/registry/generic khi một hàm hoặc một props là đủ.
- Không barrel file `index.ts` chỉ để re-export.
- Không tự thêm state manager, data-fetching layer, hay abstraction "cho dễ mở rộng sau này".
- `useMemo`/`useCallback` chỉ khi đo được vấn đề, không rải mặc định.
- Không viết test/tooling/CI khi không được yêu cầu.

## Bẫy phiên bản đã biết

- `next.config.ts` bật `experimental.useTypeScriptCli`. TypeScript 7 là bản viết
  lại bằng Go, không còn compiler API cũ mà `next build` gọi. Gỡ cờ này thì build
  chết ngay ở bước "Running TypeScript". Đừng gỡ.
- `tsconfig.json` phải giữ `"jsx": "react-jsx"` và `.next/dev/types/**/*.ts`
  trong `include` — Next 16 bắt buộc, tự ghi đè lại nếu sửa.

## Trước khi báo xong

1. `npm run typecheck` sạch.
2. **Không còn utility Tailwind trong JSX** ngoài lớp bố cục (`mt-*`, `grid`,
   `flex`, `shrink-0`, biến thể responsive). Diện mạo phải nằm trong class BEM.
3. Tên block mới không trùng utility Tailwind.
4. `'use client'` vẫn ở đúng tầng lá.
5. Mọi `href` mới đều có route thật trong `app/`.
6. Không phát sinh dependency mới ngoài stack ở trên.
