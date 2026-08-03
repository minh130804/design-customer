'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Layers, X, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import type { MenuNode } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface AmazonDrawerProps {
  tree: MenuNode[];
}

export function AmazonDrawer({ tree }: AmazonDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [activeSlug, setActiveSlug] = React.useState<string>(() => tree[0]?.slug ?? 'clothing');

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const activeNode = tree.find((node) => node.slug === activeSlug) ?? tree[0] ?? null;

  return (
    <div className="relative amazon-drawer">
      {/* Drawer / Flyout Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="amazon-drawer__trigger"
        aria-label="Open All Categories Menu"
      >
        <Layers className="amazon-drawer__trigger-icon" />
        <span className="amazon-drawer__trigger-label">CATEGORIES & ALL</span>
        <ChevronDown className="h-3.5 w-3.5 ml-0.5 text-gray-950" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />

          {/* 2-Column Mega Flyout Panel matching screenshot */}
          <div className="absolute left-0 top-full mt-2 z-50 w-[880px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden flex animate-in fade-in zoom-in-95 duration-200 text-gray-900">
            {/* Left Sidebar Column - Categories List */}
            <div className="w-[260px] bg-gray-50/90 border-r border-gray-200 py-3 shrink-0 overflow-y-auto max-h-[560px]">
              <div className="px-4 py-2 border-b border-gray-200/80 mb-2">
                <span className="text-[10px] font-mono font-black text-[#8A9DB1] uppercase tracking-widest block">
                  EXPLORE PLATFORM
                </span>
                <span className="font-mono font-black text-xs text-gray-900 uppercase">
                  CATEGORIES DIRECTORY
                </span>
              </div>

              <ul className="space-y-0.5">
                {tree.map((node) => {
                  const isActive = node.slug === activeSlug;
                  return (
                    <li key={node.slug}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveSlug(node.slug)}
                        onClick={() => setActiveSlug(node.slug)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold transition-all text-gray-700 hover:bg-gray-200/70',
                          isActive && 'bg-gray-200/90 text-gray-950 font-extrabold border-l-4 border-l-[#8A9DB1] shadow-xs'
                        )}
                      >
                        <span className="truncate">{node.label}</span>
                        <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform', isActive ? 'text-[#8A9DB1] translate-x-0.5' : 'text-gray-400')} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Main Panel - Subcategory Cards Grid with Avatar Thumbnails */}
            {activeNode && (
              <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[560px]">
                {/* Header Link e.g. "All Home & Living →" */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <Link
                    href={activeNode.href as Route}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 font-mono font-black text-base text-gray-900 hover:text-[#8A9DB1] uppercase tracking-wider group"
                  >
                    <span>All {activeNode.label}</span>
                    <ArrowRight className="h-4 w-4 text-[#8A9DB1] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Subcategories Grid with Rounded Square Photo Avatars */}
                {activeNode.children && activeNode.children.length > 0 ? (
                  <div className="grid grid-cols-3 gap-5">
                    {activeNode.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={child.href as Route}
                        onClick={() => setOpen(false)}
                        className="group flex flex-col items-center text-center outline-none"
                      >
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 mb-2 border border-gray-200/80 shadow-xs group-hover:shadow-md group-hover:border-[#ECC5C6] transition-all duration-300">
                          <Image
                            src={child.image}
                            alt={child.label}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-bold text-xs text-gray-800 group-hover:text-gray-950 transition-colors line-clamp-2">
                          {child.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <p className="text-xs font-bold">No subcategories under {activeNode.label}</p>
                    <Link
                      href={activeNode.href as Route}
                      onClick={() => setOpen(false)}
                      className="mt-3 inline-block text-xs font-black text-[#8A9DB1] hover:underline"
                    >
                      View all items in {activeNode.label} →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
