import * as React from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Money } from '@/components/shared/money';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';
import type { Totals } from '@/lib/cart';

export function OrderSummary({
  totals,
  children,
  note,
}: {
  totals: Totals;
  children?: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <Card className="order-summary border border-violet-500/30 shadow-xl bg-gradient-to-b from-white to-violet-50/20 rounded-2xl overflow-hidden">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h2 className="order-summary__title font-mono font-black text-lg text-gray-900 tracking-wider uppercase">ORDER SUMMARY</h2>
        </div>

        <dl className="order-summary__lines space-y-2.5 text-xs font-semibold text-gray-700">
          <Row term={`Items Subtotal (${totals.itemCount})`}>
            <Money cents={totals.subtotalCents} size="sm" />
          </Row>
          <Row term="Estimated Shipping">
            {totals.shippingCents === 0 ? (
              <span className="order-summary__free text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded uppercase text-[10px] tracking-wide border border-emerald-200">FREE EXPRESS</span>
            ) : (
              <Money cents={totals.shippingCents} size="sm" />
            )}
          </Row>
          <Row term="Sales Tax (estimated)">
            <Money cents={totals.taxCents} size="sm" />
          </Row>
        </dl>

        <div className="order-summary__total mt-5 pt-4 border-t-2 border-dashed border-violet-300 flex items-baseline justify-between">
          <span className="order-summary__total-label font-mono font-black text-base uppercase tracking-wider text-gray-950">TOTAL DUE</span>
          <div className="text-right">
            <Money cents={totals.totalCents} size="lg" className="text-xl font-black text-violet-700 font-mono tracking-tight" />
            <p className="text-[10px] text-gray-400 font-medium">Includes VAT & Duty Charges</p>
          </div>
        </div>

        {totals.shopCount > 1 && (
          <div className="order-summary__parcels mt-4 bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl flex items-start gap-2.5">
            <Truck className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-950 font-medium leading-relaxed">
              Arriving in <strong className="font-extrabold">{totals.parcelCount} {totals.parcelCount === 1 ? 'parcel' : 'separate parcels'}</strong> from <strong className="font-extrabold">{totals.shopCount} verified shops</strong>
              {totals.hasDigital && ' + instant digital download links'}.
            </p>
          </div>
        )}

        {children && <div className="order-summary__cta mt-5">{children}</div>}

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>100% Money Back & Delivery Guarantee</span>
        </div>

        {note && <div className="order-summary__note mt-3 text-caption text-gray-500">{note}</div>}
      </CardBody>
    </Card>
  );
}

function Row({ term, children }: { term: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="order-summary__row flex items-center justify-between">
      <dt className="order-summary__term text-gray-600">{term}</dt>
      <dd className="font-extrabold text-gray-900">{children}</dd>
    </div>
  );
}
