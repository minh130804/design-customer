import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Listing } from '@/lib/catalog';
import { Money } from '@/components/shared/money';
import { Flame, Sparkles, ArrowRight, Zap, ShoppingBag, Clock } from 'lucide-react';

interface AmazonHeroGridProps {
  featured: Listing[];
  podListings: Listing[];
  fileListings: Listing[];
}

export function AmazonHeroGrid({ featured, podListings, fileListings }: AmazonHeroGridProps) {
  const dealItem = featured[0] || podListings[0];
  const apparelItems = podListings.slice(0, 4);
  const homeItems = featured.slice(1, 5);
  const fileItems = fileListings.slice(0, 4);

  return (
    /* ── Amazon Overlapping 4-Square Department Showcase Cards Grid ──────────────── */
    <div className="amazon-hero-grid my-4">
      {/* Card 1: Today's Lightning Deal */}
      <div className="amazon-card border border-gray-200/90 shadow-xl bg-white">
        <div className="amazon-card__head">
          <Flame className="amazon-card__head-icon text-rose-600 animate-bounce" />
          <h2 className="amazon-card__title">TODAY'S LIGHTNING DEAL</h2>
        </div>

        {dealItem && (
          <div className="amazon-card__deal">
            <div className="amazon-card__deal-media">
              <Image
                src={dealItem.image}
                alt={dealItem.title}
                fill
                unoptimized
                className="amazon-card__deal-image"
              />
              <span className="amazon-card__badge-deal">🔥 50% OFF</span>
            </div>
            <div className="amazon-card__deal-info">
              <div className="amazon-card__deal-price">
                <Money cents={Math.round(dealItem.priceCents * 0.5)} className="amazon-card__price-sale" />
                <Money cents={dealItem.priceCents} className="amazon-card__price-orig" />
              </div>
              <p className="amazon-card__deal-name">{dealItem.title}</p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>Ends in 03:45:12</span>
              </div>
            </div>
          </div>
        )}

        <Link href={'/search?kind=pod' as Route} className="amazon-card__link">
          <span>CLAIM DEAL NOW</span>
          <ArrowRight className="amazon-card__link-icon" />
        </Link>
      </div>

      {/* Card 2: Custom Apparel & Streetwear (4 Quad Photos) */}
      <div className="amazon-card border border-gray-200/90 shadow-xl bg-white">
        <div className="amazon-card__head">
          <ShoppingBag className="amazon-card__head-icon text-[#8A9DB1]" />
          <h2 className="amazon-card__title">CUSTOM APPAREL</h2>
        </div>

        <div className="amazon-card__quad">
          {apparelItems.map((item) => (
            <Link key={item.slug} href={`/product/${item.slug}` as Route} className="amazon-card__quad-item">
              <div className="amazon-card__quad-media">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="amazon-card__quad-image"
                />
              </div>
              <span className="amazon-card__quad-label">{item.title.split(' ')[0]}</span>
            </Link>
          ))}
        </div>

        <Link href={'/c/clothing' as Route} className="amazon-card__link">
          <span>SHOP ALL APPAREL</span>
          <ArrowRight className="amazon-card__link-icon" />
        </Link>
      </div>

      {/* Card 3: Handcrafted Home & Decor (4 Quad Photos) */}
      <div className="amazon-card border border-gray-200/90 shadow-xl bg-white">
        <div className="amazon-card__head">
          <Sparkles className="amazon-card__head-icon text-[#837D68]" />
          <h2 className="amazon-card__title">HOME & DECOR</h2>
        </div>

        <div className="amazon-card__quad">
          {homeItems.map((item) => (
            <Link key={item.slug} href={`/product/${item.slug}` as Route} className="amazon-card__quad-item">
              <div className="amazon-card__quad-media">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="amazon-card__quad-image"
                />
              </div>
              <span className="amazon-card__quad-label">{item.title.split(' ')[0]}</span>
            </Link>
          ))}
        </div>

        <Link href={'/c/home' as Route} className="amazon-card__link">
          <span>DISCOVER DECOR</span>
          <ArrowRight className="amazon-card__link-icon" />
        </Link>
      </div>

      {/* Card 4: Instant Digital Assets & Vector Downloads (4 Quad Photos) */}
      <div className="amazon-card border border-gray-200/90 shadow-xl bg-white">
        <div className="amazon-card__head">
          <Zap className="amazon-card__head-icon text-[#8A9DB1]" />
          <h2 className="amazon-card__title">DIGITAL ASSETS</h2>
        </div>

        <div className="amazon-card__quad">
          {fileItems.map((item) => (
            <Link key={item.slug} href={`/product/${item.slug}` as Route} className="amazon-card__quad-item">
              <div className="amazon-card__quad-media">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="amazon-card__quad-image"
                />
              </div>
              <span className="amazon-card__quad-label">Digital Vector</span>
            </Link>
          ))}
        </div>

        <Link href={'/search?kind=file' as Route} className="amazon-card__link">
          <span>EXPLORE DIGITAL VAULT</span>
          <ArrowRight className="amazon-card__link-icon" />
        </Link>
      </div>
    </div>
  );
}
