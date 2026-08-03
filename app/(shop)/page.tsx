import type { Metadata } from 'next';
import { AmazonHeroGrid } from '@/components/home/amazon-hero-grid';
import { LightningDeals } from '@/components/home/lightning-deals';
import { HubNav } from '@/components/home/hub-nav';
import { TrustBanner } from '@/components/home/trust-banner';
import { TrendingCats } from '@/components/home/trending-cats';
import { NewsletterBand } from '@/components/home/newsletter-band';
import { BasketNudge } from '@/components/commerce/basket-nudge';
import { HomeShelvesClient } from '@/components/home/home-shelves-client';
import { featuredListings, searchListings, menuTree, SHOPS } from '@/lib/catalog';
import { getCart } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'CCM Market — Grand E-Commerce Marketplace',
  description:
    'Discover millions of custom print-on-demand items, personalized gifts, and instant digital design downloads with fast global delivery.',
};

export default async function HomePage() {
  const featured = featuredListings(20);
  const tree = menuTree();
  const [pod, files, stock, clothing, home, jewelry, paper, cart] = await Promise.all([
    searchListings({ kind: 'pod', sort: 'rating' }),
    searchListings({ kind: 'file', sort: 'rating' }),
    searchListings({ kind: 'stock', sort: 'rating' }),
    searchListings({ category: ['clothing'], sort: 'rating' }),
    searchListings({ category: ['home'], sort: 'rating' }),
    searchListings({ category: ['jewelry'], sort: 'rating' }),
    searchListings({ category: ['paper'], sort: 'rating' }),
    getCart(),
  ]);

  const nudgeLines = cart.flatMap((g) =>
    g.lines.map((l) => ({ id: l.id, title: l.title, image: l.image, shopName: g.shopName })),
  );

  return (
    <>
      <BasketNudge lines={nudgeLines} count={nudgeLines.length} />

      {/* Navigation Pills Bar */}
      <HubNav />

      {/* 4 Department Showcase Cards Grid */}
      <div className="home__hero-wrapper">
        <AmazonHeroGrid featured={featured} podListings={pod} fileListings={files} />
      </div>

      {/* Trending Categories Carousel */}
      <TrendingCats tree={tree} />

      {/* Lightning Drops Section with Realtime Countdown Timer */}
      <LightningDeals listings={pod} />

      {/* Trust Signal Pillars */}
      <TrustBanner />

      {/* Client Shelves with Quick-View Modal & Live Activity Toast */}
      <HomeShelvesClient
        featured={featured}
        pod={pod}
        files={files}
        stock={stock}
        clothing={clothing}
        home={home}
        jewelry={jewelry}
        paper={paper}
        shops={SHOPS}
      />

      {/* Newsletter CTA Banner */}
      <NewsletterBand />
    </>
  );
}
