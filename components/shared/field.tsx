import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * A3 · Ô nhập có nhãn, gợi ý và lỗi — gói ba thứ luôn đi cùng nhau.
 *
 * `useId` để nhãn và ô nhập nối đúng `htmlFor`/`id` mà không bắt người gọi tự
 * nghĩ ra id. Form địa chỉ có 8 ô; tự đặt id tay là 8 cơ hội gõ trùng, và nhãn
 * trỏ sai ô là lỗi vô hình với người nhìn được nhưng chí mạng với đọc màn hình.
 *
 * `aria-describedby` phải trỏ tới thông báo lỗi, nếu không đọc màn hình đọc
 * xong nhãn rồi im lặng — người dùng biết ô sai nhưng không biết sai gì.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  className,
  children,
  ...props
}: React.ComponentProps<'input'> & {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  /** Thay ô nhập mặc định bằng thứ khác (select, textarea, nhóm nút…) */
  children?: React.ReactNode;
}) {
  const id = React.useId();
  const msgId = `${id}-msg`;

  return (
    <div className={cn('field', className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="field__optional">(optional)</span>}
      </Label>

      {children ? (
        <div id={id}>{children}</div>
      ) : (
        <Input id={id} invalid={!!error} aria-describedby={hint || error ? msgId : undefined} {...props} />
      )}

      {error ? (
        <p id={msgId} className="field__error">
          <AlertCircle className="field__error-icon" aria-hidden />
          {error}
        </p>
      ) : (
        hint && (
          <p id={msgId} className="field__hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
