import { NextResponse } from 'next/server';
import { getSession, SESSION_COOKIE } from '@/lib/session';

/**
 * `GET` trả về tên người đang đăng nhập, để header hỏi được trạng thái phiên
 * mà KHÔNG kéo cả trang sang render động.
 *
 * Đây là đánh đổi có chủ ý. Cookie phiên là `httpOnly`, nên cách duy nhất để
 * Server Component biết trạng thái là gọi `cookies()` — mà chạm vào `cookies()`
 * ở header, tức là ở layout dùng chung, làm **mọi trang bên dưới thành động**.
 * Với sàn POD thì 18 trang sản phẩm và toàn bộ trang danh mục mất khả năng
 * prerender là cái giá quá đắt để đổi lấy một cái tên ở góc màn hình.
 *
 * Cái mất: người ĐÃ đăng nhập thấy nút "Sign in" trong khoảnh khắc đầu rồi nó
 * đổi thành tên mình. Người CHƯA đăng nhập — tức phần lớn lượt truy cập, và là
 * tất cả những gì Google thấy — không thấy nhấp nháy gì cả.
 *
 * Checkout và trang tài khoản vẫn đọc cookie thẳng ở server: chúng vốn đã phải
 * động, và ở đó thì không được phép nhấp nháy.
 */
export async function GET() {
  const session = await getSession();
  return NextResponse.json({ name: session.name });
}

/**
 * Đặt và xoá cookie phiên — một trong ĐÚNG BA việc Route Handler được làm ở
 * repo này (stack-decision.md §1.2). Ngoài ba đường đó, trình duyệt gọi thẳng
 * Spring; mỗi lớp proxy thêm là một chỗ nữa để timeout và để lệch kiểu dữ liệu.
 *
 * Ở bản thật, `POST` chuyển thông tin đăng nhập sang `backend-api`, nhận token
 * rồi mới đặt cookie. Ở demo nó nhận thẳng email.
 *
 * `httpOnly` là điều kiện tiên quyết: cookie mà JavaScript đọc được thì một lỗ
 * XSS bất kỳ trên trang cũng lấy được phiên của người dùng.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim() || 'dana@example.com';

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
