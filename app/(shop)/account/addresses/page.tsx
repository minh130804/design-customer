'use client';

import * as React from 'react';
import { AddressPicker } from '@/components/commerce/address-picker';
import { Banner } from '@/components/shared/banner';
import { ADDRESSES } from '@/lib/account';
import { PageTitle } from '@/components/shared/page-title';

/**
 * B19 · Sổ địa chỉ.
 *
 * Dùng lại nguyên `AddressPicker` dạng A của checkout thay vì dựng một danh
 * sách riêng. Lý do không phải là tiết kiệm mã: nếu hai màn dùng hai component
 * khác nhau thì sớm muộn "địa chỉ mặc định" sẽ hiển thị khác nhau ở hai nơi, và
 * người dùng sẽ tin nơi họ nhìn thấy sau cùng.
 *
 * Client component vì việc chọn địa chỉ mặc định là tương tác tại chỗ.
 */
export default function AddressesPage() {
  const [selected, setSelected] = React.useState(ADDRESSES.find((a) => a.isDefault)?.id);

  return (
    <>
      <PageTitle className="page__title--tight">Your addresses</PageTitle>
      <p className="page__lede">
        The one you pick here is pre-selected at checkout. You can still change it on the order.
      </p>

      <Banner tone="info" className="page__notice" title="Addresses are only used for shipping">
        <p>
          Shops see the delivery address on parcels they send you, and nothing else — not your other
          addresses, not your order history with other shops.
        </p>
      </Banner>

      <AddressPicker
        mode="book"
        addresses={ADDRESSES}
        selectedId={selected}
        onSelect={setSelected}
      />
    </>
  );
}
