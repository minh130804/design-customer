/**
 * Thẻ quà tặng.
 *
 * ── Vì sao thẻ quà tặng là một LOẠI HÀNG riêng, không phải một sản phẩm ───
 *
 * Nó không có biến thể, không có phí giao, không có thời gian in, không đổi trả
 * được, và nó **không thuộc shop nào** — sàn phát hành, không phải người bán.
 * Nhét nó vào `LISTINGS` là làm mọi hàm lọc và mọi thẻ sản phẩm phải mang thêm
 * một ngoại lệ, để đổi lấy việc dùng lại một cái lưới.
 *
 * ── Vì sao mệnh giá cố định, không cho nhập tự do ────────────────────────
 *
 * Số tròn giúp người tặng khỏi phải quyết định thêm một việc, và nó chặn luôn
 * hai kiểu lạm dụng: rửa tiền qua mệnh giá lớn, và dò số dư bằng mệnh giá lẻ.
 * Etsy cũng làm vậy.
 *
 * ── Vì sao mã có tiền tố và độ dài cố định ───────────────────────────────
 *
 * `POD-XXXX-XXXX-XXXX`: người nhập biết mình gõ đúng loại mã hay chưa TRƯỚC khi
 * bấm, và tổng đài đọc mã qua điện thoại được. Không dùng chữ O/0 và I/1 trong
 * bộ ký tự vì đọc miệng là sai ngay.
 */
export const GIFT_AMOUNTS_CENTS = [2500, 5000, 7500, 10000, 15000, 20000] as const;

export type GiftDelivery = 'email' | 'print';

/**
 * Kiểm tra dạng mã ở client — CHỈ để báo lỗi gõ sai sớm.
 *
 * Số dư thật do backend trả. Không bao giờ đoán số dư ở client, và cũng không
 * báo "mã không tồn tại" từ client: phân biệt được "sai dạng" với "không tồn
 * tại" là đưa cho người ta một công cụ dò mã.
 */
const CODE_SHAPE = /^POD-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

export function isGiftCodeShape(raw: string) {
  return CODE_SHAPE.test(raw.trim().toUpperCase());
}

/** Mã demo có số dư, để thử luồng nhập ở bước thanh toán. */
export const DEMO_CODES: Record<string, number> = {
  'POD-4KMR-9TXB-2PWQ': 5000,
  'POD-7HDN-3VCJ-8LFA': 2500,
};

export type GiftRedemption =
  | { ok: true; balanceCents: number }
  | { ok: false; reason: 'shape' | 'unknown' };

/**
 * Ở bản thật: `POST /v1/gift-cards/redeem`. Backend là nơi duy nhất biết số dư.
 */
export async function redeemGiftCode(raw: string): Promise<GiftRedemption> {
  const code = raw.trim().toUpperCase();
  if (!isGiftCodeShape(code)) return { ok: false, reason: 'shape' };
  const balance = DEMO_CODES[code];
  if (balance === undefined) return { ok: false, reason: 'unknown' };
  return { ok: true, balanceCents: balance };
}
