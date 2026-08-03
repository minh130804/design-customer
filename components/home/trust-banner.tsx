'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Truck, Award, Users } from 'lucide-react';

type PillarData = {
  icon: typeof ShieldCheck;
  value: number;
  suffix: string;
  label: string;
  description: string;
};

const PILLARS: PillarData[] = [
  {
    icon: ShieldCheck,
    value: 100,
    suffix: '%',
    label: 'Buyer Protection',
    description: 'Full refund on all orders with dispute resolution',
  },
  {
    icon: Truck,
    value: 2,
    suffix: 'M+',
    label: 'Products Shipped',
    description: 'Global express delivery to 190+ countries',
  },
  {
    icon: Award,
    value: 50,
    suffix: 'K+',
    label: 'Verified Sellers',
    description: 'Handpicked creators & certified print studios',
  },
  {
    icon: Users,
    value: 800,
    suffix: 'K+',
    label: 'Happy Customers',
    description: 'Trusted by buyers worldwide since 2024',
  },
];

/**
 * Dải 4 trụ cột tin cậy — hiệu ứng counter animation khi scroll vào vùng nhìn.
 */
export function TrustBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="trust-banner">
      <div className="trust-banner__inner">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.label} className="trust-banner__pillar">
              <div className="trust-banner__icon-ring">
                <Icon className="trust-banner__icon" />
              </div>
              <div className="trust-banner__counter">
                {visible ? (
                  <CountUp value={pillar.value} suffix={pillar.suffix} />
                ) : (
                  <span className="trust-banner__value">0{pillar.suffix}</span>
                )}
              </div>
              <h3 className="trust-banner__label">{pillar.label}</h3>
              <p className="trust-banner__desc">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Animated counter — đếm từ 0 lên target value.
 */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="trust-banner__value">
      {count.toLocaleString()}{suffix}
    </span>
  );
}
