'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { X, Star, ShoppingBag, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Listing } from '@/lib/catalog';
import { formatUsd } from '@/lib/utils';

type QuickViewModalProps = {
  listing: Listing | null;
  onClose: () => void;
  onAddToCart?: (listing: Listing, qty: number, color: string, size: string) => void;
};

export function QuickViewModal({ listing, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!listing) return null;

  const discountPercent = listing.compareAtCents
    ? Math.round(((listing.compareAtCents - listing.priceCents) / listing.compareAtCents) * 100)
    : 0;

  const handleAddToCart = () => {
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(listing, quantity, selectedColor, selectedSize);
    }
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="quick-modal__overlay">
      <div className="quick-modal__backdrop" onClick={onClose} />
      <div className="quick-modal__content">
        <button
          type="button"
          onClick={onClose}
          className="quick-modal__close-btn"
          aria-label="Close dialog"
        >
          <X className="quick-modal__close-icon" />
        </button>

        <div className="quick-modal__grid">
          {/* Left Column: Media Preview */}
          <div className="quick-modal__media-wrapper">
            <div className="quick-modal__media">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="quick-modal__image"
                priority
              />
              {discountPercent > 0 && (
                <span className="quick-modal__badge-discount">-{discountPercent}% OFF</span>
              )}
              {listing.badges.includes('bestseller') && (
                <span className="quick-modal__badge-seller">🔥 BEST SELLER</span>
              )}
            </div>
            <p className="quick-modal__media-hint">
              <ShieldCheck className="quick-modal__shield-icon" /> 100% Quality Guaranteed & Verified Seller
            </p>
          </div>

          {/* Right Column: Product Details & Purchase Box */}
          <div className="quick-modal__info">
            <div className="quick-modal__shop">
              <Link href={`/shop/${listing.shopSlug}` as Route} className="quick-modal__shop-link">
                {listing.shopName}
              </Link>
              <span className="quick-modal__badge-kind">
                {listing.kind === 'pod' && '⚡ Print-on-Demand'}
                {listing.kind === 'file' && '💎 Digital Asset'}
                {listing.kind === 'stock' && '🛡️ Ready to Ship'}
              </span>
            </div>

            <h2 className="quick-modal__title">{listing.title}</h2>

            <div className="quick-modal__rating font-mono">
              <div className="quick-modal__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`quick-modal__star ${
                      i < Math.floor(listing.rating) ? 'quick-modal__star--filled' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="quick-modal__rating-score">{listing.rating.toFixed(1)}</span>
              <span className="quick-modal__rating-count">({listing.reviewCount} reviews)</span>
              <span className="quick-modal__sold">• {listing.soldCount.toLocaleString()} sold</span>
            </div>

            {/* Pricing Section */}
            <div className="quick-modal__pricing">
              <span className="quick-modal__price-current">{formatUsd(listing.priceCents)}</span>
              {listing.compareAtCents && (
                <span className="quick-modal__price-compare">{formatUsd(listing.compareAtCents)}</span>
              )}
              {listing.freeShipping && (
                <span className="quick-modal__free-ship">🚚 Free Shipping</span>
              )}
            </div>

            {/* Variant 1: Color Swatches */}
            {listing.kind !== 'file' && (
              <div className="quick-modal__option-group">
                <label className="quick-modal__option-label">
                  Color: <span className="quick-modal__option-value">{selectedColor}</span>
                </label>
                <div className="quick-modal__options">
                  {['Black', 'Cream', 'Navy Slate'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`quick-modal__pill ${
                        selectedColor === col ? 'quick-modal__pill--active' : ''
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant 2: Size Pills */}
            {listing.kind === 'pod' && (
              <div className="quick-modal__option-group">
                <label className="quick-modal__option-label">
                  Size: <span className="quick-modal__option-value">{selectedSize}</span>
                </label>
                <div className="quick-modal__options">
                  {['S', 'M', 'L', 'XL', '2XL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`quick-modal__pill ${
                        selectedSize === sz ? 'quick-modal__pill--active' : ''
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls & Urgency Indicator */}
            <div className="quick-modal__qty-row">
              <label className="quick-modal__option-label">Quantity:</label>
              <div className="quick-modal__qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quick-modal__qty-btn"
                >
                  -
                </button>
                <span className="quick-modal__qty-val">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="quick-modal__qty-btn"
                >
                  +
                </button>
              </div>
              <span className="quick-modal__stock-tag">⚡ In Stock (Ready to dispatch)</span>
            </div>

            {/* CTA Buttons */}
            <div className="quick-modal__actions">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`quick-modal__add-btn ${isAdded ? 'quick-modal__add-btn--success' : ''}`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="quick-modal__cta-icon" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="quick-modal__cta-icon" /> Add to Basket
                  </>
                )}
              </button>

              <Link
                href={`/product/${listing.slug}` as Route}
                className="quick-modal__details-link"
                onClick={onClose}
              >
                <Zap className="quick-modal__cta-icon" /> View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
