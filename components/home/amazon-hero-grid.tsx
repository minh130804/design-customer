import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Listing } from '@/lib/catalog';
import { Money } from '@/components/shared/money';
import { Flame, Sparkles, ArrowRight, Zap, ShoppingBag, Clock, TrendingUp } from 'lucide-react';

interface AmazonHeroGridProps {
  featured: Listing[];
  podListings: Listing[];
  fileListings: Listing[];
}

const CARD_META = [
  { rank: 1, badge: '🔥 HOT', badgeClass: 'amazon-card__pulse-badge--hot' },
  { rank: 2, badge: '⚡ NEW', badgeClass: 'amazon-card__pulse-badge--new' },
  { rank: 3, badge: '✨ TRENDING', badgeClass: 'amazon-card__pulse-badge--trending' },
  { rank: 4, badge: '💎 PREMIUM', badgeClass: 'amazon-card__pulse-badge--premium' },
] as const;

export function AmazonHeroGrid({ featured, podListings, fileListings }: AmazonHeroGridProps) {
  const dealItem = featured[0] || podListings[0];
  const apparelItems = podListings.slice(0, 4);
  const homeItems = featured.slice(1, 5);
  const fileItems = fileListings.slice(0, 4);

  const cards = [
    {
      meta: CARD_META[0]!,
      icon: <Flame className="amazon-card__head-icon text-rose-600" />,
      title: "TODAY'S LIGHTNING DEAL",
      content: 'deal' as const,
      linkHref: '/search?kind=pod' as Route,
      linkText: 'CLAIM DEAL NOW',
    },
    {
      meta: CARD_META[1]!,
      icon: <ShoppingBag className="amazon-card__head-icon text-[#8A9DB1]" />,
      title: 'CUSTOM APPAREL',
      content: 'apparel' as const,
      linkHref: '/c/clothing' as Route,
      linkText: 'SHOP ALL APPAREL',
    },
    {
      meta: CARD_META[2]!,
      icon: <Sparkles className="amazon-card__head-icon text-[#837D68]" />,
      title: 'HOME & DECOR',
      content: 'home' as const,
      linkHref: '/c/home' as Route,
      linkText: 'DISCOVER DECOR',
    },
    {
      meta: CARD_META[3]!,
      icon: <Zap className="amazon-card__head-icon text-[#8A9DB1]" />,
      title: 'DIGITAL ASSETS',
      content: 'digital' as const,
      linkHref: '/search?kind=file' as Route,
      linkText: 'EXPLORE DIGITAL VAULT',
    },
  ];

  return (
    <div className="amazon-hero-grid my-4">
      {cards.map((card) => (
        <div key={card.title} className="amazon-card">
          {/* Rank Badge */}
          <span className="amazon-card__rank-badge">#{card.meta.rank}</span>

          {/* Animated Pulse Badge */}
          <span className={`amazon-card__pulse-badge ${card.meta.badgeClass}`}>
            {card.meta.badge}
          </span>

          <div className="amazon-card__head">
            {card.icon}
            <h2 className="amazon-card__title">{card.title}</h2>
          </div>

          {/* Card Content */}
          {card.content === 'deal' && dealItem && (
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
                <div className="amazon-card__timer-pill">
                  <Clock className="amazon-card__timer-pill-icon" />
                  <span>Ends in 03:45:12</span>
                </div>
              </div>
            </div>
          )}

          {card.content === 'apparel' && (
            <QuadGrid items={apparelItems} />
          )}

          {card.content === 'home' && (
            <QuadGrid items={homeItems} />
          )}

          {card.content === 'digital' && (
            <QuadGrid items={fileItems} labelOverride="Digital Vector" />
          )}

          <Link href={card.linkHref} className="amazon-card__link">
            <span>{card.linkText}</span>
            <ArrowRight className="amazon-card__link-icon" />
          </Link>

          {/* Trend indicator */}
          <div className="amazon-card__trend">
            <TrendingUp className="amazon-card__trend-icon" />
            <span>Trending this week</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuadGrid({ items, labelOverride }: { items: Listing[]; labelOverride?: string }) {
  return (
    <div className="amazon-card__quad">
      {items.map((item) => (
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
          <span className="amazon-card__quad-label">
            {labelOverride ?? item.title.split(' ')[0]}
          </span>
        </Link>
      ))}
    </div>
  );
}
