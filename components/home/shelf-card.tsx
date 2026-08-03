'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Eye, Sparkles } from 'lucide-react';
import { Money } from '@/components/shared/money';
import { StarRating } from '@/components/product/star-rating';
import type { Listing } from '@/lib/catalog';

type ShelfCardProps = {
  listing: Listing;
  priority?: boolean;
  onQuickView?: (listing: Listing) => void;
};

export function ShelfCard({ listing, priority, onQuickView }: ShelfCardProps) {
  const isBestSeller = listing.rating >= 4.8;
  const isLimitedDeal = Boolean(listing.compareAtCents && listing.compareAtCents > listing.priceCents);

  return (
    <li className="shelf__item">
      <div className="shelf-card">
        <div className="shelf-card__media">
          <Link href={`/product/${listing.slug}` as Route} className="shelf-card__image-link">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 30vw, (max-width: 900px) 25vw, 19vw"
              priority={priority}
              className="shelf-card__image"
            />
          </Link>

          {isBestSeller && (
            <span className="shelf-card__badge-bestseller">🏆 #1 TOP SELLER</span>
          )}

          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(listing)}
              className="shelf-card__quick-btn"
              title="Quick View"
            >
              <Eye className="shelf-card__quick-icon" /> Quick View
            </button>
          )}
        </div>

        <Link href={`/product/${listing.slug}` as Route} className="shelf-card__body">
          <p className="shelf-card__title">{listing.title}</p>

          <div className="shelf-card__rating">
            <StarRating value={listing.rating} count={listing.reviewCount} />
          </div>

          <div className="shelf-card__prices">
            <Money cents={listing.priceCents} className="shelf-card__price-current" />
            {listing.compareAtCents && listing.compareAtCents > listing.priceCents && (
              <Money cents={listing.compareAtCents} tone="struck" size="sm" />
            )}
          </div>

          {isLimitedDeal && (
            <span className="shelf-card__deal-badge">
              <Sparkles className="shelf-card__sparkle-icon" /> LIMITED DROP
            </span>
          )}

          <div className="shelf-card__prime-row">
            <span className="shelf-card__prime-logo">EXPRESS</span>
            <span className="shelf-card__delivery">
              {listing.freeShipping
                ? 'FREE EXPRESS DELIVERY'
                : listing.kind === 'file'
                ? 'INSTANT ASSET VAULT'
                : 'GLOBAL PRINT SHIPPING'}
            </span>
          </div>
        </Link>
      </div>
    </li>
  );
}
