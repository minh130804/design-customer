'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, Check, Download, AlertCircle, Heart, Star, ShieldCheck, Zap } from 'lucide-react';
import { NativeSelect } from '@/components/ui/native-select';
import { QuantityStepper } from '@/components/commerce/quantity-stepper';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Money } from '@/components/shared/money';
import { cn, formatUsd } from '@/lib/utils';
import type { Product, VariationAxis } from '@/lib/products';

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();

  const [choice, setChoice] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(
      product.axes
        .filter((a) => !a.required)
        .map((a) => [a.id, a.options.find((o) => o.available)?.value ?? '']),
    ),
  );
  const [touched, setTouched] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [selectedFont, setSelectedFont] = React.useState('');
  const [selectedPlacement, setSelectedPlacement] = React.useState('');
  const [uploadedFile, setUploadedFile] = React.useState<string | null>(null);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [buying, setBuying] = React.useState(false);

  const digital = product.kind === 'file';
  const missing = product.axes.filter((a) => a.required && !choice[a.id]);

  const deltaCents = product.axes.reduce((sum, axis) => {
    const picked = axis.options.find((o) => o.value === choice[axis.id]);
    return sum + (picked?.deltaCents ?? 0);
  }, 0);
  const unitCents = product.priceCents + deltaCents;

  function validate() {
    setTouched(true);
    if (!missing.length) return true;
    const el = document.getElementById(`axis-${missing[0]!.id}`);
    el?.focus();
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  }

  function onAddToCart(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setAdded(true);
  }

  function onBuyNow() {
    if (!validate()) return;
    setBuying(true);
    router.push('/checkout/delivery');
  }

  return (
    <form onSubmit={onAddToCart} noValidate className="buy-box-cyber">
      {/* Dynamic Variation Axis Selectors */}
      {product.axes.map((axis) => (
        <AxisPicker
          key={axis.id}
          axis={axis}
          basePriceCents={product.priceCents}
          value={choice[axis.id] ?? ''}
          onChange={(v) => {
            setChoice((c) => ({ ...c, [axis.id]: v }));
            setAdded(false);
          }}
          invalid={touched && axis.required && !choice[axis.id]}
        />
      ))}

      {/* Quantity Stepper */}
      {!digital && (
        <div className="buy-box__quantity">
          <p className="buy-box__quantity-label">Quantity</p>
          <QuantityStepper label="Quantity" value={qty} onChange={setQty} max={10} />
        </div>
      )}

      {/* Digital Bundle Contents */}
      {product.bundle && (
        <div className="buy-box__bundle">
          <p className="buy-box__bundle-title">
            <Download className="buy-box__bundle-icon" aria-hidden />
            What you get
          </p>
          <p className="buy-box__bundle-text">
            {product.bundle.contents.join(' · ')} — {product.bundle.sizeLabel} in total.
          </p>
        </div>
      )}

      {/* Personalisation & Custom POD Suite */}
      {product.personalization && (
        <Collapsible defaultOpen={product.kind === 'pod'} className="buy-box__perso">
          <CollapsibleTrigger className="buy-box__perso-trigger">
            <Plus className="buy-box__perso-icon-add" />
            <ChevronDown className="buy-box__perso-icon-open" />
            <span className="font-bold text-xs uppercase tracking-wider text-gray-900">Custom POD Creation Suite</span>
            <span className="buy-box__perso-optional">(optional)</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="buy-box__perso-content space-y-3 pt-2">
            {/* Custom Font Selection */}
            {product.personalization.fontStyles && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">1. Select Typography Style</label>
                <NativeSelect
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="text-xs"
                >
                  <option value="">Default Designer Font</option>
                  {product.personalization.fontStyles.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </NativeSelect>
              </div>
            )}

            {/* Print Placement Selection */}
            {product.personalization.placements && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">2. Select Print Placement</label>
                <NativeSelect
                  value={selectedPlacement}
                  onChange={(e) => setSelectedPlacement(e.target.value)}
                  className="text-xs"
                >
                  <option value="">Standard Front Placement</option>
                  {product.personalization.placements.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </NativeSelect>
              </div>
            )}

            {/* Custom Text / Monogram Input */}
            <div className="space-y-1">
              <label htmlFor="perso" className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                3. Custom Text / Monogram / Name
              </label>
              <Textarea
                id="perso"
                value={note}
                maxLength={product.personalization.maxChars}
                onChange={(e) => setNote(e.target.value)}
                placeholder={product.personalization.hint}
                className="text-xs min-h-[70px]"
              />
              <p className="buy-box__perso-count">
                {note.length}/{product.personalization.maxChars}
              </p>
            </div>

            {/* Custom File Upload */}
            {product.personalization.allowFileUpload && (
              <div className="pt-1">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-1">
                  4. Upload Custom Photo / Logo Vector (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-gray-50/50 p-3 rounded-xl text-center hover:bg-gray-100/60 transition-colors">
                  {uploadedFile ? (
                    <div className="flex items-center justify-between text-xs text-gray-900 font-bold">
                      <span className="truncate">📎 {uploadedFile}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="text-rose-600 hover:underline text-[10px] uppercase font-black ml-2 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*,.pdf,.eps,.ai,.psd"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadedFile(file.name);
                        }}
                      />
                      <span className="text-xs font-black text-cyan-700 hover:text-cyan-800 uppercase tracking-wider block">
                        📁 Drag & Drop or Click to Upload Artwork
                      </span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">Supports PNG, JPG, SVG, EPS, PDF (Max 50MB)</span>
                    </label>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Action Buttons */}
      <div className="buy-box__actions">
        <button
          type="button"
          className="buy-action buy-action--cyber-gold"
          onClick={onBuyNow}
          disabled={buying}
        >
          <Zap className="buy-action__icon" aria-hidden />
          <span className="buy-action__label">
            {buying ? 'Taking you to checkout…' : 'BUY IT NOW'}
          </span>
        </button>

        <button
          type="submit"
          className={cn('buy-action buy-action--primary', added && 'buy-action--done')}
        >
          {added && <Check className="buy-action__icon" aria-hidden />}
          <span className="buy-action__label">{added ? 'Added to cart' : 'Add to cart'}</span>
        </button>
      </div>

      {added && (
        <p className="buy-box__added font-bold">
          {qty} × <Money cents={unitCents} tone="in" size="sm" /> ={' '}
          <Money cents={unitCents * qty} tone="in" size="sm" />
        </p>
      )}

      {/* Favourites Button */}
      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        aria-pressed={saved}
        className={cn('collect-action', saved && 'collect-action--saved')}
      >
        <Heart className="collect-action__icon" aria-hidden />
        {saved ? 'Saved to your favourites' : 'Add to collection'}
      </button>

      {/* Guarantee & Protection Pill */}
      <div className="buy-box__guarantee">
        <ShieldCheck className="buy-box__guarantee-icon" />
        <span>100% Buyer Protection & Money-Back Guarantee</span>
      </div>

      {/* Star Seller Badge */}
      {product.shop.starSeller && (
        <div className="buy-box__star-seller">
          <Star className="buy-box__star-seller-icon" aria-hidden />
          <p className="buy-box__star-seller-text">
            <span className="buy-box__star-seller-lead">Star Seller.</span> {product.shop.name}{' '}
            consistently earned 5-star reviews, shipped on time, and replied quickly to messages.
          </p>
        </div>
      )}
    </form>
  );
}

function AxisPicker({
  axis,
  basePriceCents,
  value,
  onChange,
  invalid,
}: {
  axis: VariationAxis;
  basePriceCents: number;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
}) {
  return (
    <div className="axis-picker">
      <label htmlFor={`axis-${axis.id}`} className="axis-picker__label">
        {axis.label}
        {!axis.required && <span className="axis-picker__optional">(optional)</span>}
      </label>
      {axis.hint && <p className="axis-picker__hint">{axis.hint}</p>}

      <NativeSelect
        id={`axis-${axis.id}`}
        invalid={invalid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an option</option>
        {axis.options.map((o) => (
          <option key={o.value} value={o.value} disabled={!o.available}>
            {o.label}
            {o.deltaCents !== 0 && ` (${formatUsd(basePriceCents + o.deltaCents)})`}
            {!o.available && ' — sold out'}
          </option>
        ))}
      </NativeSelect>

      {invalid && (
        <p className="axis-picker__error">
          <AlertCircle className="axis-picker__error-icon" />
          Please choose a {axis.label.toLowerCase()}
        </p>
      )}
    </div>
  );
}
