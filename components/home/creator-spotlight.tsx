'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Award, Star, Users, MapPin, ArrowRight, ShieldCheck, Crown, Trophy, Medal } from 'lucide-react';
import { SHOPS, featuredListings, type Shop, type Listing } from '@/lib/catalog';

type CreatorSpotlightProps = {
  shops?: Shop[];
  listings?: Listing[];
};

const RANK_TIERS = [
  { label: 'GOLD', emoji: '🥇', mod: 'creator-card--gold', Icon: Crown },
  { label: 'SILVER', emoji: '🥈', mod: 'creator-card--silver', Icon: Trophy },
  { label: 'BRONZE', emoji: '🥉', mod: 'creator-card--bronze', Icon: Medal },
] as const;

export function CreatorSpotlight({ shops = SHOPS, listings }: CreatorSpotlightProps) {
  const featuredShops = shops.slice(0, 3);
  const pool = listings ?? featuredListings(50);

  return (
    <section className="creator-spotlight">
      {/* Decorative animated particles */}
      <span aria-hidden className="creator-spotlight__particle creator-spotlight__particle--1" />
      <span aria-hidden className="creator-spotlight__particle creator-spotlight__particle--2" />

      <div className="creator-spotlight__head">
        <div className="creator-spotlight__title-group">
          <span className="creator-spotlight__badge font-mono">
            <Award className="creator-spotlight__badge-icon" /> HALL OF FAME
          </span>
          <h2 className="creator-spotlight__title">Top Verified Creators & Studios</h2>
        </div>
        <Link href="/search" className="creator-spotlight__see-all">
          Explore All Creators <ArrowRight className="creator-spotlight__arrow-icon" />
        </Link>
      </div>

      <div className="creator-spotlight__grid">
        {featuredShops.map((shop, index) => {
          const shopListings = pool.filter((l) => l.shopSlug === shop.slug).slice(0, 3);
          const rank = RANK_TIERS[index] ?? RANK_TIERS[2]!;
          const RankIcon = rank.Icon;

          return (
            <div key={shop.slug} className={`creator-card ${rank.mod}`}>
              {/* Rank Tier Badge */}
              <span className="creator-card__rank-tier">
                <RankIcon className="creator-card__rank-icon" />
                {rank.label}
              </span>

              <div className="creator-card__header">
                <div className="creator-card__avatar-box">
                  {/* Spinning gradient ring */}
                  <span className="creator-card__spin-ring" aria-hidden />
                  <div className="creator-card__avatar">
                    <span className="creator-card__avatar-text">{shop.name.charAt(0)}</span>
                  </div>
                  {shop.starSeller && (
                    <span className="creator-card__star-badge" title="Star Seller">
                      <ShieldCheck className="creator-card__star-icon" />
                    </span>
                  )}
                </div>

                <div className="creator-card__meta">
                  <h3 className="creator-card__name font-mono">
                    <Link href={`/shop/${shop.slug}` as Route} className="creator-card__link">
                      {shop.name}
                    </Link>
                  </h3>
                  <p className="creator-card__location">
                    <MapPin className="creator-card__loc-icon" /> {shop.location}
                  </p>
                </div>
              </div>

              <p className="creator-card__tagline">{shop.tagline}</p>

              <div className="creator-card__stats">
                <div className="creator-card__stat">
                  <Star className="creator-card__stat-icon text-amber-500" />
                  <span className="creator-card__stat-val">{shop.rating.toFixed(1)}</span>
                  <span className="creator-card__stat-lbl">({shop.reviewCount})</span>
                </div>
                <div className="creator-card__stat">
                  <span className="creator-card__stat-val font-mono">
                    {shop.sales.toLocaleString()}
                  </span>
                  <span className="creator-card__stat-lbl">Sales</span>
                </div>
                <div className="creator-card__stat">
                  <Users className="creator-card__stat-icon text-slate-400" />
                  <span className="creator-card__stat-val font-mono">{shop.admirers}</span>
                  <span className="creator-card__stat-lbl">Fans</span>
                </div>
              </div>

              {/* Sample Product Thumbnails */}
              {shopListings.length > 0 && (
                <div className="creator-card__products">
                  {shopListings.map((item: Listing) => (
                    <Link
                      key={item.slug}
                      href={`/product/${item.slug}` as Route}
                      className="creator-card__thumb-wrapper"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="100px"
                        className="creator-card__thumb"
                      />
                    </Link>
                  ))}
                </div>
              )}

              <Link href={`/shop/${shop.slug}` as Route} className="creator-card__action-btn">
                Visit Shop Showcase
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
