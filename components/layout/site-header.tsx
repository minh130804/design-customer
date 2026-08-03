'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { Search, ShoppingBag, Heart, Tag } from 'lucide-react';
import { AccountMenu } from './account-menu';
import { IconTip } from './icon-tip';
import { NotificationMenu } from './notification-menu';
import { AmazonDrawer } from './amazon-drawer';
import { menuTree } from '@/lib/catalog';
import { NOTIFICATIONS } from '@/lib/notifications';
import { CcmLogo } from '@/components/shared/ccm-logo';
import { cn } from '@/lib/utils';

const SUBNAV_ITEMS = [
  { label: 'Deals & Offers', href: '/search?sale=1', icon: Tag },
  { label: 'Best Sellers', href: '/search' },
  { label: 'Custom Printing', href: '/search?kind=pod' },
  { label: 'Digital Downloads', href: '/search?kind=file' },
  { label: 'Sell on CCM', href: '/sell' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'Customer Support', href: '/help/buying' },
];

function SubnavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = React.useMemo(() => {
    const query = searchParams?.toString();
    return `${pathname}${query ? '?' + query : ''}`;
  }, [pathname, searchParams]);

  const checkIsActive = (href: string) => {
    if (href === '/search') {
      return pathname === '/search' && !searchParams?.get('kind') && !searchParams?.get('sale');
    }
    return currentUrl === href;
  };

  return (
    <nav className="site-header__subnav-links" aria-label="Quick Navigation">
      {SUBNAV_ITEMS.map((item) => {
        const isActive = checkIsActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={cn(
              'site-header__subnav-item transition-all duration-200',
              isActive
                ? 'text-gray-950 font-black bg-[#ECC5C6] border border-white/60 shadow-md scale-105'
                : 'text-white hover:bg-white/15 border border-transparent'
            )}
          >
            {Icon && <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-gray-950' : 'text-[#ECC5C6]')} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const tree = menuTree();
  const notifications = NOTIFICATIONS;

  return (
    <header className="site-header">
      {/* ── Tier 1: Responsive Clean Header ───────────── */}
      <div className="site-header__top">
        <div className="site-header__inner">
          {/* Authentic Brand Logo */}
          <Link href="/" className="site-header__logo outline-none">
            <CcmLogo />
          </Link>

          {/* Desktop E-Commerce Search Bar (Centered via Grid) */}
          <form action="/search" className="site-header__search hidden md:block">
            <div className="search-bar site-header__search-bar">
              <select
                name="category"
                aria-label="Select Category"
                className="search-bar__select"
                defaultValue=""
              >
                <option value="">All Departments</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="digital">Digital Assets</option>
                <option value="home">Home & Living</option>
                <option value="gifts">Custom POD Gifts</option>
              </select>

              <input
                type="search"
                name="q"
                placeholder="Search custom POD goods, vector assets, handmade items..."
                aria-label="Search"
                className="search-bar__input"
              />

              <button type="submit" aria-label="Submit Search" className="search-bar__submit">
                <Search className="site-header__search-icon" />
              </button>
            </div>
          </form>

          {/* Header Action Items */}
          <nav className="site-header__actions" aria-label="Account and Tools">
            {/* Favourites */}
            <IconTip label="Favourites">
              <Link href="/account/favourites" className="site-header__link-icon" aria-label="Favourites">
                <Heart className="site-header__icon" />
              </Link>
            </IconTip>

            {/* Notifications */}
            <NotificationMenu items={notifications} />

            {/* Account & Orders */}
            <AccountMenu />

            {/* Shopping Cart Widget */}
            <Link href="/cart" className="site-header__cart" aria-label={`Cart with ${cartCount} items`}>
              <ShoppingBag className="site-header__cart-icon" />
              <span className="site-header__cart-label">Cart</span>
              <span className="site-header__cart-count">{cartCount}</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Search Bar Row (Visible on Mobile Screens < 768px) */}
        <div className="px-3 pb-2.5 md:hidden">
          <form action="/search" className="w-full">
            <div className="search-bar w-full h-10">
              <input
                type="search"
                name="q"
                placeholder="Search custom POD goods, handmade items..."
                aria-label="Search"
                className="search-bar__input text-xs"
              />
              <button type="submit" aria-label="Submit Search" className="search-bar__submit h-10 w-10">
                <Search className="h-4 w-4 text-gray-950 font-bold" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Tier 2: Subnav Speedbar ─────────────────────── */}
      <div className="site-header__subnav">
        <div className="site-header__inner">
          <AmazonDrawer tree={tree} />

          <React.Suspense
            fallback={
              <nav className="site-header__subnav-links" aria-label="Quick Navigation">
                {SUBNAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href as Route} className="site-header__subnav-item text-gray-300">
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            }
          >
            <SubnavLinks />
          </React.Suspense>
        </div>
      </div>
    </header>
  );
}
