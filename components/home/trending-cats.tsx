'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';
import {
  Shirt,
  Home,
  Zap,
  Gem,
  FileText,
  Gift,
  Palette,
  Watch,
  Brush,
  Baby,
  Sparkles,
  PawPrint,
  Gamepad2,
  Scissors,
  ShoppingBag,
} from 'lucide-react';
import type { MenuNode } from '@/lib/catalog';

type CatBubbleConfig = {
  slug: string;
  label: string;
  icon: typeof Shirt;
  gradient: string;
};

/**
 * Ánh xạ icon + gradient cho từng danh mục gốc trong CATEGORY_TREE.
 * Nếu một slug không có trong map, sẽ dùng icon mặc định.
 */
const CAT_CONFIG: Record<string, Omit<CatBubbleConfig, 'slug' | 'label'>> = {
  clothing:    { icon: Shirt,       gradient: 'from-rose-400 to-pink-600' },
  home:        { icon: Home,        gradient: 'from-amber-400 to-orange-600' },
  digital:     { icon: Zap,         gradient: 'from-violet-400 to-indigo-600' },
  jewelry:     { icon: Gem,         gradient: 'from-emerald-400 to-teal-600' },
  paper:       { icon: FileText,    gradient: 'from-sky-400 to-cyan-600' },
  weddings:    { icon: Gift,        gradient: 'from-pink-400 to-rose-600' },
  bags:        { icon: ShoppingBag, gradient: 'from-orange-400 to-red-600' },
  art:         { icon: Palette,     gradient: 'from-fuchsia-400 to-purple-600' },
  accessories: { icon: Watch,       gradient: 'from-slate-400 to-gray-600' },
  kids:        { icon: Baby,        gradient: 'from-cyan-400 to-blue-600' },
  beauty:      { icon: Sparkles,    gradient: 'from-pink-300 to-fuchsia-500' },
  pets:        { icon: PawPrint,    gradient: 'from-amber-300 to-yellow-600' },
  games:       { icon: Gamepad2,    gradient: 'from-indigo-400 to-violet-600' },
  crafts:      { icon: Scissors,    gradient: 'from-teal-400 to-emerald-600' },
  brushes:     { icon: Brush,       gradient: 'from-purple-400 to-pink-600' },
};

const DEFAULT_CONFIG: Omit<CatBubbleConfig, 'slug' | 'label'> = {
  icon: Sparkles,
  gradient: 'from-gray-400 to-gray-600',
};

type TrendingCatsProps = {
  /** Cây danh mục từ menuTree() — truyền từ server component */
  tree: MenuNode[];
};

/**
 * Dải danh mục trending — click/hover hiện subcategories dropdown,
 * click subcategory điều hướng tới trang danh sách sản phẩm.
 */
export function TrendingCats({ tree }: TrendingCatsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Đóng dropdown khi click ra ngoài */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveSlug(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (slug: string) => {
    setActiveSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <section className="trending-cats" ref={containerRef}>
      <h2 className="trending-cats__title">🔥 Trending Categories</h2>

      <div className="trending-cats__track">
        {tree.map((cat, i) => {
          const config = CAT_CONFIG[cat.slug] ?? DEFAULT_CONFIG;
          const Icon = config.icon;
          const isActive = activeSlug === cat.slug;
          const hasChildren = cat.children.length > 0;

          return (
            <div
              key={cat.slug}
              className="trending-cats__item"
              onMouseEnter={() => hasChildren && setActiveSlug(cat.slug)}
              onMouseLeave={() => setActiveSlug(null)}
            >
              <button
                type="button"
                onClick={() => hasChildren ? handleToggle(cat.slug) : undefined}
                className={`trending-cats__bubble ${isActive ? 'trending-cats__bubble--active' : ''}`}
                style={{ animationDelay: `${i * 80}ms` }}
                aria-expanded={isActive}
              >
                <span className={`trending-cats__icon-ring bg-gradient-to-br ${config.gradient}`}>
                  <Icon className="trending-cats__icon" />
                </span>
                <span className="trending-cats__label">{cat.label.split(' ')[0]}</span>
              </button>

              {/* Subcategory Dropdown */}
              {isActive && hasChildren && (
                <div className="trending-cats__dropdown">
                  <div className="trending-cats__dropdown-header">
                    <Link href={cat.href as Route} className="trending-cats__dropdown-title">
                      {cat.label}
                      <ChevronRight className="trending-cats__dropdown-chevron" />
                    </Link>
                  </div>
                  <ul className="trending-cats__dropdown-list">
                    {cat.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={child.href as Route}
                          className="trending-cats__dropdown-link"
                          onClick={() => setActiveSlug(null)}
                        >
                          <span className="trending-cats__dropdown-dot" />
                          <span>{child.label}</span>
                          <ChevronRight className="trending-cats__dropdown-arrow" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cat.href as Route}
                    className="trending-cats__dropdown-footer"
                    onClick={() => setActiveSlug(null)}
                  >
                    View all {cat.label.split(' ')[0]}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
