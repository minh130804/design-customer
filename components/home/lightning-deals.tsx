'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Timer, Zap, ChevronRight, Flame } from 'lucide-react';
import type { Listing } from '@/lib/catalog';
import { Money } from '@/components/shared/money';

interface LightningDealsProps {
  listings: Listing[];
}

export function LightningDeals({ listings }: LightningDealsProps) {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 5, minutes: 42, seconds: 18 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwo = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="lightning-deals">
      <div className="lightning-deals__header">
        <div className="lightning-deals__title-group">
          <div className="lightning-deals__badge-live">
            <Flame className="lightning-deals__flame-icon" />
            <span>LIVE DROPS</span>
          </div>

          <h2 className="lightning-deals__title">LIGHTNING DROPS ZONE</h2>

          <div className="lightning-deals__timer-box">
            <Timer className="lightning-deals__timer-icon" />
            <span className="lightning-deals__timer-text">
              CLOSING IN {formatTwo(timeLeft.hours)}:{formatTwo(timeLeft.minutes)}:{formatTwo(timeLeft.seconds)}
            </span>
          </div>
        </div>

        <Link href={'/search?kind=pod' as Route} className="lightning-deals__see-all">
          <span>VIEW ALL DROPS</span>
          <ChevronRight className="lightning-deals__see-all-icon" />
        </Link>
      </div>

      <div className="lightning-deals__carousel">
        {listings.slice(0, 6).map((item, index) => {
          const discountPct = 30 + (index * 6) % 35;
          const dealPrice = Math.round(item.priceCents * (1 - discountPct / 100));
          const progressPct = 52 + (index * 8) % 42;

          return (
            <div key={item.slug} className="lightning-deals__card">
              <Link href={`/product/${item.slug}` as Route} className="lightning-deals__card-media">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="lightning-deals__card-image"
                />
                <span className="lightning-deals__badge">🔥 -{discountPct}% OFF</span>
              </Link>

              <div className="lightning-deals__card-body">
                <div className="lightning-deals__pricing">
                  <Money cents={dealPrice} className="lightning-deals__price-sale" />
                  <Money cents={item.priceCents} className="lightning-deals__price-orig" />
                </div>

                <h3 className="lightning-deals__item-title">
                  <Link href={`/product/${item.slug}` as Route}>{item.title}</Link>
                </h3>

                <div className="lightning-deals__progress-group">
                  <div className="lightning-deals__progress-bar">
                    <div
                      className="lightning-deals__progress-fill"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="lightning-deals__progress-meta">
                    <span className="lightning-deals__progress-text">{progressPct}% CLAIMED</span>
                    <Zap className="lightning-deals__progress-zap" />
                  </div>
                </div>

                <span className="lightning-deals__prime-tag">⚡ EXPRESS PRIME DELIVERY</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
