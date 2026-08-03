'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import type { CategoryTile } from '@/lib/catalog';

/**
 * Dải thẻ danh mục con ở đầu trang danh mục.
 *
 * Đây là thứ thay cho cây danh mục trong rail đã bỏ: người vào một nhánh rộng
 * cần đi xuống hẹp hơn TRƯỚC khi cần lọc theo màu hay chất liệu. Đặt nó trên
 * cùng, trước cả thanh công cụ, vì đi đúng nhánh loại bỏ nhiều kết quả sai hơn
 * bất kỳ bộ lọc nào.
 *
 * Hiện sáu thẻ rồi mới "Show more (N)". Một dải cuộn ngang trông gọn hơn nhưng
 * thẻ thứ bảy trở đi gần như không ai thấy — nội dung bị cắt ở mép phải không
 * phát tín hiệu gì rằng còn nữa, trong khi một cái nút thì có.
 */
export function CategoryTiles({ tiles }: { tiles: CategoryTile[] }) {
  const [expanded, setExpanded] = React.useState(false);
  const LIMIT = 6;
  const hidden = tiles.length - LIMIT;

  if (!tiles.length) return null;

  return (
    <div>
      <ul className="category-tiles__list">
        {(expanded ? tiles : tiles.slice(0, LIMIT)).map((tile) => (
          <li key={tile.href} className="category-tiles__item">
            <Link href={tile.href as Route} className="category-tiles__card">
              <div className="category-tiles__media">
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="124px"
                  className="category-tiles__image"
                />
              </div>
              <p className="category-tiles__caption">{tile.label}</p>
            </Link>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <div className="category-tiles__more">
          <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Show less' : `Show more (${hidden})`}
          </Button>
        </div>
      )}
    </div>
  );
}
