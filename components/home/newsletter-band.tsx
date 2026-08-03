'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Dải đăng ký newsletter cuối trang — animated gradient background + glow input.
 * Không gọi API thật, chỉ hiển thị trạng thái "subscribed" khi submit.
 */
export function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <section className="newsletter-band">
      {/* Animated gradient decoration */}
      <span aria-hidden className="newsletter-band__glow newsletter-band__glow--left" />
      <span aria-hidden className="newsletter-band__glow newsletter-band__glow--right" />

      <div className="newsletter-band__inner">
        <div className="newsletter-band__icon-wrap">
          <Mail className="newsletter-band__mail-icon" />
          <Sparkles className="newsletter-band__sparkle" />
        </div>

        <div className="newsletter-band__copy">
          <h2 className="newsletter-band__title">
            Join 500K+ Creators & Buyers
          </h2>
          <p className="newsletter-band__text">
            Get exclusive drops, flash deals, trending designs & creator spotlights — delivered to your inbox.
          </p>
        </div>

        {subscribed ? (
          <div className="newsletter-band__success">
            <span className="newsletter-band__success-text">
              🎉 You&apos;re subscribed! Welcome to the community.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-band__form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="newsletter-band__input"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="newsletter-band__btn">
              <span>Subscribe</span>
              <ArrowRight className="newsletter-band__btn-icon" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
