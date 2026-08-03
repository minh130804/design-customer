'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck, Star, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroBanner({ photos }: { photos: string[] }) {
  return (
    <section className="hero-banner">
      {/* Animated shimmer sweep overlay */}
      <span aria-hidden className="hero-banner__shimmer" />

      {/* Floating decorative particles */}
      <span aria-hidden className="hero-banner__particle hero-banner__particle--1" />
      <span aria-hidden className="hero-banner__particle hero-banner__particle--2" />
      <span aria-hidden className="hero-banner__particle hero-banner__particle--3" />

      <div className="hero-banner__glow-bg" />

      <div className="hero-banner__inner">
        <div>
          <div className="hero-banner__badge-group">
            <span className="hero-banner__eyebrow">
              <Sparkles className="hero-banner__eyebrow-icon" />
              GLOBAL CREATOR PLATFORM · PRINTED ON DEMAND
            </span>
          </div>

          <h1 className="hero-banner__title">
            UNLEASH UNBOUNDED CREATIVITY.
          </h1>

          <p className="hero-banner__text">
            Explore millions of custom print-on-demand products and instant digital design downloads crafted by elite global designers. Printed with premium precision & delivered worldwide.
          </p>

          <div className="hero-banner__features">
            <div className="hero-banner__feature-pill">
              <ShieldCheck className="hero-banner__feature-icon" />
              <span>100% Buyer Guarantee</span>
            </div>
            <div className="hero-banner__feature-pill">
              <Zap className="hero-banner__feature-icon" />
              <span>Instant Asset Downloads</span>
            </div>
          </div>

          <div className="hero-banner__actions">
            <Button asChild className="btn--cyber-gold">
              <Link href="/search">
                EXPLORE CATALOG
                <ArrowRight className="hero-banner__cta-icon" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="btn--cyber-outline">
              <Link href="/search?kind=file">INSTANT DIGITAL VAULT</Link>
            </Button>
          </div>
        </div>

        {/* ── Visual Showcase Collage ──────────────────────── */}
        <div aria-hidden className="hero-banner__collage">
          {photos[0] && <Photo src={photos[0]} slot="left" />}
          {photos[1] && <Photo src={photos[1]} slot="centre" />}
          {photos[2] && <Photo src={photos[2]} slot="right" />}
        </div>

        <ul aria-hidden className="hero-banner__row">
          {photos.slice(0, 3).map((src) => (
            <li key={src} className="hero-banner__row-item">
              <Image src={src} alt="" fill unoptimized sizes="33vw" className="hero-banner__image" />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Trust Signal Bar ────────────────────────────────── */}
      <div className="hero-banner__trust-bar">
        <div className="hero-banner__trust-item">
          <ShieldCheck className="hero-banner__trust-icon" />
          <span>Secure Payment</span>
        </div>
        <div className="hero-banner__trust-item">
          <Truck className="hero-banner__trust-icon" />
          <span>Express Delivery</span>
        </div>
        <div className="hero-banner__trust-item">
          <Star className="hero-banner__trust-icon" />
          <span>50K+ Reviews</span>
        </div>
        <div className="hero-banner__trust-item">
          <Globe className="hero-banner__trust-icon" />
          <span>Ship Worldwide</span>
        </div>
      </div>
    </section>
  );
}

function Photo({ src, slot }: { src: string; slot: 'left' | 'centre' | 'right' }) {
  return (
    <span className={`hero-banner__photo hero-banner__photo--${slot}`}>
      <Image src={src} alt="" fill unoptimized sizes="220px" className="hero-banner__image" />
    </span>
  );
}
