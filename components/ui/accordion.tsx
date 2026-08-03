'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * shadcn `accordion`, đổi phần trình bày cho khớp `info-section-content-toggle`
 * của Etsy: gạch chân mảnh giữa các mục, tiêu đề sans 16px/500 (KHÔNG serif),
 * mũi tên xoay 180° khi mở.
 *
 * Radix lo phần khó: quản lý `aria-expanded`, `aria-controls`, điều hướng
 * bàn phím, và animation chiều cao qua biến CSS `--radix-accordion-content-height`
 * (không thể tính bằng CSS thuần vì `height: auto` không animate được).
 */
const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('accordion__item', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="accordion__header">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn('accordion__trigger', className)}
      {...props}
    >
      {children}
      <ChevronDown className="accordion__chevron" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion__panel"
    {...props}
  >
    <div className={cn('accordion__body', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
