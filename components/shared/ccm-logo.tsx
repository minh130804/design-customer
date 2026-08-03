import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Authentic, Human-Crafted Luxury Brand Identity Logo for CCM MARKET.
 * Designed with architectural precision, clean geometric minimalism,
 * and high-end brand aesthetics (no AI templates or generic crests).
 */
export function CcmLogo({ className, variant = 'full' }: { className?: string; variant?: 'full' | 'icon' | 'monogram' }) {
  return (
    <div className={cn('inline-flex items-center gap-3 select-none group cursor-pointer', className)}>
      {/* ── Authentic Architectural Geometric Emblem ──────────────── */}
      <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
        {/* Soft subtle glow under emblem */}
        <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all duration-300" />
        
        {/* Main Vector Monogram Frame */}
        <svg
          viewBox="0 0 100 100"
          className="relative h-full w-full drop-shadow-sm transform transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ccmRealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(236, 197, 198)" />
              <stop offset="50%" stopColor="rgb(138, 157, 177)" />
              <stop offset="100%" stopColor="rgb(131, 125, 104)" />
            </linearGradient>
            <linearGradient id="ccmMetalAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(245, 233, 231)" />
              <stop offset="100%" stopColor="rgb(236, 197, 198)" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Architectural Frame */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="22"
            fill="#06131e"
            stroke="url(#ccmRealGrad)"
            strokeWidth="5"
          />

          {/* Interlocking Monogram C-C-M Precision Lines */}
          {/* Outer C Arc */}
          <path
            d="M 44 32 C 30 32 24 42 24 50 C 24 58 30 68 44 68"
            stroke="url(#ccmRealGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner C Arc */}
          <path
            d="M 58 36 C 47 36 42 43 42 50 C 42 57 47 64 58 64"
            stroke="url(#ccmMetalAccent)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* M Vertical & Diagonal Structure */}
          <path
            d="M 64 68 V 32 L 73 50 L 82 32 V 68"
            stroke="url(#ccmRealGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Brand Typography Text ───────────────────────────────── */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-black text-lg tracking-wider text-gray-900 group-hover:text-[#8A9DB1] transition-colors">
              CCM
            </span>
            <span className="font-mono font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-[#ECC5C6] text-gray-950 border border-white/60 uppercase tracking-widest shadow-xs">
              MARKET
            </span>
          </div>
          <span className="font-mono font-bold text-[8.5px] text-gray-600 group-hover:text-[#8A9DB1] tracking-widest uppercase mt-0.5 transition-colors">
            CREATOR POD PLATFORM
          </span>
        </div>
      )}
    </div>
  );
}
