'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';

type ActivityItem = {
  id: string;
  name: string;
  location: string;
  productTitle: string;
  timeAgo: string;
  image: string;
  kind: 'purchase' | 'viewing';
};

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    name: 'Minh T.',
    location: 'Ha Noi, VN',
    productTitle: 'Cyberpunk Neon Streetwear Hoodie',
    timeAgo: '2 minutes ago',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=150&q=80',
    kind: 'purchase',
  },
  {
    id: '2',
    name: 'Alex R.',
    location: 'California, US',
    productTitle: 'Lotus Tee in cream',
    timeAgo: '5 minutes ago',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&q=80',
    kind: 'purchase',
  },
  {
    id: '3',
    name: 'Elena K.',
    location: 'Singapore',
    productTitle: 'Cyber-Lux 3D UI & Icon Kit',
    timeAgo: 'Just now',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
    kind: 'purchase',
  },
  {
    id: '4',
    name: 'Kenji Y.',
    location: 'Tokyo, JP',
    productTitle: 'Gold Golden Dragon Wall Canvas Print',
    timeAgo: '8 minutes ago',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&q=80',
    kind: 'purchase',
  },
];

export function LiveActivityToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial show after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Interval to cycle toasts
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SAMPLE_ACTIVITIES.length);
        setIsVisible(true);
      }, 600);
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const activity = SAMPLE_ACTIVITIES[currentIndex] ?? SAMPLE_ACTIVITIES[0];
  if (!activity) return null;

  return (
    <div className="live-toast">
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="live-toast__close"
        aria-label="Dismiss toast"
      >
        <X className="live-toast__close-icon" />
      </button>

      <div className="live-toast__body">
        <div className="live-toast__media">
          <Image
            src={activity.image}
            alt={activity.productTitle}
            width={48}
            height={48}
            className="live-toast__image"
          />
          <span className="live-toast__icon-badge">
            {activity.kind === 'purchase' ? (
              <ShoppingBag className="live-toast__badge-icon" />
            ) : (
              <Flame className="live-toast__badge-icon" />
            )}
          </span>
        </div>

        <div className="live-toast__info">
          <p className="live-toast__header">
            <span className="live-toast__buyer">{activity.name}</span> in{' '}
            <span className="live-toast__location">{activity.location}</span>
          </p>
          <p className="live-toast__product">{activity.productTitle}</p>
          <div className="live-toast__meta">
            <span className="live-toast__tag">
              <ShieldCheck className="live-toast__shield" /> Verified Order
            </span>
            <span className="live-toast__time">{activity.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
