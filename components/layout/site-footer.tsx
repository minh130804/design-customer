'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Globe, ArrowUp } from 'lucide-react';
import { CcmLogo } from '@/components/shared/ccm-logo';

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="site-footer__back-to-top"
      >
        <ArrowUp className="site-footer__back-icon" />
        <span>Back to top</span>
      </button>

      {/* Multi-column Directory */}
      <div className="site-footer__main">
        <div className="site-footer__inner">
          <div className="site-footer__grid">
            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Get to Know Us</h4>
              <ul className="site-footer__list">
                <li><Link href={'/help/buying' as Route}>About CCM Market</Link></li>
                <li><Link href="/sell">Careers & Creators</Link></li>
                <li><Link href={'/help/buying' as Route}>Press Center</Link></li>
                <li><Link href={'/help/buying' as Route}>Sustainability</Link></li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Make Money with Us</h4>
              <ul className="site-footer__list">
                <li><Link href="/sell">Sell on CCM Market</Link></li>
                <li><Link href="/sell">Sell Custom POD Designs</Link></li>
                <li><Link href="/sell">Become an Affiliate</Link></li>
                <li><Link href="/sell">Advertise Your Products</Link></li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Payment Products</h4>
              <ul className="site-footer__list">
                <li><Link href="/gift-cards">CCM Business Cards</Link></li>
                <li><Link href="/gift-cards">Gift Cards & Voucher</Link></li>
                <li><Link href="/cart">Reload Your Balance</Link></li>
                <li><Link href={'/help/buying' as Route}>Currency Converter</Link></li>
              </ul>
            </div>

            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Let Us Help You</h4>
              <ul className="site-footer__list">
                <li><Link href="/account/orders">Your Account & Orders</Link></li>
                <li><Link href="/account/favourites">Your Favourites</Link></li>
                <li><Link href={'/help/buying' as Route}>Shipping Rates & Policies</Link></li>
                <li><Link href={'/help/buying' as Route}>Returns & Replacements</Link></li>
                <li><Link href={'/help/buying' as Route}>Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding Bar */}
      <div className="site-footer__brand-bar">
        <div className="site-footer__inner site-footer__brand-inner">
          <Link href="/" className="site-footer__logo">
            <CcmLogo />
          </Link>

          <div className="site-footer__selectors">
            <button type="button" className="site-footer__selector-btn">
              <Globe className="site-footer__selector-icon" />
              <span>English</span>
            </button>

            <button type="button" className="site-footer__selector-btn">
              <span>$ USD - U.S. Dollar</span>
            </button>

            <button type="button" className="site-footer__selector-btn">
              <span>🇻🇳 Vietnam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="site-footer__bottom">
        <div className="site-footer__inner">
          <div className="site-footer__legal">
            <Link href={'/help/buying' as Route}>Conditions of Use</Link>
            <Link href={'/help/buying' as Route}>Privacy Notice</Link>
            <Link href={'/help/buying' as Route}>Your Ads Privacy Choices</Link>
          </div>
          <p className="site-footer__copy">
            &copy; 2026, CCM Market, Inc. or its affiliates. All rights reserved. Amazon-Inspired E-Commerce Platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
