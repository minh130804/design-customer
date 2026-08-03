'use client';

import { useState } from 'react';
import type { Route } from 'next';
import { Shelf } from '@/components/home/shelf';
import { ShelfCard } from '@/components/home/shelf-card';
import { QuickViewModal } from '@/components/commerce/quick-view-modal';
import { LiveActivityToast } from '@/components/shared/live-activity-toast';
import { CreatorSpotlight } from '@/components/home/creator-spotlight';
import type { Listing, Shop } from '@/lib/catalog';

type HomeShelvesClientProps = {
  featured: Listing[];
  pod: Listing[];
  files: Listing[];
  stock: Listing[];
  clothing: Listing[];
  home: Listing[];
  jewelry: Listing[];
  paper: Listing[];
  shops: Shop[];
};

export function HomeShelvesClient({
  featured,
  pod,
  files,
  stock,
  clothing,
  home,
  jewelry,
  paper,
  shops,
}: HomeShelvesClientProps) {
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  const handleQuickView = (listing: Listing) => {
    setQuickViewListing(listing);
  };

  return (
    <>
      {/* Quick View Modal */}
      <QuickViewModal
        listing={quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />

      {/* Realtime Social Proof Notification Toast */}
      <LiveActivityToast />

      {/* ── Group 1: Best Sellers & Trending Drops ─────────────────────── */}
      <Shelf title="🌟 Top Sellers & Trending Drops Across Platform" href="/search">
        {featured.slice(0, 12).map((l, i) => (
          <ShelfCard
            key={l.slug}
            listing={l}
            priority={i < 4}
            onQuickView={handleQuickView}
          />
        ))}
      </Shelf>

      {/* ── Group 2: Clothing, T-Shirts & Custom Apparel ─────────── */}
      <Shelf title="👕 Clothing, T-Shirts & Custom Print Apparel" href={'/c/clothing' as Route}>
        {(clothing.length ? clothing : pod).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* ── Group 3: Home & Living Decor, Mugs & Wall Art ────────── */}
      <Shelf title="🏡 Home & Living Decor, Mugs & Wall Art" href={'/c/home' as Route}>
        {(home.length ? home : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* Creator Showcase */}
      <CreatorSpotlight shops={shops} />

      {/* ── Group 4: Print-On-Demand & Personalized Gifts ────────── */}
      <Shelf title="⚡ Print-On-Demand & Personalized Custom Gifts" href={'/search?kind=pod' as Route}>
        {pod.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* ── Group 5: Instant Digital Assets & Vector Downloads ────── */}
      <Shelf title="💎 Instant Digital Assets (3D Assets, UI Kits & Vectors)" href={'/search?kind=file' as Route}>
        {files.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* ── Group 6: Fine Jewelry & Handmade Accessories ────────────── */}
      <Shelf title="🎁 Fine Jewelry & Handmade Accessories" href={'/c/jewelry' as Route}>
        {(jewelry.length ? jewelry : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* ── Group 7: Paper, Party & Stationery Supplies ────────── */}
      <Shelf title="📜 Paper, Party Cards & Craft Supplies" href={'/c/paper' as Route}>
        {(paper.length ? paper : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>

      {/* ── Group 8: Ready to Ship (Express Delivery) ──────────── */}
      <Shelf title="🛡️ Ready to Ship Items (2-4 Days Express Delivery)" href={'/search?kind=stock' as Route}>
        {stock.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} onQuickView={handleQuickView} />
        ))}
      </Shelf>
    </>
  );
}
