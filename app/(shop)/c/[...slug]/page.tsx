import type { Metadata, Route } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BrowseLayout } from '@/components/commerce/browse-layout';
import { categoryChildTiles, facetsFor, readQuery, searchListings, LISTINGS } from '@/lib/catalog';
import { CATEGORY_TREE, type CategoryNode } from '@/lib/categories';
import { PageTitle } from '@/components/shared/page-title';

type Params = Promise<{ slug: string[] }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateStaticParams() {
  const seen = new Set<string>();
  for (const l of LISTINGS) {
    for (let i = 1; i <= l.categoryPath.length; i++) {
      seen.add(
        l.categoryPath
          .slice(0, i)
          .map((s) => s.toLowerCase().replace(/\s+/g, '-'))
          .join('/'),
      );
    }
  }
  return [...seen].map((p) => ({ slug: p.split('/') }));
}

function findNode(path: string[]): { node: CategoryNode | null; trail: CategoryNode[] } {
  const trail: CategoryNode[] = [];
  let level = CATEGORY_TREE;
  let node: CategoryNode | null = null;

  for (const slug of path) {
    const found = level.find((n) => n.slug === slug);
    if (!found) return { node: null, trail };
    trail.push(found);
    node = found;
    level = found.children ?? [];
  }
  return { node, trail };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { trail } = findNode(slug);
  if (!trail.length) return {};

  const leaf = trail[trail.length - 1]!;
  return {
    title: `${trail.map((n) => n.label).join(' · ')} — CCM Market`,
    description: `Browse ${leaf.label.toLowerCase()} from independent shops. Made to order, in stock, or instant download.`,
    alternates: { canonical: `/c/${slug.join('/')}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const { node, trail } = findNode(slug);
  if (!node) notFound();

  const query = readQuery(sp);

  const base = await searchListings({ ...query, attrs: undefined, category: slug });
  const listings = await searchListings({ ...query, category: slug });
  const facets = facetsFor(slug, base);
  const tiles = categoryChildTiles(slug);

  return (
    <BrowseLayout
      listings={listings}
      facets={facets}
      categoryLabel={node.label}
      categoryLinks={tiles.map((t) => ({ label: t.label, href: t.href }))}
      header={
        <header className="category-page__head mb-8">
          <div className="category-page__crumbs mb-3">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                ...trail.map((n, i) => ({
                  label: n.label,
                  href: `/c/${slug.slice(0, i + 1).join('/')}`,
                })),
              ]}
            />
          </div>

          <PageTitle size="display" className="category-page__title font-mono font-black uppercase text-gray-900 tracking-tight">
            {node.label}
          </PageTitle>

          {/* Subcategories Grid with Featured Avatars on the Same Form */}
          {tiles.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-mono font-black text-sm uppercase tracking-wider text-[#8A9DB1]">
                  EXPLORE SUBCATEGORIES ({tiles.length})
                </h2>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Select a subcategory below or browse all products
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {tiles.map((tile) => (
                  <Link
                    key={tile.href}
                    href={tile.href as Route}
                    className="group bg-white rounded-xl border border-gray-200/90 p-2.5 shadow-sm hover:shadow-xl hover:border-[#ECC5C6] hover:scale-105 transition-all duration-300 text-center flex flex-col items-center justify-between outline-none"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 mb-2 border border-gray-100">
                      <Image
                        src={tile.image}
                        alt={tile.label}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-mono font-black text-[11px] text-gray-900 group-hover:text-[#8A9DB1] uppercase tracking-wider line-clamp-1">
                      {tile.label}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>
      }
    />
  );
}
