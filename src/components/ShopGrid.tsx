'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  ProductColour,
  CATEGORY_NAMES,
  getColourHex,
} from '@/types/product';
import { ProductCard } from './ProductCard';
import { SearchSuggestions } from './SearchSuggestions';
import { ProductLightbox } from './ProductLightbox';
import { SortDropdown, SortOption } from './SortDropdown';
import { recordClick, fetchClickCounts } from '@/lib/clickTracking';

interface ShopGridProps {
  products: Product[];
  selectedCategory?: ProductCategory | null;
  onClearCategorySelect?: () => void;
}

export const ShopGrid: React.FC<ShopGridProps> = ({
  products,
  selectedCategory,
  onClearCategorySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<ProductCategory>>(new Set());
  const [activeColours, setActiveColours] = useState<Set<ProductColour>>(new Set());
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Filter chips reflect the real catalog, not a fixed list — a new colour
  // used on any product shows up here automatically. Sorted for a stable
  // chip order across renders rather than depending on catalog array order.
  const availableColours = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colours))).sort(),
    [products]
  );

  // Click counts are an optional enhancement (see src/lib/clickTracking.ts) —
  // fetch once on mount, fail silently if the tracking endpoint isn't configured.
  useEffect(() => {
    fetchClickCounts().then(setClickCounts);
  }, []);

  const openProduct = (p: Product) => {
    setLightboxProduct(p);
    recordClick(p.id);
  };

  // Sync selectedCategory from props (e.g. when deep-linked from Hero Carousel)
  useEffect(() => {
    if (selectedCategory) {
      setActiveCategories(new Set([selectedCategory]));
      onClearCategorySelect?.();
    }
  }, [selectedCategory, onClearCategorySelect]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleCategory = (cat: ProductCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleColour = (colour: ProductColour) => {
    setActiveColours((prev) => {
      const next = new Set(prev);
      if (next.has(colour)) {
        next.delete(colour);
      } else {
        next.add(colour);
      }
      return next;
    });
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colours.some((c) => c.toLowerCase().includes(q));

      const matchesCat =
        activeCategories.size === 0 || activeCategories.has(p.category);

      const matchesColour =
        activeColours.size === 0 ||
        p.colours.some((c) => activeColours.has(c));

      return matchesSearch && matchesCat && matchesColour;
    });

    if (sortBy === 'popular') {
      return [...filtered].sort(
        (a, b) => (clickCounts[b.id] ?? 0) - (clickCounts[a.id] ?? 0)
      );
    }
    return filtered;
  }, [products, searchQuery, activeCategories, activeColours, sortBy, clickCounts]);

  // Suggestions for autocomplete (up to 5 items)
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.colours.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  const handleSelectSuggestion = (p: Product) => {
    setSearchQuery(p.name);
    setIsSuggestionsOpen(false);
    openProduct(p);
  };

  return (
    <>
      <h1 className="visually-hidden">The shelf — search and filter every piece</h1>

      <div className="wrap shop-head">
        <div className="toolbar">
          <div className="search-wrap" ref={searchWrapRef}>
            <label className="search-field">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                id="shop-search"
                placeholder="Search “tote”, “pouch”, “mustard”…"
                aria-label="Search pieces"
                role="combobox"
                aria-expanded={isSuggestionsOpen}
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSuggestionsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsSuggestionsOpen(false);
                }}
              />
            </label>

            <SearchSuggestions
              query={searchQuery}
              suggestions={suggestions}
              isOpen={isSuggestionsOpen}
              onSelectProduct={handleSelectSuggestion}
            />
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="wrap shop-layout">
        <aside className="filters" aria-label="Filters">
          <div className="filter-group">
            <h3>Category</h3>
            <div className="filter-chip-list" id="cat-filters">
              {CATEGORY_NAMES.map(({ id, label }) => {
                const isPressed = activeCategories.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    className="chip"
                    aria-pressed={isPressed}
                    onClick={() => toggleCategory(id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Colour</h3>
            <div className="filter-chip-list" id="color-filters">
              {availableColours.map((colour) => {
                const isPressed = activeColours.has(colour);
                const colorHex = getColourHex(colour);
                return (
                  <button
                    key={colour}
                    type="button"
                    className="chip"
                    aria-pressed={isPressed}
                    style={{ '--dot': colorHex } as React.CSSProperties}
                    onClick={() => toggleColour(colour)}
                  >
                    <span className="dot" />
                    {colour}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div>
          <div className="product-grid" id="product-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenLightbox={openProduct}
                staggerIndex={index % 3}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results" id="no-results" style={{ display: 'block' }}>
              <strong>No pieces match that yet.</strong>
              Try a different colour, or clear a filter.
            </div>
          )}
        </div>
      </div>

      <ProductLightbox
        product={lightboxProduct}
        onClose={() => setLightboxProduct(null)}
      />
    </>
  );
};
