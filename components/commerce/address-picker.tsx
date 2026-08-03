'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { RadioCard } from '@/components/ui/radio-card';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/components/shared/field';
import { Banner } from '@/components/shared/banner';
import { NativeSelect } from '@/components/ui/native-select';
import { formatAddress, type Address } from '@/lib/account';

/**
 * A8 · Bộ chọn địa chỉ — BA DẠNG cho ba nhánh ở bước 4 của customers-flow.md.
 *
 * Thứ tự câu hỏi quyết định mọi thứ:
 *
 *   Giỏ có dòng hàng vật lý nào không?
 *      ├── KHÔNG ──→ dạng C: chỉ hỏi tên + email (nhập hai lần)
 *      └── CÓ ────→ đã đăng nhập?
 *                     ├── rồi  ──→ dạng A: sổ địa chỉ
 *                     └── chưa ──→ dạng B: nhập tay
 *
 * **Hỏi về nội dung giỏ TRƯỚC, hỏi trạng thái đăng nhập SAU.** Câu hỏi thứ
 * nhất rẻ hơn và có thể loại bỏ hoàn toàn cả bước địa chỉ lẫn bước chọn vận
 * chuyển. Hỏi ngược lại thì ta bắt người mua một file PNG điền địa chỉ nhà.
 */
export type DeliveryMode = 'book' | 'manual' | 'digital-only';

export function AddressPicker({
  mode,
  addresses,
  selectedId,
  onSelect,
}: {
  mode: DeliveryMode;
  addresses: Address[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  if (mode === 'digital-only') return <DigitalOnlyForm />;
  if (mode === 'manual') return <ManualForm />;
  return <AddressBook addresses={addresses} selectedId={selectedId} onSelect={onSelect} />;
}

/* ── Dạng A · đã đăng nhập ────────────────────────────────── */

function AddressBook({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const [local, setLocal] = React.useState(
    selectedId ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id,
  );
  const pick = (id: string) => {
    setLocal(id);
    onSelect?.(id);
  };

  return (
    <div className="address-picker">
      {addresses.map((a) => (
        <RadioCard
          key={a.id}
          name="address"
          value={a.id}
          checked={local === a.id}
          onChange={() => pick(a.id)}
          label={
            <span className="address-picker__label">
              {a.name}
              <span className="address-picker__phone">{a.phone}</span>
              {a.isDefault && <Badge tone="trust">Default</Badge>}
              <Badge>{a.label}</Badge>
            </span>
          }
          description={formatAddress(a)}
        />
      ))}

      <button type="button" className="address-picker__add">
        <Plus className="address-picker__add-icon" />
        Add a new address
      </button>
    </div>
  );
}

/* ── Dạng B · khách vãng lai ──────────────────────────────── */

/**
 * Không gợi ý, không tự điền, không lưu lại. Đây là **khác biệt giá trị có chủ
 * đích** giữa hai nhánh, và là động lực tự nhiên để tạo tài khoản — chứ không
 * phải một bức tường bắt đăng ký trước khi được mua.
 */
function ManualForm() {
  return (
    <div>
      <div className="address-form__grid">
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required
          hint="Only used by the carrier if delivery fails." />
        <Field className="address-form__wide" label="Address line 1" name="line1" autoComplete="address-line1" required />
        <Field className="address-form__wide" label="Address line 2" name="line2" autoComplete="address-line2" optional />
        <Field label="City" name="city" autoComplete="address-level2" required />
        <Field label="State / region" name="region" autoComplete="address-level1" required />
        <Field label="Postcode" name="postcode" autoComplete="postal-code" required />
        <Field label="Country" required>
          <NativeSelect name="country" autoComplete="country-name" defaultValue="United States">
            {['United States', 'Canada', 'United Kingdom', 'Australia', 'Viet Nam'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Banner tone="info" className="address-form__notice" title="Want this saved for next time?">
        <p>
          Create an account after you pay — the email and address you just typed carry over, and
          your download library never expires.
        </p>
      </Banner>
    </div>
  );
}

/* ── Dạng C · giỏ toàn hàng số ────────────────────────────── */

/**
 * **Bắt nhập email hai lần CHỈ ở dạng C.**
 *
 * Với đơn vật lý, gõ sai email vẫn còn gọi điện được và kiện hàng vẫn tới nơi.
 * Với hàng số, email *chính là* kênh giao hàng — gõ sai là mất hàng, và tiếp
 * theo là một vụ tranh chấp thanh toán mà cả hai bên đều đúng.
 *
 * Đối chiếu ngay khi gõ, không đợi tới lúc bấm gửi: người dùng đang nhìn vào
 * ô thứ hai là lúc rẻ nhất để sửa.
 */
function DigitalOnlyForm() {
  const [email, setEmail] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const mismatch = confirm.length > 0 && email !== confirm;

  return (
    <div>
      <Banner tone="info" className="address-form__notice--lead" title="No delivery address needed">
        <p>Your order is design files only. We send the download links to the email below.</p>
      </Banner>

      <Field label="Full name" name="name" autoComplete="name" required />
      <Field
        label="Email for delivery"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Confirm email"
        name="email2"
        type="email"
        autoComplete="off"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={mismatch ? 'The two emails do not match — check for a typo.' : undefined}
        hint={!mismatch && confirm ? 'Emails match.' : undefined}
      />

      <Banner tone="warning" title="Type it carefully">
        <p>
          Download links go to this address and nowhere else. A wrong letter here means the files
          never arrive, and we cannot recover them from our side.
        </p>
      </Banner>
    </div>
  );
}
