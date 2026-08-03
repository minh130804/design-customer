import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['elev-1', 'elev-2', 'elev-3', 'elev-4'] }],
      rounded: [{ rounded: ['pill', 'base', 'card'] }],
      'font-size': [
        {
          text: [
            'heading', 'price', 'title-lg', 'title', 'title-sm',
            'body', 'body-sm', 'caption',
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatUsd = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );

export function deliveryWindow(from: string, minDays: number, maxDays: number) {
  const base = new Date(from + 'T00:00:00Z');
  const at = (d: number) => {
    const x = new Date(base);
    x.setUTCDate(x.getUTCDate() + d);
    return x;
  };
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return `${fmt.format(at(minDays))}–${fmt.format(at(maxDays))}`;
}

const PRODUCT_PHOTOS = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
];

export function demoPhoto(seed: string, size = 800): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PRODUCT_PHOTOS.length;
  return (PRODUCT_PHOTOS[index] ?? PRODUCT_PHOTOS[0]) as string;
}
