'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tab — gạch chân màu chữ, không phải viên thuốc màu.
 *
 * Ở trang tài khoản, tab là ĐIỀU HƯỚNG chứ không phải bộ lọc. Etsy phân biệt
 * hai thứ này rất rõ: gạch chân cho điều hướng, viên thuốc cho lọc. Dùng lẫn
 * thì người dùng không đoán được bấm vào có mất dữ liệu đang gõ hay không.
 */
export function Tabs<T extends string>({
  value,
  onValueChange,
  items,
  label,
  className,
}: {
  value: T;
  onValueChange: (v: T) => void;
  items: { value: T; label: React.ReactNode; count?: number }[];
  label: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('tabs', className)}
    >
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            type="button"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onValueChange(it.value)}
            className={cn('tabs__tab', on && 'tabs__tab--on')}
          >
            {it.label}
            {it.count !== undefined && <span className="tabs__count">({it.count})</span>}
          </button>
        );
      })}
    </div>
  );
}
