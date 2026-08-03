import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Thẻ. Kiểu dáng ở block BEM `.card` trong `app/styles/ui.css`. */
const cardVariants = cva('card', {
  variants: {
    tone: {
      plain: '',
      quiet: 'card--quiet',
      trust: 'card--trust',
      selected: 'card--selected',
    },
    interactive: { true: 'card--interactive' },
  },
  defaultVariants: { tone: 'plain' },
});

export type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({ className, tone, interactive, ...props }: CardProps) {
  return <div className={cn(cardVariants({ tone, interactive }), className)} {...props} />;
}

export function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('card__body', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('card__title', className)} {...props} />;
}
