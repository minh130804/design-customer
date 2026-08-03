'use client';

import { usePathname } from 'next/navigation';
import { Stepper, type Step } from '@/components/shared/stepper';

/**
 * Ba bước checkout.
 *
 * Bước "Sign in" đã bị bỏ. Nó từng là một màn hỏi "bạn muốn thanh toán kiểu
 * nào?", và đó là một câu hỏi mà **hệ thống đã biết câu trả lời**: cookie phiên
 * nói rõ người này đã đăng nhập hay chưa. Bắt người dùng trả lời một câu hỏi
 * mình tự trả lời được là thêm một màn giữa giỏ hàng và thanh toán — chỗ đắt
 * nhất để thêm bất cứ thứ gì.
 *
 * Khách vãng lai vẫn đi thẳng vào form nhập tay; người đã đăng nhập vẫn thấy sổ
 * địa chỉ. Khác biệt duy nhất là không ai phải bấm để nói điều đó nữa.
 *
 * Bước hiện tại suy ra từ ĐƯỜNG DẪN, không từ một biến trạng thái nào cả. Nhờ
 * vậy tải lại trang giữa chừng không mất bước, và nút Back của trình duyệt lùi
 * đúng một bước — hai thứ mà một wizard giữ trạng thái trong bộ nhớ luôn làm hỏng.
 */
const STEPS: Step[] = [
  { id: 'delivery', label: 'Delivery', href: '/checkout/delivery' },
  { id: 'payment', label: 'Payment', href: '/checkout/payment' },
  { id: 'review', label: 'Review', href: '/checkout/review' },
];

export function CheckoutSteps() {
  const path = usePathname();
  const current = Math.max(
    0,
    STEPS.findIndex((s) => path.startsWith(s.href!)),
  );
  return <Stepper steps={STEPS} current={current} />;
}
