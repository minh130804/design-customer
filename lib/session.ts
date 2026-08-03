import { cookies } from 'next/headers';

/**
 * Phiên đăng nhập.
 *
 * Ở bản thật, `backend-api` xác thực rồi Next đặt cookie `httpOnly` qua
 * `/api/session` — đúng ba việc mà Route Handler được phép làm, xem
 * stack-decision.md §1.2. Cookie `httpOnly` nghĩa là JavaScript của trang
 * KHÔNG đọc được nó; mọi câu hỏi "đã đăng nhập chưa" phải trả lời ở server.
 *
 * ── Gọi hàm này ở đâu, và ở đâu thì KHÔNG ───────────────────────────────
 *
 * Chạm vào `cookies()` làm route đó thành render động. Vì vậy:
 *
 *   ✅ checkout, trang tài khoản, Route Handler — vốn đã phải động, và ở đó
 *      trạng thái đăng nhập sai một khoảnh khắc là không chấp nhận được
 *   ❌ header, layout dùng chung — một lời gọi ở đó kéo TOÀN BỘ trang sản phẩm
 *      và trang danh mục khỏi prerender. Header hỏi qua `GET /api/session`
 *      thay thế; xem components/layout/account-menu.tsx
 *
 * Ở demo, tên và địa chỉ là dữ liệu cố định. Ở bản thật chúng đến từ
 * `GET /v1/me` với cùng cookie đó.
 */
export type Session = { signedIn: boolean; name: string; email: string };

const ANONYMOUS: Session = { signedIn: false, name: '', email: '' };

export const SESSION_COOKIE = 'pod_session';

export async function getSession(): Promise<Session> {
  const email = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!email) return ANONYMOUS;
  return { signedIn: true, name: 'Dana Reed', email };
}
