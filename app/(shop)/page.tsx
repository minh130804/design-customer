import Link from 'next/link';
import type { Metadata, Route } from 'next';
import { AmazonHeroGrid } from '@/components/home/amazon-hero-grid';
import { LightningDeals } from '@/components/home/lightning-deals';
import { HubNav } from '@/components/home/hub-nav';
import { Shelf } from '@/components/home/shelf';
import { ShelfCard } from '@/components/home/shelf-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Card, CardBody } from '@/components/ui/card';
import { StarRating } from '@/components/product/star-rating';
import { BasketNudge } from '@/components/commerce/basket-nudge';
import { featuredListings, searchListings, SHOPS } from '@/lib/catalog';
import { getCart } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'CCM Market — Grand E-Commerce Marketplace',
  description:
    'Discover millions of custom print-on-demand items, personalized gifts, and instant digital design downloads with fast global delivery.',
};

export default async function HomePage() {
  const featured = featuredListings(20);
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

      {/* Lightning Drops Section with Realtime Countdown Timer */}
      <LightningDeals listings={pod} />

      {/* ── Group 1: Best Sellers & Trending Drops ─────────────────────── */}
      <Shelf title="🌟 Top Sellers & Trending Drops Across Platform" href="/search">
        {featured.slice(0, 12).map((l, i) => (
          <ShelfCard key={l.slug} listing={l} priority={i < 4} />
        ))}
      </Shelf>

      {/* ── Group 2: Clothing, T-Shirts & Custom Apparel ─────────── */}
      <Shelf title="👕 Clothing, T-Shirts & Custom Print Apparel" href={'/c/clothing' as Route}>
        {(clothing.length ? clothing : pod).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 3: Home & Living Decor, Mugs & Wall Art ────────── */}
      <Shelf title="🏡 Home & Living Decor, Mugs & Wall Art" href={'/c/home' as Route}>
        {(home.length ? home : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 4: Print-On-Demand & Personalized Gifts ────────── */}
      <Shelf title="⚡ Print-On-Demand & Personalized Custom Gifts" href={'/search?kind=pod' as Route}>
        {pod.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 5: Instant Digital Assets & Vector Downloads ────── */}
      <Shelf title="💎 Instant Digital Assets (3D Assets, UI Kits & Vectors)" href={'/search?kind=file' as Route}>
        {files.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 6: Jewelry & Handmade Accessories ────────────── */}
      <Shelf title="🎁 Fine Jewelry & Handmade Accessories" href={'/c/jewelry' as Route}>
        {(jewelry.length ? jewelry : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 7: Paper, Party & Stationery Supplies ────────── */}
      <Shelf title="📜 Paper, Party Cards & Craft Supplies" href={'/c/paper' as Route}>
        {(paper.length ? paper : featured).slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* ── Group 8: Ready to Ship (Express Delivery) ──────────── */}
      <Shelf title="🛡️ Ready to Ship Items (2-4 Days Express Delivery)" href={'/search?kind=stock' as Route}>
        {stock.slice(0, 12).map((l) => (
          <ShelfCard key={l.slug} listing={l} />
        ))}
      </Shelf>

      {/* Top Verified Sellers Showcase */}
      <section className="home__shops">
        <SectionHeading className="home__shops-heading">Top Verified Sellers & Creators</SectionHeading>
        <div className="home__shops-grid">
          {SHOPS.map((shop) => (
            <Card key={shop.slug} interactive className="shop-teaser">
              <CardBody>
                <div className="shop-teaser__head">
                  <h3 className="shop-teaser__name">
                    <Link
                      href={`/shop/${shop.slug}` as Route}
                      className="shop-teaser__link"
                    >
                      {shop.name}
                    </Link>
                  </h3>
                  {shop.starSeller && (
                    <span className="shop-teaser__star-seller">
                      Star Seller
                    </span>
                  )}
                </div>
                <p className="shop-teaser__location">{shop.location}</p>
                <p className="shop-teaser__tagline">{shop.tagline}</p>
                <div className="shop-teaser__rating">
                  <StarRating value={shop.rating} count={shop.reviewCount} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
