import { Scissors, Printer, Truck, Droplets, ShieldCheck, Leaf, Pencil, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Expandable } from './expandable';
import { formatUsd, deliveryWindow } from '@/lib/utils';
import type { Product } from '@/lib/products';

const ICON = {
  material: Scissors,
  made: Printer,
  ship: Truck,
  care: Droplets,
} as const;

export function ItemDetails({ product }: { product: Product }) {
  const digital = product.kind === 'file';
  const window_ = deliveryWindow(
    product.quotedFrom,
    product.leadTimeMinDays,
    product.leadTimeMaxDays,
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={['details', 'shipping', 'faq']}
      className="item-details"
    >
      {/* ── Item Details Accordion ───────────────────────── */}
      <AccordionItem value="details">
        <AccordionTrigger>Item details</AccordionTrigger>
        <AccordionContent>
          <h3 className="item-details__highlights-title">Highlights & Key Features</h3>
          <ul className="item-details__highlights">
            {product.highlights.map((h) => {
              const Icon = ICON[h.icon] ?? Scissors;
              return (
                <li key={h.text} className="item-details__highlight">
                  <Icon className="item-details__highlight-icon" aria-hidden />
                  {h.text}
                </li>
              );
            })}
          </ul>

          <Expandable>
            {product.description.map((para) => (
              <p key={para.slice(0, 24)} className="item-details__para">
                {para}
              </p>
            ))}

            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mt-4 mb-2">Specifications & Attributes</h4>
            <dl className="item-details__attrs">
              {product.attributes.map((a) => (
                <div key={a.label} className="item-details__attr">
                  <dt className="item-details__term">{a.label}</dt>
                  <dd className="item-details__value">{a.value}</dd>
                </div>
              ))}
            </dl>
          </Expandable>
        </AccordionContent>
      </AccordionItem>

      {/* ── Delivery and Return Policies Accordion ────────── */}
      <AccordionItem value="shipping">
        <AccordionTrigger>
          {digital ? 'Delivery and refund policy' : 'Delivery and return policies'}
        </AccordionTrigger>
        <AccordionContent>
          <dl className="item-details__policies">
            {digital ? (
              <>
                <dt className="item-details__term">Delivery</dt>
                <dd className="item-details__value">
                  Instant download link delivered immediately upon payment clearance to your registered email and account downloads tab.
                </dd>

                <dt className="item-details__term">Download limit</dt>
                <dd className="item-details__value">
                  Unlimited downloads with lifetime cloud access and free future version updates.
                </dd>

                <dt className="item-details__term">Refunds</dt>
                <dd className="item-details__value">
                  100% money back guarantee before file access. If technical defects are found, full replacement or store credit is issued immediately.
                </dd>
              </>
            ) : (
              <>
                <dt className="item-details__term">Arrives by</dt>
                <dd className="item-details__value">{window_}</dd>

                <dt className="item-details__term">Returns</dt>
                <dd className="item-details__value">
                  Accepted within {product.returnWindowDays} days of delivery. Free returns on damaged or misprinted items.
                </dd>

                <dt className="item-details__term">Postage</dt>
                <dd className="item-details__value">
                  {product.shippingCents === 0 ? 'Free Global Express' : formatUsd(product.shippingCents)}
                </dd>

                <dt className="item-details__term">Sent from</dt>
                <dd className="item-details__value">{product.shipsFrom}</dd>

                <dt className="item-details__term">Cancellations</dt>
                <dd className="item-details__value">
                  {product.kind === 'pod'
                    ? 'Accepted within 4 hours of ordering — before going to production print queues.'
                    : 'Accepted any time before carrier handover.'}
                </dd>
              </>
            )}
          </dl>

          {!digital && (
            <button
              type="button"
              className="item-details__deliver-to"
            >
              Deliver to {product.deliverTo}
              <Pencil className="item-details__deliver-icon" aria-hidden />
            </button>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* ── FAQ Accordion ─────────────────────────────────── */}
      <AccordionItem value="faq">
        <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-xs">
            <div>
              <h5 className="font-bold text-gray-900 mb-1">Can I request custom sizes or colors?</h5>
              <p className="text-gray-600 leading-relaxed">
                Yes! Most creators offer custom adjustments. Simply click the "Message Seller" button on the shop card to request custom specs before ordering.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 mb-1">How are items packaged for international shipping?</h5>
              <p className="text-gray-600 leading-relaxed">
                All physical apparel and prints are packed in weatherproof, reinforced eco-friendly mailers to ensure zero damage during transit.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* ── Marketplace Purchase Protection Accordion ─────── */}
      <AccordionItem value="trust">
        <AccordionTrigger>Marketplace Guarantee & Sustainability</AccordionTrigger>
        <AccordionContent>
          <div className="item-details__trust">
            <ShieldCheck className="item-details__trust-icon" aria-hidden />
            <p className="item-details__trust-text">
              <span className="item-details__trust-lead">Purchase Protection.</span> If an order arrives
              damaged, missing, or does not match description, the marketplace refunds
              you in full immediately.
            </p>
          </div>

          <div className="item-details__trust item-details__trust--eco">
            <Leaf className="item-details__trust-icon" aria-hidden />
            <p className="item-details__trust-text">
              Eco-Friendly Print on Demand: Nothing is manufactured until you order it, preventing unsold textile and paper waste.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
